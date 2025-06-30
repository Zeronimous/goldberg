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
                // Ensure GoogleTranslateService is defined (would be in TranslationServices.js)
                if ($.TranslationServices && $.TranslationServices.GoogleTranslateService) {
                    this.translationServices.google = new $.TranslationServices.GoogleTranslateService($.googleApiKey);
                    $.log(2, 'Google Translate service instance created.');
                } else {
                    $.log(1, 'GoogleTranslateService class not found, cannot initialize.');
                }
            } else if ($.machineService === 'deepl' && $.deepLApiKey) {
                if ($.TranslationServices && $.TranslationServices.DeepLService) {
                    this.translationServices.deepl = new $.TranslationServices.DeepLService($.deepLApiKey);
                    // DeepLService constructor already logs its creation.
                } else {
                    $.log(1, 'DeepLService class not found, cannot initialize.');
                }
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

            // Unique prefix to identify strings that have already been processed by this function
            const PROCESSED_MARKER = "@@JT@@";

            // If text already has the marker, it means it was translated (or attempted) by a higher-level hook.
            // Return it as is, removing the marker for final display (or let drawing functions handle it).
            // For now, we'll assume the marker is internal and should be stripped if found.
            if (originalText.startsWith(PROCESSED_MARKER)) {
                $.log(3, `Skipping translation for already processed text: "${originalText}"`);
                return originalText.substring(PROCESSED_MARKER.length);
            }

            // 1. Check cache
            if (this.cache && this.cache.has(trimmedText)) {
                const cachedResult = this.cache.get(trimmedText);
                $.log(3, `Cache hit for: "${trimmedText}" -> "${cachedResult}"`);
                // Ensure cached results also have the marker if they were actual translations
                // and not just fallbacks to original. This depends on what's stored in cache.
                // For now, assume cache stores final displayable string.
                return cachedResult;
            }

            // 2. Check manual translations
            if (this.manualTranslations[trimmedText]) {
                const manualTranslation = this.manualTranslations[trimmedText];
                $.log(3, `Manual hit for: "${trimmedText}" -> "${manualTranslation}"`);
                const resultToCache = PROCESSED_MARKER + manualTranslation;
                if (this.cache) this.cache.set(trimmedText, resultToCache); // Cache with marker
                return manualTranslation; // Return without marker for display
            }

            // 3. Machine translation (Placeholder - actual call would be async)
            let wasMachineTranslatedAttempted = false;
            let immediateReturnValue = trimmedText; // Default to original text if no translation path taken

            if ($.machineService && this.translationServices[$.machineService]) {
                const service = this.translationServices[$.machineService];
                wasMachineTranslatedAttempted = true;
                $.log(3, `Attempting machine translation for: "${trimmedText}" via ${$.machineService}`);

                // Immediately return a placeholder or original text for synchronous game flow
                immediateReturnValue = `[T] ${trimmedText}`; // Placeholder

                // Trigger asynchronous translation
                service.translate(trimmedText, $.gameOriginalLanguage, $.targetLanguage, contextInfo)
                    .then(result => {
                        if (result && result.error === null && result.translatedText !== trimmedText) {
                            $.log(2, `Machine translation successful for "${trimmedText}" -> "${result.translatedText}"`);
                            if (this.cache) {
                                this.cache.set(trimmedText, PROCESSED_MARKER + result.translatedText);
                            }
                            // TODO (Advanced): Consider if/how to refresh currently displayed text if possible
                        } else if (result && result.error) {
                            $.log(1, `Machine translation error for "${trimmedText}": ${result.error}`);
                            // Cache the error or original text with marker to prevent retries for a while?
                            // For now, just logs. Next time it will try again if not manually translated.
                            if (this.cache) { // Cache the placeholder to avoid re-hitting failing API immediately
                                this.cache.set(trimmedText, PROCESSED_MARKER + immediateReturnValue);
                            }
                        } else {
                             // Service might return original if it can't translate or no change
                            $.log(3, `Machine translation returned original or no change for "${trimmedText}".`);
                            if (this.cache) {
                                this.cache.set(trimmedText, PROCESSED_MARKER + trimmedText);
                            }
                        }
                    })
                    .catch(error => {
                        $.log(1, `Unhandled error during machine translation call for "${trimmedText}":`, error);
                        if (this.cache) { // Cache the placeholder to avoid re-hitting failing API immediately
                            this.cache.set(trimmedText, PROCESSED_MARKER + immediateReturnValue);
                        }
                    });

                // Return the placeholder for now.
                // The actual translated text will be available from cache on next encounter.
                if (this.cache) this.cache.set(trimmedText, PROCESSED_MARKER + immediateReturnValue); // Cache placeholder
                return immediateReturnValue;

            } else if ($.machineService) {
                $.log(1, `Machine translation service "${$.machineService}" selected but not properly configured or API key missing. Using placeholder for "${trimmedText}".`);
                immediateReturnValue = `[T] ${trimmedText}`; // Placeholder
                wasMachineTranslatedAttempted = true; // Count as an attempt
            } else {
                $.log(3, `No machine translation service selected. Passing through: "${trimmedText}".`);
                // No MT attempt, just original text. immediateReturnValue is already trimmedText.
            }

            // If code reaches here, it means no manual translation was found, AND
            // either no machine translation service was configured/attempted, or we are returning a placeholder.
            // Cache the result (which might be original text or a [T] placeholder) with the processed marker.
            if (this.cache) {
                this.cache.set(trimmedText, PROCESSED_MARKER + immediateReturnValue);
            }
            return immediateReturnValue;
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
            if (!dataObject) {
                $.log(1, `translateDataObject: Received null dataObject for ${fileName}. Skipping.`);
                return;
            }
            $.log(3, `translateDataObject attempting for ${fileName} (Global: ${globalVarName})`);

            // Determine which specific translation function to call based on the file name or global variable
            switch (globalVarName) { // Using globalVarName is often more reliable for system-loaded files
                case '$dataSystem':
                    if ($.translateDataFiles.system) {
                        this.translateSystemData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for System.json (disabled by parameters).`);
                    }
                    break;
                case '$dataItems':
                    if ($.translateDataFiles.items) {
                        this.translateItemsData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for Items.json (disabled by parameters).`);
                    }
                    break;
                // Add cases for other data files (Actors, Skills, etc.) here
                default:
                    if (fileName && fileName.startsWith('Map') && fileName.endsWith('.json')) {
                        if ($.translateDataFiles.eventText) { // Check if event text translation is enabled
                            this.translateMapData(dataObject, fileName);
                        } else {
                            $.log(2, `Skipping event text translation for ${fileName} (disabled by parameters).`);
                        }
                    } else if (globalVarName === '$dataCommonEvents') {
                        if ($.translateDataFiles.eventText) {
                            this.translateCommonEventsData(dataObject);
                        } else {
                            $.log(2, `Skipping event text translation for CommonEvents.json (disabled by parameters).`);
                        }
                    } else {
                        $.log(3, `translateDataObject: No specific translator for ${globalVarName} (${fileName}) yet.`);
                    }
                    break;
            }
        },

        translateSystemData: function(systemData) {
            $.log(3, "Translating System Data ($dataSystem)...");

            if (systemData.gameTitle) {
                systemData.gameTitle = this.translate(systemData.gameTitle, { context: '$dataSystem.gameTitle' });
            }

            if (systemData.terms) {
                const terms = systemData.terms;
                ['basic', 'commands', 'params', 'messages'].forEach(category => {
                    if (terms[category]) {
                        if (Array.isArray(terms[category])) {
                            terms[category] = terms[category].map((term, index) =>
                                term ? this.translate(term, { context: `$dataSystem.terms.${category}[${index}]` }) : term
                            );
                        } else if (typeof terms[category] === 'object' && terms[category] !== null) {
                            // E.g. terms.messages can be an object of key-value pairs
                            Object.keys(terms[category]).forEach(key => {
                                if (terms[category][key]) {
                                    terms[category][key] = this.translate(terms[category][key], { context: `$dataSystem.terms.${category}.${key}` });
                                }
                            });
                        }
                    }
                });
            }

            ['weaponTypes', 'armorTypes', 'skillTypes', 'elements'].forEach(arrayName => {
                if (systemData[arrayName] && Array.isArray(systemData[arrayName])) {
                    systemData[arrayName] = systemData[arrayName].map((typeName, index) =>
                        typeName ? this.translate(typeName, { context: `$dataSystem.${arrayName}[${index}]` }) : typeName
                    );
                }
            });

            // Attack Motions (some might have names or messages if custom) - typically not text-heavy
            // Party Members (initial party - names should be from $dataActors)
            // Title Commands (window positions, etc. - names handled by Window_TitleCommand hook)
            // ... and other fields as necessary

            $.log(3, "Finished translating System Data.");
        },

        translateItemsData: function(itemsData) {
            $.log(3, "Translating Items Data ($dataItems)...");
            // $dataItems is an array, index 0 is null.
            for (let i = 1; i < itemsData.length; i++) {
                const item = itemsData[i];
                if (item) {
                    const baseContext = `$dataItems[${i}]`;
                    if (item.name) {
                        item.name = this.translate(item.name, { context: `${baseContext}.name` });
                    }
                    if (item.description) {
                        item.description = this.translate(item.description, { context: `${baseContext}.description` });
                    }
                    // Messages for common event items (MV specific, often unused in MZ, but good to cover)
                    if (item.message1) {
                        item.message1 = this.translate(item.message1, { context: `${baseContext}.message1` });
                    }
                    if (item.message2) {
                        item.message2 = this.translate(item.message2, { context: `${baseContext}.message2` });
                    }
                    if (item.message3) { // MZ might not have message3, message4 directly on item
                        item.message3 = this.translate(item.message3, { context: `${baseContext}.message3` });
                    }
                    if (item.message4) {
                        item.message4 = this.translate(item.message4, { context: `${baseContext}.message4` });
                    }
                    // Note field can also contain text, but usually for plugin parameters, not direct display.
                    // Translating note tags would require specific parsing based on known tags.
                }
            }
            $.log(3, "Finished translating Items Data.");
        },

        translateMapData: function(mapData, mapFileName) {
            if (!mapData || !mapData.events) {
                $.log(1, `translateMapData: Invalid map data or no events for ${mapFileName}.`);
                return;
            }
            $.log(3, `Translating Map Data for ${mapFileName} (Events)...`);
            // mapData.events is an array, but index 0 can be null.
            for (let i = 0; i < mapData.events.length; i++) {
                const event = mapData.events[i];
                if (event && event.pages) {
                    event.pages.forEach((page, pageIndex) => {
                        if (page && page.list) {
                            const context = `${mapFileName}.event[${event.id || i}].page[${pageIndex}]`;
                            this.translateEventList(page.list, { context: context });
                        }
                    });
                }
            }
            $.log(3, `Finished translating Map Data for ${mapFileName}.`);
        },

        translateCommonEventsData: function(commonEventsData) {
            if (!commonEventsData) {
                $.log(1, `translateCommonEventsData: Invalid commonEventsData.`);
                return;
            }
            $.log(3, "Translating Common Events Data ($dataCommonEvents)...");
            // commonEventsData is an array, index 0 is null.
            for (let i = 1; i < commonEventsData.length; i++) {
                const commonEvent = commonEventsData[i];
                if (commonEvent && commonEvent.list) {
                    const context = `$dataCommonEvents[${i}]`;
                    this.translateEventList(commonEvent.list, { context: context });
                }
            }
            $.log(3, "Finished translating Common Events Data.");
        },

        // Placeholder for translateEventList - to be filled by DataManagerHooks
        translateEventList: function(list, contextInfo) {
            if (!list || !Array.isArray(list)) {
                $.log(1, `translateEventList: Invalid or empty list provided for context ${contextInfo.context}.`);
                return;
            }
            $.log(3, `translateEventList: Processing ${list.length} commands for context ${contextInfo.context}`);

            for (let i = 0; i < list.length; i++) {
                const command = list[i];
                if (!command || typeof command.code === 'undefined') continue;

                const cmdContext = `${contextInfo.context}.command[${i}]`;

                switch (command.code) {
                    case 101: // Show Text (header)
                        { // Block scope for j
                            $.log(3, `translateEventList: Found Show Text (101) at ${cmdContext}. Processing subsequent 401 lines.`);
                            let j = i + 1;
                            while (j < list.length && list[j] && list[j].code === 401) {
                                const textLineCommand = list[j];
                                if (textLineCommand.parameters && typeof textLineCommand.parameters[0] === 'string') {
                                    const originalLine = textLineCommand.parameters[0];
                                    textLineCommand.parameters[0] = this.translate(originalLine, {
                                        context: `${contextInfo.context}.command[${i}].textLine[${j-(i+1)}]`
                                    });
                                    if (originalLine !== textLineCommand.parameters[0]) {
                                        $.log(3, ` -> Translated line ${j-(i+1)}: "${originalLine}" TO "${textLineCommand.parameters[0]}"`);
                                    }
                                }
                                j++;
                            }
                            i = j - 1; // Advance main loop counter past these processed 401 commands
                        }
                        break;

                    // case 401: // Show Text (text line) - Handled by the 101 case iterating forward.
                    // No separate handling needed here if 101 is always present before 401.
                    // If a 401 could appear without a 101 (unlikely for valid event data), it would be missed.
                    // This approach assumes standard event structure.
                    // break;

                    case 102: // Show Choices
                        if (command.parameters && Array.isArray(command.parameters[0])) {
                            $.log(3, `translateEventList: Found Show Choices (102) at ${cmdContext}. Translating choices.`);
                            command.parameters[0] = command.parameters[0].map((choice, index) => {
                                const originalChoice = choice;
                                const translatedChoice = this.translate(originalChoice, {
                                    context: `${cmdContext}.choice[${index}]`
                                });
                                if (originalChoice !== translatedChoice) {
                                    $.log(3, ` -> Translated choice ${index}: "${originalChoice}" TO "${translatedChoice}"`);
                                }
                                return translatedChoice;
                            });
                        }
                        break;

                    case 105: // Show Scrolling Text (header)
                        { // Block scope for j
                            $.log(3, `translateEventList: Found Show Scrolling Text (105) at ${cmdContext}. Processing subsequent 405 lines.`);
                            let j = i + 1;
                            while (j < list.length && list[j] && list[j].code === 405) {
                                const textLineCommand = list[j];
                                if (textLineCommand.parameters && typeof textLineCommand.parameters[0] === 'string') {
                                    const originalLine = textLineCommand.parameters[0];
                                    textLineCommand.parameters[0] = this.translate(originalLine, {
                                        context: `${contextInfo.context}.command[${i}].scrollLine[${j-(i+1)}]`
                                    });
                                    if (originalLine !== textLineCommand.parameters[0]) {
                                        $.log(3, ` -> Translated scroll line ${j-(i+1)}: "${originalLine}" TO "${textLineCommand.parameters[0]}"`);
                                    }
                                }
                                j++;
                            }
                            i = j - 1; // Advance main loop counter past these processed 405 commands
                        }
                        break;

                    // case 405: // Show Scrolling Text (text line) - Handled by the 105 case.

                    case 108: // Comment
                        // Comments are for the developer, but sometimes used for quick notes.
                        // Translate if a specific parameter enables it (e.g., $.translateComments = true)
                        // For now, let's log and skip actual translation of comments to avoid clutter.
                        if (command.parameters && typeof command.parameters[0] === 'string') {
                            $.log(3, `translateEventList: Found Comment (108) at ${cmdContext}: "${command.parameters[0]}"`);
                            // Example if translation was desired:
                            // if ($.translateComments && command.parameters[0]) {
                            //     command.parameters[0] = this.translate(command.parameters[0], { context: `${cmdContext}.comment` });
                            // }
                        }
                        break;

                    case 129: // Change Actor Name
                        if (command.parameters && typeof command.parameters[1] === 'string') {
                            const actorId = command.parameters[0];
                            const originalName = command.parameters[1];
                            command.parameters[1] = this.translate(originalName, {
                                context: `${cmdContext}.actorName`, actorId: actorId
                            });
                            if (originalName !== command.parameters[1]) {
                                $.log(3, ` -> Translated Change Actor Name (129) for Actor ${actorId}: "${originalName}" TO "${command.parameters[1]}"`);
                            }
                        }
                        break;

                    case 132: // Change Actor Nickname (MV specific, Actor Profile in MZ is different)
                        // MZ uses code 133 for Profile, and Nickname is part of Actor data.
                        // This case is primarily for MV.
                        if (Utils.RPGMAKER_NAME === 'MV' && command.parameters && typeof command.parameters[1] === 'string') {
                            const actorId = command.parameters[0];
                            const originalNickname = command.parameters[1];
                            command.parameters[1] = this.translate(originalNickname, {
                                context: `${cmdContext}.actorNickname`, actorId: actorId
                            });
                            if (originalNickname !== command.parameters[1]) {
                                $.log(3, ` -> Translated Change Nickname (132) for Actor ${actorId}: "${originalNickname}" TO "${command.parameters[1]}"`);
                            }
                        } else if (Utils.RPGMAKER_NAME === 'MZ' && command.code === 132) {
                             $.log(3, `translateEventList: Skipping Change Nickname (132) in MZ as it's handled differently (Actor Profile).`);
                        }
                        break;

                    // case 133 (MV): Change Actor Profile - In MV, params[1] and params[2] are lines of profile.
                    // case 133 (MZ): Change Profile - params[1] is the full profile text.
                    // This needs careful handling if we also translate Actors.json.
                    // For now, let's assume this command dynamically sets profile text.
                    case 133: // Change Profile
                        if (command.parameters && typeof command.parameters[1] === 'string') {
                            const actorId = command.parameters[0];
                            const originalProfileLine1 = command.parameters[1];
                            command.parameters[1] = this.translate(originalProfileLine1, {
                                context: `${cmdContext}.profileLine1`, actorId: actorId
                            });
                             if (originalProfileLine1 !== command.parameters[1]) {
                                $.log(3, ` -> Translated Change Profile (133) line 1 for Actor ${actorId}: "${originalProfileLine1}" TO "${command.parameters[1]}"`);
                            }

                            if (Utils.RPGMAKER_NAME === 'MV' && command.parameters && typeof command.parameters[2] === 'string') {
                                const originalProfileLine2 = command.parameters[2];
                                command.parameters[2] = this.translate(originalProfileLine2, {
                                    context: `${cmdContext}.profileLine2`, actorId: actorId
                                });
                                if (originalProfileLine2 !== command.parameters[2]) {
                                    $.log(3, ` -> Translated Change Profile (133) line 2 for Actor ${actorId}: "${originalProfileLine2}" TO "${command.parameters[2]}"`);
                                }
                            }
                        }
                        break;

                    // Other text-containing commands that are generally NOT translated:
                    // 111 (Conditional Branch - Script): parameters[1] is script
                    // 355 (Script - multiline): parameters[0]
                    // 655 (Script - single line): parameters[0]
                    // 356 (Plugin Command - MV): parameters[0] is command, parameters[1] is args string
                    // 357 (Plugin Command - MZ): parameters[1] is command, parameters[3] is args object
                    // These are code or specific commands, not usually natural language for translation.

                    default:
                        // Log unhandled commands if needed for debugging, but can be noisy
                        // $.log(3, `translateEventList: Skipping command code ${command.code} at ${cmdContext}`);
                        break;
                }
            }
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
