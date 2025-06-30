/*:
 * @plugindesc Provides automatic and manual translation capabilities for RPG Maker MV/MZ games.
 * @author Jules
 * @target MV MZ
 *
 * @param Target Language
 * @desc The language to translate the game into (e.g., en, es, ja).
 * @default en
 *
 * @param Machine Translation Service
 * @desc Preferred machine translation service.
 * @type select
 * @option None
 * @value
 * @option Google Translate
 * @value google
 * @option DeepL
 * @value deepl
 * @default
 *
 * @param Google API Key
 * @desc API Key for Google Translate (if selected).
 * @type text
 * @default
 *
 * @param DeepL API Key
 * @desc API Key for DeepL (if selected and using API version).
 * @type text
 * @default
 *
 * @param Enable Text Hooking
 * @desc Enable translation of dynamically displayed text (dialogue, choices).
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Enable Data File Translation
 * @desc Enable translation of text from data files (items, skills, maps).
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param ---- Data File Translation Options ----
 * @default
 *
 * @param Translate Actors.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate names, nicknames, profiles in Actors.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate Classes.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate names in Classes.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate Skills.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate names, descriptions, messages in Skills.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate Items.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate names, descriptions in Items.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate Weapons.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate names, descriptions in Weapons.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate Armors.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate names, descriptions in Armors.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate Enemies.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate names in Enemies.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate States.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate names, messages in States.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate System.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate game title, terms, etc., in System.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate MapInfos.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate map names in MapInfos.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param Translate Event Text
 * @parent ---- Data File Translation Options ----
 * @desc Translate text from events in MapXXX.json and CommonEvents.json.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param ---- Caching Options ----
 * @default
 *
 * @param Enable Translation Cache
 * @parent ---- Caching Options ----
 * @desc Cache translations to improve performance and reduce API calls.
 * @type boolean
 * @on Enable
 * @off Disable
 * @default true
 *
 * @param ---- Manual Translations Options ----
 * @default
 *
 * @param Manual Translation Folder
 * @parent ---- Manual Translations Options ----
 * @desc Folder inside this plugin's directory for manual .json files (e.g., translations/ja_en.json)
 * @type text
 * @default translations
 *
 * @param Game Original Language
 * @parent ---- Manual Translations Options ----
 * @desc The original language of the game data (e.g., ja, en). Helps select correct manual translation files.
 * @type text
 * @default ja
 *
 * @param ---- Debug Options ----
 * @default
 *
 * @param Log Level
 * @parent ---- Debug Options ----
 * @desc Level of detail for console logs.
 * @type select
 * @option None
 * @value 0
 * @option Error
 * @value 1
 * @option Info
 * @value 2
 * @option Debug
 * @value 3
 * @default 2
 *
 * @help
 * ===========================================================================
 * JulesTranslator.js
 * Author: Jules
 * ===========================================================================
 * This plugin provides automatic and manual translation capabilities for
 * RPG Maker MV and RPG Maker MZ games.
 *
 * --- Features ---
 * - Machine translation via configurable services (Google, DeepL).
 * - Manual translation loading from JSON files.
 * - Translation caching for performance.
 * - Hooks into dialogue, choices, help windows, etc.
 * - Translates data files like Actors, Items, Skills, Maps, and System terms.
 *
 * --- Setup ---
 * 1. Place this plugin (JulesTranslator.js) and the 'JulesTranslator' folder
 *    (if it contains helper modules or your translations folder) into your
 *    project's `js/plugins/` directory.
 * 2. Activate the plugin in the RPG Maker Plugin Manager.
 * 3. Configure the parameters:
 *    - Target Language: The language you want to translate the game into.
 *    - Machine Translation Service & API Keys: If using machine translation.
 *    - Enable/Disable specific translation features.
 *    - Manual Translation Folder: Usually 'translations'.
 *    - Game Original Language: Helps in selecting the correct manual file.
 *
 * --- Manual Translation Files ---
 * - Create a folder named as per 'Manual Translation Folder' parameter
 *   (default: 'translations') inside `js/plugins/JulesTranslator/`.
 * - Inside this folder, create JSON files named `[original_lang]_[target_lang].json`.
 *   Example: `js/plugins/JulesTranslator/translations/ja_en.json`
 * - JSON Format:
 *   {
 *     "original text key": "translated text",
 *     "こんにちは世界": "Hello World"
 *   }
 *
 * --- Plugin Commands (MV style) ---
 *   JulesTranslator enable          // Enables translation at runtime
 *   JulesTranslator disable         // Disables translation at runtime
 *   JulesTranslator setLang [lang]  // Changes target language (e.g., JulesTranslator setLang es)
 *                                   // This also clears the cache and reloads manual files.
 *   JulesTranslator reload          // Clears cache and reloads manual translation files.
 *
 * --- For RPG Maker MZ ---
 * This plugin aims for MZ compatibility. MZ uses a different plugin command
 * system. If using MZ, ensure you use MZ-style plugin commands if available,
 * or this plugin might later include specific MZ command registration.
 * For parameter types like 'file' or 'struct', this header uses basic
 * text/select types for broader compatibility; adjust as needed for MZ editor.
 *
 * ===========================================================================
 */

var Imported = Imported || {};
Imported.JulesTranslator = true;

var JulesTranslator = JulesTranslator || {}; // Namespace for plugin parameters and functions

(function($) {
    'use strict';

    // --- Parameter Parsing ---
    const pluginName = 'JulesTranslator';
    $.Parameters = PluginManager.parameters(pluginName);

    $.targetLanguage = String($.Parameters['Target Language'] || 'en');
    $.machineService = String($.Parameters['Machine Translation Service'] || '');
    $.googleApiKey = String($.Parameters['Google API Key'] || '');
    $.deepLApiKey = String($.Parameters['DeepL API Key'] || '');

    $.enableTextHooking = ($.Parameters['Enable Text Hooking'] === 'true');
    $.enableDataFileTranslation = ($.Parameters['Enable Data File Translation'] === 'true');

    $.translateDataFiles = {
        actors: ($.Parameters['Translate Actors.json'] === 'true'),
        classes: ($.Parameters['Translate Classes.json'] === 'true'),
        skills: ($.Parameters['Translate Skills.json'] === 'true'),
        items: ($.Parameters['Translate Items.json'] === 'true'),
        weapons: ($.Parameters['Translate Weapons.json'] === 'true'),
        armors: ($.Parameters['Translate Armors.json'] === 'true'),
        enemies: ($.Parameters['Translate Enemies.json'] === 'true'),
        states: ($.Parameters['Translate States.json'] === 'true'),
        system: ($.Parameters['Translate System.json'] === 'true'),
        mapInfos: ($.Parameters['Translate MapInfos.json'] === 'true'),
        eventText: ($.Parameters['Translate Event Text'] === 'true')
    };

    $.enableCache = ($.Parameters['Enable Translation Cache'] === 'true');
    $.manualTranslationFolderName = String($.Parameters['Manual Translation Folder'] || 'translations');
    $.gameOriginalLanguage = String($.Parameters['Game Original Language'] || 'ja');
    $.logLevel = parseInt($.Parameters['LogLevel'] || 2, 10);

    // Construct full path for manual translations
    // This assumes the plugin file JulesTranslator.js is directly in js/plugins/
    // And the JulesTranslator folder is a sibling to it.
    let pluginBaseDir = '';
    const scripts = document.getElementsByTagName('script');
    const path = scripts[scripts.length-1].src.split('?')[0]; // Get this plugin's path
    pluginBaseDir = path.substring(0, path.lastIndexOf('/js/plugins') + 1) + 'js/plugins/'; // Should resolve to .../js/plugins/

    // Path to the folder specific to this plugin, assuming it's named JulesTranslator
    $.pluginSpecificFolder = pluginBaseDir + 'JulesTranslator/';
    $.manualTranslationPath = $.pluginSpecificFolder + $.manualTranslationFolderName + '/';


    // --- Logger ---
    $.log = function(level, ...args) {
        if ($.logLevel >= level) {
            const prefix = (level === 3 ? '[JT-DEBUG]' : (level === 2 ? '[JT-INFO]' : '[JT-ERROR]'));
            console.log(prefix, ...args);
        }
    };

    // --- Global Translator Object ---
    // This will be accessible by other modules if they are also wrapped in the same IIFE
    // or if explicitly exposed (e.g., window.MyTranslator = MyTranslator)
    const MyTranslator = {
        cache: new Map(),
        manualTranslations: {},
        translationServices: {}, // Will hold instances of translation service connectors
        isEnabled: true,
        currentFileContext: null, // For DataManager hooks

        initialize: function() {
            if (!$.enableCache) {
                this.cache = null; // Effectively disables caching
            }
            this.loadManualTranslations();

            // Placeholder for initializing machine translation services
            if ($.machineService === 'google' && $.googleApiKey) {
                // this.translationServices.google = new GoogleTranslateService($.googleApiKey);
                $.log(2, 'Google Translate service placeholder initialized.');
            } else if ($.machineService === 'deepl' && $.deepLApiKey) {
                // this.translationServices.deepl = new DeepLService($.deepLApiKey);
                $.log(2, 'DeepL service placeholder initialized.');
            }

            $.log(2, `JulesTranslator initialized. Target Lang: ${$.targetLanguage}, Original Lang: ${$.gameOriginalLanguage}`);
            $.log(3, 'Parameters:', $.Parameters);
            $.log(3, 'Manual translation path:', $.manualTranslationPath);
        },

        translate: function(originalText, contextInfo = {}) {
            if (!this.isEnabled || !originalText || typeof originalText !== 'string') {
                return originalText;
            }
            const trimmedText = originalText.trim();
            if (trimmedText === '') {
                return originalText;
            }

            // 1. Check cache
            if (this.cache && this.cache.has(trimmedText)) {
                $.log(3, `Cache hit for: "${trimmedText}" -> "${this.cache.get(trimmedText)}"`);
                return this.cache.get(trimmedText);
            }

            // 2. Check manual translations
            if (this.manualTranslations[trimmedText]) {
                const manualTranslation = this.manualTranslations[trimmedText];
                $.log(3, `Manual hit for: "${trimmedText}" -> "${manualTranslation}"`);
                if (this.cache) this.cache.set(trimmedText, manualTranslation);
                return manualTranslation;
            }

            // 3. Machine translation (Placeholder - actual call would be async)
            let translatedText = trimmedText; // Fallback to original if no service or error
            if ($.machineService && this.translationServices[$.machineService]) {
                $.log(3, `Machine translating: "${trimmedText}" via ${$.machineService}`);
                // translatedText = await this.translationServices[$.machineService].translate(trimmedText, $.gameOriginalLanguage, $.targetLanguage, contextInfo);
                // For initial testing of hooks, let's make it very clear:
                translatedText = `[T] ${trimmedText}`;
                $.log(3, `No configured/successful machine translation for "${trimmedText}", returning placeholder.`);
            } else if ($.machineService) { // This case means service was selected but not configured/failed
                translatedText = `[T] ${trimmedText}`; // Still use placeholder
                $.log(1, `Machine translation service "${$.machineService}" selected but not properly configured or API key missing. Using placeholder for "${trimmedText}".`);
            } else { // No machine service selected at all
                 translatedText = `[T] ${trimmedText}`; // Use placeholder
                 $.log(3, `No machine translation service selected. Using placeholder for "${trimmedText}".`);
            }

            if (this.cache) this.cache.set(trimmedText, translatedText);
            return translatedText;
        },

        loadManualTranslations: function() {
            this.manualTranslations = {}; // Clear existing
            const fileName = `${$.gameOriginalLanguage}_${$.targetLanguage}.json`;
            const filePath = $.manualTranslationPath + fileName;
            $.log(2, `Attempting to load manual translations from: ${filePath}`);

            // In RPG Maker MV/MZ, direct file loading from a plugin is typically done
            // by overriding DataManager.loadDataFile for a custom file, or using XHR for web.
            // For NW.js (desktop), Node.js 'fs' can be used.
            // This is a simplified placeholder for now.
            // A more robust solution would use DataManager or an XHR request.

            if (typeof require === 'function' && typeof process === 'object') { // Check if in NW.js environment
                const fs = require('fs');
                const path = require('path');
                try {
                    // Adjust path to be relative to project root if needed
                    // const projectRoot = path.dirname(process.mainModule.filename);
                    // const absoluteFilePath = path.join(projectRoot, filePath);
                    // For simplicity, assuming filePath is accessible as is or via plugin manager's path resolution

                    // This path resolution is tricky. Let's assume for now that the `$.manualTranslationPath` is correct.
                    // In a real scenario, one might need to copy files to a location the game can easily access,
                    // or use specific RPG Maker functions if available for loading plugin local data.

                    // A common pattern is to use XHR even for local files in MV/MZ
                    const xhr = new XMLHttpRequest();
                    xhr.open('GET', filePath, false); // Synchronous for simplicity at init
                    xhr.overrideMimeType('application/json');
                    xhr.onload = () => {
                        if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) { // status 0 for local files
                            try {
                                this.manualTranslations = JSON.parse(xhr.responseText);
                                $.log(2, `Successfully loaded and parsed manual translations from ${fileName}. Found ${Object.keys(this.manualTranslations).length} entries.`);
                            } catch (e) {
                                $.log(1, `Error parsing manual translation file ${fileName}:`, e);
                            }
                        } else {
                             $.log(1, `Failed to load manual translation file ${fileName}. Status: ${xhr.status}`);
                        }
                    };
                    xhr.onerror = () => {
                        $.log(1, `Error loading manual translation file ${fileName} (XHR onerror). Path: ${filePath}`);
                    };
                    xhr.send();

                } catch (e) {
                    $.log(1, `Error trying to load manual translations with Node.js fs (or XHR setup failed): ${fileName}`, e);
                }
            } else {
                $.log(2, "Node.js 'fs' module not available (likely web deployment). Manual file loading via XHR would be typical.");
                // Fallback or alternative XHR loading for web can be placed here.
            }
        },

        // Placeholder for translateDataObject - to be filled by DataManagerHooks
        translateDataObject: function(fileName, dataObject, globalVarName) {
            $.log(3, `translateDataObject called for ${fileName} (${globalVarName}), but not yet implemented.`);
            // Actual implementation will be in JulesTranslator_DataManagerHooks.js
            // and will use $.translateDataFiles to check if translation for this file type is enabled.
        },

        // Placeholder for translateEventList - to be filled by DataManagerHooks
        translateEventList: function(list, contextInfo) {
            $.log(3, `translateEventList called for context ${contextInfo.context}, but not yet implemented.`);
            // Actual implementation will be in JulesTranslator_DataManagerHooks.js
        }
    };

    // --- Initialize Core Systems ---
    MyTranslator.initialize();

    // --- Initialize Hook Modules (Shells for now) ---
    // These would be defined in separate files or later in this file
    $.WindowHooks = {
        initialize: function() {
            if (!$.enableTextHooking) {
                $.log(2, "Text Hooking is disabled by parameters.");
                return;
            }
            $.log(2, "WindowHooks placeholder initialized.");
            // Aliases for Window_Message etc. will go here
        }
    };

    $.DataManagerHooks = {
        _currentDataFileContext: null, // For context passing
        initialize: function() {
            if (!$.enableDataFileTranslation) {
                $.log(2, "Data File Translation is disabled by parameters.");
                return;
            }
            $.log(2, "DataManagerHooks placeholder initialized.");
            // Aliases for DataManager.loadDataFile and DataManager.onLoad will go here
        }
    };

    // Call initializers for hook modules
    // This needs to happen after MyTranslator is fully defined.
    $.WindowHooks.initialize();
    $.DataManagerHooks.initialize();


    // --- Plugin Command Handler (MV Style) ---
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === pluginName) {
            const subCommand = (args[0] || '').toLowerCase();
            switch (subCommand) {
                case 'enable':
                    MyTranslator.isEnabled = true;
                    $.log(2, 'JulesTranslator enabled via plugin command.');
                    break;
                case 'disable':
                    MyTranslator.isEnabled = false;
                    $.log(2, 'JulesTranslator disabled via plugin command.');
                    break;
                case 'setlang':
                    if (args[1]) {
                        $.targetLanguage = String(args[1]);
                        if (MyTranslator.cache) MyTranslator.cache.clear();
                        MyTranslator.loadManualTranslations(); // Reload appropriate file
                        $.log(2, `JulesTranslator language set to: ${$.targetLanguage} via plugin command.`);
                    } else {
                        $.log(1, 'JulesTranslator setLang command missing language argument.');
                    }
                    break;
                case 'reload':
                    if (MyTranslator.cache) MyTranslator.cache.clear();
                    MyTranslator.loadManualTranslations();
                    $.log(2, 'JulesTranslator translations reloaded via plugin command.');
                    break;
                default:
                    $.log(1, `JulesTranslator unknown subcommand: ${subCommand}`);
                    break;
            }
        }
    };

    // MZ Plugin Command Registration (Conceptual - would need Utils.RPGMAKER_NAME check)
    // if (Utils.RPGMAKER_NAME === 'MZ') { // Or a more reliable check for MZ
    //     PluginManager.registerCommand(pluginName, "enable", args => {
    //         MyTranslator.isEnabled = true;
    //         $.log(2, 'JulesTranslator enabled via MZ command.');
    //     });
    //     // ... other MZ commands ...
    // }


})(JulesTranslator); // Pass in the namespace
