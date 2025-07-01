// ===========================================================================
// Window_TranslatorLanguage.js
// ===========================================================================

/*:
 * @target MV MZ
 * @plugindesc Add-on for JulesTranslator: Language selection window.
 * @author Jules
 *
 * @help
 * This file defines the language selection window for JulesTranslator.
 * It should be placed in the `js/plugins/JulesTranslator/` folder if
 * JulesTranslator.js is in `js/plugins/`.
 *
 * This is not a standalone plugin but a component of JulesTranslator.
 */

var JulesTranslator = JulesTranslator || {}; // Ensure namespace exists

(function($) { // $ refers to JulesTranslator
    'use strict';

    if (!Imported.JulesTranslator) {
        console.error("JulesTranslator main plugin is not found or not imported before Window_TranslatorLanguage.js. Make sure JulesTranslator.js is above this file in the plugin manager.");
        return;
    }

    function Window_TranslatorLanguage() {
        this.initialize(...arguments);
    }

    Window_TranslatorLanguage.prototype = Object.create(Window_Command.prototype);
    Window_TranslatorLanguage.prototype.constructor = Window_TranslatorLanguage;

    Window_TranslatorLanguage.prototype.initialize = function(rect) {
        Window_Command.prototype.initialize.call(this, rect);
        // No specific initialization beyond Window_Command needed for now
        // this.refresh(); // makeCommandList is called by Window_Command initialize
    };

    Window_TranslatorLanguage.windowWidth = function() {
        return 240; // Or calculate based on longest language name
    };

    Window_TranslatorLanguage.prototype.makeCommandList = function() {
        if ($.availableLanguages && $.availableLanguages.length > 0) {
            $.availableLanguages.forEach(langCode => {
                // For now, display the lang code. Could map to full names later.
                // const langName = this.languageName(langCode);
                const langName = langCode.toUpperCase();
                this.addCommand(langName, langCode.toLowerCase(), true);
            });
        } else {
            this.addCommand("No Languages Configured", 'cancel', false);
        }
    };

    // Optional: For displaying full language names if keys are just codes
    /*
    Window_TranslatorLanguage.prototype.languageName = function(code) {
        const names = {
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'ja': '日本語',
            'ko': '한국어',
            'zh-cn': '简体中文',
            'zh-tw': '繁體中文',
            'pt': 'Português',
            'it': 'Italiano',
            'ru': 'Русский'
            // Add more as needed
        };
        return names[code.toLowerCase()] || code.toUpperCase();
    };
    */

    Window_TranslatorLanguage.prototype.processOk = function() {
        const symbol = this.currentSymbol();
        if (symbol && symbol !== 'cancel') {
            const newLang = symbol; // Symbol is the lang code
            if ($.targetLanguage !== newLang) {
                $.targetLanguage = newLang; // Actualizar el idioma objetivo global

                // Limpiar caché de traducciones (MyTranslator.dispatchLanguageChange también lo hace)
                // if (MyTranslator.cache) MyTranslator.cache.clear(); // Hecho por dispatch

                // Recargar traducciones manuales para el nuevo idioma
                MyTranslator.loadManualTranslations(); // Esto es asíncrono

                $.log(2, `Translator language changed to: ${newLang} via UI.`);

                // Notificar al sistema que el idioma ha cambiado para que la UI se actualice
                if (MyTranslator.dispatchLanguageChange) {
                    MyTranslator.dispatchLanguageChange();
                }
                // Potentially save this to config if a config manager is used
            }
        }
        this.close(); // Close the window
        // The scene (Scene_TranslatorOptions) should handle popping itself
    };

    // Assign to namespace
    $.Window_TranslatorLanguage = Window_TranslatorLanguage;

})(JulesTranslator);
