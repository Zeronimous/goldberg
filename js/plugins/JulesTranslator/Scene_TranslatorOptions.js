// ===========================================================================
// Scene_TranslatorOptions.js
// ===========================================================================

/*:
 * @target MV MZ
 * @plugindesc Add-on for JulesTranslator: Scene for language options.
 * @author Jules
 *
 * @help
 * This file defines the scene for language selection for JulesTranslator.
 * It should be placed in the `js/plugins/JulesTranslator/` folder if
 * JulesTranslator.js is in `js/plugins/`.
 *
 * This is not a standalone plugin but a component of JulesTranslator.
 */

var JulesTranslator = JulesTranslator || {}; // Ensure namespace exists

(function($) { // $ refers to JulesTranslator
    'use strict';

    if (!Imported.JulesTranslator || !$.Window_TranslatorLanguage) {
        console.error("JulesTranslator main plugin or Window_TranslatorLanguage.js is not found or not imported before Scene_TranslatorOptions.js.");
        return;
    }

    function Scene_TranslatorOptions() {
        this.initialize(...arguments);
    }

    Scene_TranslatorOptions.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_TranslatorOptions.prototype.constructor = Scene_TranslatorOptions;

    Scene_TranslatorOptions.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_TranslatorOptions.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this); // Creates background, help window (if used by base), etc.
        this.createLanguageWindow();
        // Optionally, create a help window for this scene
        this.createHelpWindow(); // Scene_MenuBase provides this
        this._helpWindow.setText($.Parameters['Translator Options Help Text'] || 'Select target language for translation.');
    };

    Scene_TranslatorOptions.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._languageWindow.activate();
        this._languageWindow.select(0); // Select the first item by default
    };

    Scene_TranslatorOptions.prototype.createLanguageWindow = function() {
        const ww = JulesTranslator.Window_TranslatorLanguage.windowWidth();
        // Calculate height based on number of languages, or make it scrollable
        const numLanguages = $.availableLanguages ? $.availableLanguages.length : 1;
        const wh = this.calcWindowHeight(Math.max(1, numLanguages), true); // Min 1 line, true for fitting

        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh - (this._helpWindow ? this._helpWindow.height : 0)) / 2; // Center below help window

        const rect = new Rectangle(wx, wy + (this._helpWindow ? this._helpWindow.height : 0), ww, wh);
        this._languageWindow = new JulesTranslator.Window_TranslatorLanguage(rect);

        this._languageWindow.setHandler('ok',     this.onLanguageOk.bind(this));
        this._languageWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._languageWindow);
    };

    Scene_TranslatorOptions.prototype.onLanguageOk = function() {
        // The window's processOk handles the logic.
        // After the language window closes itself, this scene should also close.
        // Window_TranslatorLanguage calls this.close(), which deactivates it.
        // The scene should then pop.
        this.popScene();
    };

    // Add a parameter for the help text in the main plugin file if desired.
    // For now, adding a placeholder in JulesTranslator.js parameter parsing:
    // $.translatorOptionsHelpText = String($.Parameters['Translator Options Help Text'] || 'Select target language.');

    // Assign to namespace
    $.Scene_TranslatorOptions = Scene_TranslatorOptions;

})(JulesTranslator);
