// ===========================================================================
// JulesTranslator_DataManagerHooks.js
// ===========================================================================

var JulesTranslator = JulesTranslator || {};
JulesTranslator.DataManagerHooks = JulesTranslator.DataManagerHooks || {};

(function($) { // $ refers to JulesTranslator
    'use strict';

    const DataManagerHooks = {
        _currentDataFileContext: null, // To store context between loadDataFile and onLoad

        initialize: function() {
            if (!$.Parameters || !$.Parameters['Enable Data File Translation'] || $.Parameters['Enable Data File Translation'] !== 'true') {
                $.log(2, "DataManagerHooks: Data File Translation is disabled. Skipping hooks.");
                return;
            }
            $.log(2, "DataManagerHooks: Initializing data file loading hooks...");
            this.aliasDataManagerMethods();
        },

        aliasDataManagerMethods: function() {
            const _DataManager_loadDataFile = DataManager.loadDataFile;
            DataManager.loadDataFile = function(name, src) {
                // Store context before the original call, as it might be used by onLoad
                DataManagerHooks._currentDataFileContext = { name: name, src: src, globalVarName: name };
                $.log(3, `DataManagerHooks: Loading data file. Name: ${name}, Src: ${src}`);
                _DataManager_loadDataFile.call(this, name, src);
            };

            const _DataManager_onLoad = DataManager.onLoad;
            DataManager.onLoad = function(object) {
                // It's crucial to capture the context *before* calling the original onLoad,
                // as the original onLoad might trigger further loads, changing the context.
                const capturedContext = DataManagerHooks._currentDataFileContext;

                _DataManager_onLoad.call(this, object); // Call original first

                if (object && capturedContext && $.enableDataFileTranslation) {
                    // Pass the specific object that was just loaded, and its context
                    MyTranslator.translateDataObject(capturedContext.src, object, capturedContext.globalVarName);
                }
                // Clear context after use if this onLoad corresponds to the stored context
                // This logic might need refinement if onLoad is called for things not set by our loadDataFile alias
                if (capturedContext && this._databaseFiles.some(df => df.name === capturedContext.name && df.src === capturedContext.src)) {
                     DataManagerHooks._currentDataFileContext = null;
                }
            };
            $.log(3, "DataManagerHooks: Aliased DataManager.loadDataFile and DataManager.onLoad");
        }
    };

    // Expose the hooks module to the main JulesTranslator scope
    $.DataManagerHooks = DataManagerHooks;

})(JulesTranslator);
