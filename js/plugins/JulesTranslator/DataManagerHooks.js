// ===========================================================================
// JulesTranslator_DataManagerHooks.js
// ===========================================================================

var JulesTranslator = JulesTranslator || {};
JulesTranslator.DataManagerHooks = JulesTranslator.DataManagerHooks || {};

(function($) { // $ refers to JulesTranslator
    'use strict';

    const DataManagerHooks = {
        _lastLoadedFileContext: null, // Stores context for the most recently initiated loadDataFile call

        initialize: function() {
            // Check if Data File Translation is enabled in plugin parameters
            if (!$.Parameters || $.Parameters['Enable Data File Translation'] !== 'true') {
                $.log(2, "DataManagerHooks: Data File Translation is disabled by parameters. Skipping hooks.");
                return;
            }
            $.log(2, "DataManagerHooks: Initializing data file loading hooks...");
            this.aliasDataManagerMethods(); // Call the method to set up aliases
        },

        aliasDataManagerMethods: function() {
            // Alias DataManager.loadDataFile to capture the context of the file being loaded
            const _DataManager_loadDataFile = DataManager.loadDataFile;
            DataManager.loadDataFile = function(name, src) {
                // Store the context (global variable name and source file name)
                // This context will be used by the onLoad alias
                DataManagerHooks._lastLoadedFileContext = { globalVarName: name, src: src };
                $.log(3, `DataManagerHooks: Intercepted loadDataFile. Name: ${name}, Src: ${src}`);
                _DataManager_loadDataFile.call(this, name, src); // Call the original method
            };
            $.log(3, "DataManagerHooks: Aliased DataManager.loadDataFile");

            // Alias DataManager.onLoad to process the data object after it's loaded
            const _DataManager_onLoad = DataManager.onLoad;
            DataManager.onLoad = function(object) {
                // Capture the context stored by the loadDataFile alias
                // Important: Capture it *before* calling the original onLoad, as onLoad might trigger other loads
                // and overwrite _lastLoadedFileContext if not careful.
                const capturedContext = DataManagerHooks._lastLoadedFileContext;

                // Call the original onLoad method first. This is important because the original
                // onLoad might perform essential setup on the object or global variable ($dataSystem, etc.)
                _DataManager_onLoad.call(this, object);

                // After the original onLoad has done its job, if we have a valid context and the object,
                // proceed to translate its contents.
                if (object && capturedContext && $.enableDataFileTranslation) {
                    $.log(3, `DataManagerHooks: Intercepted onLoad for ${capturedContext.src} (assigned to ${capturedContext.globalVarName}). Object loaded.`);
                    // Call the main translation function for data objects
                    MyTranslator.translateDataObject(capturedContext.src, object, capturedContext.globalVarName);
                } else if (object && !capturedContext && $.enableDataFileTranslation) {
                    // This case can happen if onLoad is called for data not loaded via our hooked loadDataFile
                    // (e.g., save games, or other plugins loading data directly).
                    // We might not have context here, so we can't reliably call translateDataObject unless
                    // we can infer the type from 'object' itself, which is risky.
                    $.log(3, `DataManagerHooks: Intercepted onLoad for an object, but no file context captured. Object:`, object);
                }

                // Reset the context only if this onLoad corresponds to the last file context we stored.
                // This helps prevent clearing the context prematurely if multiple loads are chained
                // or if onLoad is called for other reasons.
                // A simple check is if the global variable (e.g., $dataSystem) now holds 'object'.
                if (capturedContext && window[capturedContext.globalVarName] === object) {
                    DataManagerHooks._lastLoadedFileContext = null;
                }
            };
            $.log(3, "DataManagerHooks: Aliased DataManager.onLoad");
        }
    };

    // Assign the implemented DataManagerHooks object to the JulesTranslator namespace
    $.DataManagerHooks = DataManagerHooks;

})(JulesTranslator);
