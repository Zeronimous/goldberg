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
 * @param Translate Troops.json
 * @parent ---- Data File Translation Options ----
 * @desc Translate names in Troops.json. (Mainly for editor, but some plugins might display them)
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
 *
 * @param ---- Hotkey Options ----
 * @default
 *
 * @param Toggle Hotkey Key
 * @parent ---- Hotkey Options ----
 * @desc The main key to toggle translation on/off (e.g., F10, T, P). Not case sensitive.
 * For function keys, use F1 to F12. For letters/numbers, just the character.
 * @type text
 * @default F10
 *
 * @param Toggle Hotkey Modifier
 * @parent ---- Hotkey Options ----
 * @desc Optional modifier key (shift, control, alt). Leave empty for no modifier.
 * (Modifier support not fully implemented in this version, primarily for future use)
 * @type select
 * @option None
 * @value
 * @option Shift
 * @value shift
 * @option Control
 * @value control
 * @option Alt
 * @value alt
 * @default
 *
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
 * --- Plugin Commands (MZ style) ---
 * @command enable
 * @text Enable Translator
 * @desc Enables the translation functionality at runtime.
 *
 * @command disable
 * @text Disable Translator
 * @desc Disables the translation functionality at runtime.
 *
 * @command setLang
 * @text Set Target Language
 * @desc Changes the target language for translations at runtime. Clears cache and reloads manual files.
 * @arg lang
 * @type string
 * @text Language Code
 * @desc The language code to switch to (e.g., en, es, ja).
 * @default en
 *
 * @command reload
 * @text Reload Translations
 * @desc Clears the translation cache and reloads manual translation files.
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

    // Regular Expression for RPG Maker Escape Codes
    // This covers common MV and some MZ codes. May need refinement for exhaustive MZ support.
    // \\ - literal backslash
    // V[n], N[n], P[n], C[n], I[n], FS[n], OW[n], OC[n] - with numeric arguments
    // FN[name] - with string argument (font name)
    // G, $, ., |, !, >, <, ^, {, } - single character codes
    // Added specific check for PX[n] and PF[n] for MZ player/follower names.
    const ESCAPE_CODE_REGEX = /\\([VNP thermiqueow]\[\d+\]|FN\[[^\]]+\]|PX\[\d+\]|PF\[\d+\]|[Gg]|[CcIi]\[\d+\]|[\$\.\|\!><\^\{\}\\])/gi;
    // Simpler version focusing on common codes if the above is too complex or has issues:
    // const ESCAPE_CODE_REGEX = /\\([VNP thermique]\\[\\d+\\]|[GIcnpTherm]{\\[\\d+\\]}|[\\$\\.\\|\\!><\\^\\{\\}\\\\])/gi;
    // Let's refine it:
    // It should match:
    // - A literal backslash: \\
    // - Codes with numeric arguments: \C[n], \I[n], \V[n], \N[n], \P[n], \FS[n], \OW[n], \OC[n]
    // - Codes with string arguments (like font name): \FN[name]
    // - Single character codes: \G, \$, \., \|, \!, \>, \<, \^, \{, \}
    // - MZ specific player/follower: \PX[n], \PF[n]
    // The key is to correctly group these.

    // Breakdown for clarity:
    // \\\\                     -> matches literal backslash '\'
    // (                        -> start of capturing group 1 (the code letter and its params)
    //   [VNP thermiqueOWCFS]\[\d+\]  -> V,N,P,C,I,O,W,F,S followed by [digits] (e.g., \V[10], \C[1], \FS[20]) - Note: OC, OW, FS are MZ
    //   |PX\[\d+\]             -> PX followed by [digits] (MZ Player X)
    //   |PF\[\d+\]             -> PF followed by [digits] (MZ Follower X)
    //   |FN\[[^\]]+\]          -> FN followed by [any chars not a closing bracket] (e.g., \FN[MyFont]) - MZ
    //   |[Gg$|$.!><^{}\\]      -> Single character codes: G or g, $, ., |, !, >, <, ^, {, }, or literal \
    // )                        -> end of capturing group 1
    // The 'i' flag for case-insensitivity on G is good.
    // The 'g' flag for global match is essential.

    const RPGMAKER_ESCAPE_CODE_REGEX = /\\\\(?:[VNPCOWFS]\w*\[[^\]]*\]|[GIgnpTherm]|[$.!><^{}|%^LN_#*@~])/gi;
    // Let's try a more structured one from common libraries, usually looks like:
    // \V[n], \N[n], \P[n], \G, \C[n], \I[n], \$, \., \|, \!, \>, \<, \^, \{, \}
    // MZ adds: \PX[n], \PF[n], \FS[n], \FN[fontname], \OC[n], \OW[n]
    // Also, \\ for literal backslash.

    // Final proposed regex:
    // It captures the entire escape sequence.
    const JULES_TRANSLATOR_ESCAPE_REGEX = /\\(?:[VNPFS]\w*\[[^\]]+\]|[CGIO]\w*\[\d+\]|[Pp][Gg]?|[!$><.|{}^\\%LN_#*@~])/gi;
    // This is still a bit broad with \w*. Let's be more specific.
    // \V[n], \N[n], \P[n] (actor/party member name/variable)
    // \C[n] (color), \I[n] (icon)
    // \G (gold window)
    // \$, \., \|, \!, \>, \<, \^ (message control)
    // \{, \} (font size change)
    // \\ (literal backslash)
    // MZ specific:
    // \FS[n] (font size)
    // \FN[name] (font name)
    // \OW[n] (outline width)
    // \OC[n] (outline color)
    // \PX[n] (party member by index, name)
    // \PF[n] (follower by index, name)

    // Let's try to build it piece by piece for clarity and robustness:
    const escapeCodes = [
        "\\\\V\\[\\d+\\]",       // \V[n]
        "\\\\N\\[\\d+\\]",       // \N[n]
        "\\\\P\\[\\d+\\]",       // \P[n]
        "\\\\G",                // \G (gold window should be case insensitive, handled by 'i' flag later)
        "\\\\C\\[\\d+\\]",       // \C[n]
        "\\\\I\\[\\d+\\]",       // \I[n]
        "\\\\\\$",              // \$ (money window)
        "\\\\\\.",              // \. (wait 1/4s)
        "\\\\\\|",              // \| (wait 1s)
        "\\\\\\!",              // \! (wait for input)
        "\\\\\\>",              // \> (text speed up start)
        "\\\\\\<",              // \< (text speed up end)
        "\\\\\\^",              // \^ (no wait after message)
        "\\\\\\{",              // \{ (increase font size)
        "\\\\\\}",              // \} (decrease font size)
        "\\\\\\\\",             // \\ (literal backslash)
        // MZ Specific Codes
        "\\\\FS\\[\\d+\\]",      // \FS[n] (Font Size)
        "\\\\FN\\[[^\\]]+\\]",   // \FN[FontName] (Font Name)
        "\\\\OW\\[\\d+\\]",      // \OW[n] (Outline Width)
        "\\\\OC\\[\\d+\\]",      // \OC[n] (Outline Color)
        "\\\\PX\\[\\d+\\]",      // \PX[n] (Party member n name)
        "\\\\PF\\[\\d+\\]"       // \PF[n] (Follower n name)
    ];
    // %% for literal % is usually handled by TextManager, not as an escape code here.

    const ESCAPE_CODE_REGEX_PATTERN = new RegExp(escapeCodes.join("|"), 'gi');
    // This regex will be used in _extractEscapeCodes
    const JULES_TRANSLATOR_PLACEHOLDER_PREFIX = "@@JT_ESC_"; // Keep it somewhat unique

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
        eventText: ($.Parameters['Translate Event Text'] === 'true'),
        troops: ($.Parameters['Translate Troops.json'] === 'true')
    };

    $.enableCache = ($.Parameters['Enable Translation Cache'] === 'true');
    $.manualTranslationFolderName = String($.Parameters['Manual Translation Folder'] || 'translations');
    $.gameOriginalLanguage = String($.Parameters['Game Original Language'] || 'ja');
    $.logLevel = parseInt($.Parameters['LogLevel'] || 2, 10);

    $.toggleHotkeyKey = String($.Parameters['Toggle Hotkey Key'] || 'F10').toLowerCase();
    // $.toggleHotkeyModifier = String($.Parameters['Toggle Hotkey Modifier'] || '').toLowerCase();


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
            this._escapeCodePlaceholderIndex = 0; // For generating unique placeholders

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

            // If text already has the marker, it means it was translated (or attempted) by this function before.
            // Return it as is, removing the marker for final display by the engine.
            if (originalText.startsWith(PROCESSED_MARKER)) {
                $.log(3, `Translate: Skipping already processed text: "${originalText}"`);
                return originalText.substring(PROCESSED_MARKER.length);
            }

            // 1. Cache Check (using original trimmed text as key)
            // The cache will store the *final displayable* (codes restored) translated string,
            // but internally it's prefixed with PROCESSED_MARKER.
            if (this.cache && this.cache.has(trimmedText)) {
                const cachedValue = this.cache.get(trimmedText);
                if (cachedValue.startsWith(PROCESSED_MARKER)) {
                    $.log(3, `Translate: Cache hit for: "${trimmedText}" -> "${cachedValue.substring(PROCESSED_MARKER.length)}"`);
                    return cachedValue.substring(PROCESSED_MARKER.length);
                }
                // Should not happen if cache is managed correctly, but as a fallback:
                return cachedValue;
            }

            // 2. Extract escape codes
            const { processedText, escapeMap } = this._extractEscapeCodes(trimmedText);

            // 3. Manual Translation Check (using text with placeholders as key)
            if (this.manualTranslations[processedText]) {
                let manualTranslationOfProcessed = this.manualTranslations[processedText];
                let finalManualTranslation = this._restoreEscapeCodes(manualTranslationOfProcessed, escapeMap);
                $.log(3, `Translate: Manual hit for (processed) "${processedText}" -> (restored) "${finalManualTranslation}"`);
                if (this.cache) this.cache.set(trimmedText, PROCESSED_MARKER + finalManualTranslation);
                return finalManualTranslation;
            }

            // 4. Machine Translation
            let immediateReturnValueForDisplay = trimmedText; // Default to original if no MT
            let textToSendToService = processedText;

            if ($.machineService && this.translationServices[$.machineService]) {
                const service = this.translationServices[$.machineService];
                $.log(3, `Translate: Attempting machine translation for (processed): "${textToSendToService}" via ${$.machineService}`);

                immediateReturnValueForDisplay = `[T] ${trimmedText}`; // Show original with [T] prefix as placeholder

                // Trigger asynchronous translation of text_with_placeholders
                service.translate(textToSendToService, $.gameOriginalLanguage, $.targetLanguage, contextInfo)
                    .then(result => {
                        let finalTranslatedText;
                        if (result && result.error === null && result.translatedText !== textToSendToService) {
                            finalTranslatedText = this._restoreEscapeCodes(result.translatedText, escapeMap);
                            $.log(2, `Translate: MT successful for "${trimmedText}" -> "${finalTranslatedText}" (Original processed: "${textToSendToService}", MT processed: "${result.translatedText}")`);
                        } else {
                            if (result && result.error) {
                                $.log(1, `Translate: MT error for "${trimmedText}" (processed: "${textToSendToService}"): ${result.error}`);
                            } else {
                                $.log(3, `Translate: MT returned original or no change for (processed) "${textToSendToService}".`);
                            }
                            finalTranslatedText = trimmedText; // Fallback to original (codes intact)
                        }
                        if (this.cache) {
                            this.cache.set(trimmedText, PROCESSED_MARKER + finalTranslatedText);
                        }
                    })
                    .catch(error => {
                        $.log(1, `Translate: Unhandled error in MT call for "${trimmedText}" (processed: "${textToSendToService}"):`, error);
                        if (this.cache) { // Cache placeholder to prevent rapid retries
                            this.cache.set(trimmedText, PROCESSED_MARKER + immediateReturnValueForDisplay);
                        }
                    });

                // Cache and return the immediate placeholder
                if (this.cache) this.cache.set(trimmedText, PROCESSED_MARKER + immediateReturnValueForDisplay);
                return immediateReturnValueForDisplay;

            } else if ($.machineService) {
                $.log(1, `Translate: MT service "${$.machineService}" selected but not configured/API key missing. Using placeholder for "${trimmedText}".`);
                immediateReturnValueForDisplay = `[T] ${trimmedText}`;
            } else {
                $.log(3, `Translate: No MT service selected. Passing through: "${trimmedText}".`);
                // No MT attempted, immediateReturnValueForDisplay is already trimmedText
            }

            // If code reaches here: no manual translation, and either no MT attempted or only placeholder returned.
            // Cache the current immediateReturnValueForDisplay (which is original or [T] original)
            if (this.cache) {
                this.cache.set(trimmedText, PROCESSED_MARKER + immediateReturnValueForDisplay);
            }
            return immediateReturnValueForDisplay;
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

        _extractEscapeCodes: function(text) {
            if (!text || typeof text !== 'string') {
                return { processedText: text, escapeMap: [] };
            }

            const escapeMap = [];
            let placeholderIndex = 0;

            const processedText = text.replace(ESCAPE_CODE_REGEX_PATTERN, function(match) {
                const placeholder = `${JULES_TRANSLATOR_PLACEHOLDER_PREFIX}${placeholderIndex++}@@`;
                escapeMap.push(match);
                return placeholder;
            });

            if (escapeMap.length > 0) {
                $.log(3, `_extractEscapeCodes: Original: "${text}", Processed: "${processedText}", Map:`, JSON.stringify(escapeMap));
            }
            return { processedText: processedText, escapeMap: escapeMap };
        },

        _restoreEscapeCodes: function(textWithPlaceholders, escapeMap) {
            if (!textWithPlaceholders || typeof textWithPlaceholders !== 'string' || !escapeMap || escapeMap.length === 0) {
                return textWithPlaceholders;
            }

            let restoredText = textWithPlaceholders;
            for (let i = 0; i < escapeMap.length; i++) {
                const placeholder = `${JULES_TRANSLATOR_PLACEHOLDER_PREFIX}${i}@@`;
                const placeholderRegExp = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                restoredText = restoredText.replace(placeholderRegExp, escapeMap[i]);
            }

            if (textWithPlaceholders !== restoredText && escapeMap.length > 0) {
                $.log(3, `_restoreEscapeCodes: From: "${textWithPlaceholders}", To: "${restoredText}"`);
            }
            return restoredText;
        },

        // Actual method to translate data objects
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
                case '$dataActors':
                    if ($.translateDataFiles.actors) {
                        this.translateActorsData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for Actors.json (disabled by parameters).`);
                    }
                    break;
                case '$dataSkills':
                    if ($.translateDataFiles.skills) {
                        this.translateSkillsData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for Skills.json (disabled by parameters).`);
                    }
                    break;
                case '$dataClasses':
                    if ($.translateDataFiles.classes) {
                        this.translateClassesData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for Classes.json (disabled by parameters).`);
                    }
                    break;
                case '$dataStates':
                    if ($.translateDataFiles.states) {
                        this.translateStatesData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for States.json (disabled by parameters).`);
                    }
                    break;
                case '$dataEnemies':
                    if ($.translateDataFiles.enemies) {
                        this.translateEnemiesData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for Enemies.json (disabled by parameters).`);
                    }
                    break;
                case '$dataArmors':
                    if ($.translateDataFiles.armors) {
                        this.translateArmorsData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for Armors.json (disabled by parameters).`);
                    }
                    break;
                case '$dataWeapons':
                    if ($.translateDataFiles.weapons) {
                        this.translateWeaponsData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for Weapons.json (disabled by parameters).`);
                    }
                    break;
                case '$dataMapInfos':
                    if ($.translateDataFiles.mapInfos) {
                        this.translateMapInfosData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for MapInfos.json (disabled by parameters).`);
                    }
                    break;
                case '$dataTroops':
                    if ($.translateDataFiles.troops) {
                        this.translateTroopsData(dataObject);
                    } else {
                        $.log(2, `Skipping translation for Troops.json (disabled by parameters).`);
                    }
                    break;
                // Add cases for other data files here
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
                for (const categoryKey in systemData.terms) {
                    if (Object.prototype.hasOwnProperty.call(systemData.terms, categoryKey)) {
                        const categoryValue = systemData.terms[categoryKey];
                        const termContextBase = `$dataSystem.terms.${categoryKey}`;

                        if (Array.isArray(categoryValue)) {
                            systemData.terms[categoryKey] = categoryValue.map((term, index) => {
                                if (typeof term === 'string' && term) { // Ensure term is a non-empty string
                                    return this.translate(term, { context: `${termContextBase}[${index}]` });
                                }
                                return term;
                            });
                        } else if (typeof categoryValue === 'object' && categoryValue !== null) {
                            for (const messageKey in categoryValue) {
                                if (Object.prototype.hasOwnProperty.call(categoryValue, messageKey) &&
                                    typeof categoryValue[messageKey] === 'string' && categoryValue[messageKey]) { // Ensure non-empty string
                                    categoryValue[messageKey] = this.translate(categoryValue[messageKey], { context: `${termContextBase}.${messageKey}` });
                                }
                            }
                        }
                        // Note: Direct string properties under systemData.terms are not standard in MV/MZ default data.
                    }
                }
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

            if (systemData.currencyUnit) {
                systemData.currencyUnit = this.translate(systemData.currencyUnit, { context: '$dataSystem.currencyUnit'});
            }

            if (systemData.variables && Array.isArray(systemData.variables)) {
                // Index 0 is often unused, but iterate all just in case.
                systemData.variables = systemData.variables.map((name, index) =>
                    (typeof name === 'string' && name) ? this.translate(name, { context: `$dataSystem.variables[${index}]`}) : name
                );
            }

            if (systemData.switches && Array.isArray(systemData.switches)) {
                // Index 0 is often unused.
                systemData.switches = systemData.switches.map((name, index) =>
                    (typeof name === 'string' && name) ? this.translate(name, { context: `$dataSystem.switches[${index}]`}) : name
                );
            }
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

        translateActorsData: function(actorsData) {
            $.log(3, "Translating Actors Data ($dataActors)...");
            // $dataActors is an array, index 0 is null.
            for (let i = 1; i < actorsData.length; i++) {
                const actor = actorsData[i];
                if (actor) {
                    const baseContext = `$dataActors[${i}]`;
                    if (actor.name) {
                        actor.name = this.translate(actor.name, { context: `${baseContext}.name` });
                    }
                    if (actor.nickname) {
                        actor.nickname = this.translate(actor.nickname, { context: `${baseContext}.nickname` });
                    }
                    if (actor.profile) {
                        actor.profile = this.translate(actor.profile, { context: `${baseContext}.profile` });
                    }
                }
            }
            $.log(3, "Finished translating Actors Data.");
        },

        translateSkillsData: function(skillsData) {
            $.log(3, "Translating Skills Data ($dataSkills)...");
            // $dataSkills is an array, index 0 is null.
            for (let i = 1; i < skillsData.length; i++) {
                const skill = skillsData[i];
                if (skill) {
                    const baseContext = `$dataSkills[${i}]`;
                    if (skill.name) {
                        skill.name = this.translate(skill.name, { context: `${baseContext}.name` });
                    }
                    if (skill.description) {
                        skill.description = this.translate(skill.description, { context: `${baseContext}.description` });
                    }
                    if (skill.message1) { // Message when skill is used
                        skill.message1 = this.translate(skill.message1, { context: `${baseContext}.message1` });
                    }
                    if (skill.message2) { // Second part of message (e.g., for certain skill types)
                        skill.message2 = this.translate(skill.message2, { context: `${baseContext}.message2` });
                    }
                    // In MZ, message3 and message4 are "Ally Fainted" and "Enemy Fainted"
                    if (skill.message3) {
                        skill.message3 = this.translate(skill.message3, { context: `${baseContext}.message3` });
                    }
                    if (skill.message4) {
                        skill.message4 = this.translate(skill.message4, { context: `${baseContext}.message4` });
                    }
                }
            }
            $.log(3, "Finished translating Skills Data.");
        },

        translateClassesData: function(classesData) {
            $.log(3, "Translating Classes Data ($dataClasses)...");
            // $dataClasses is an array, index 0 is null.
            for (let i = 1; i < classesData.length; i++) {
                const classData = classesData[i];
                if (classData && classData.name) {
                    classData.name = this.translate(classData.name, { context: `$dataClasses[${i}].name` });
                }
            }
            $.log(3, "Finished translating Classes Data.");
        },

        translateStatesData: function(statesData) {
            $.log(3, "Translating States Data ($dataStates)...");
            // $dataStates is an array, index 0 is null.
            for (let i = 1; i < statesData.length; i++) {
                const state = statesData[i];
                if (state) {
                    const baseContext = `$dataStates[${i}]`;
                    if (state.name) {
                        state.name = this.translate(state.name, { context: `${baseContext}.name` });
                    }
                    if (state.message1) { // Actor is [state name]
                        state.message1 = this.translate(state.message1, { context: `${baseContext}.message1` });
                    }
                    if (state.message2) { // [Actor name] is still [state name]
                        state.message2 = this.translate(state.message2, { context: `${baseContext}.message2` });
                    }
                    if (state.message3) { // [Actor name] is no longer [state name]
                        state.message3 = this.translate(state.message3, { context: `${baseContext}.message3` });
                    }
                    if (state.message4) { // Message when inflicted by skill/item
                        state.message4 = this.translate(state.message4, { context: `${baseContext}.message4` });
                    }

                    // MZ specific messages
                    if (Utils.RPGMAKER_NAME === 'MZ') {
                        if (state.messageInflicted) {
                            state.messageInflicted = this.translate(state.messageInflicted, { context: `${baseContext}.messageInflicted` });
                        }
                        if (state.messageAlready) {
                            state.messageAlready = this.translate(state.messageAlready, { context: `${baseContext}.messageAlready` });
                        }
                        if (state.messageProtected) {
                            state.messageProtected = this.translate(state.messageProtected, { context: `${baseContext}.messageProtected` });
                        }
                        if (state.messageEmerged) {
                            state.messageEmerged = this.translate(state.messageEmerged, { context: `${baseContext}.messageEmerged` });
                        }
                        if (state.messageDisappeared) {
                            state.messageDisappeared = this.translate(state.messageDisappeared, { context: `${baseContext}.messageDisappeared` });
                        }
                    }
                }
            }
            $.log(3, "Finished translating States Data.");
        },

        translateEnemiesData: function(enemiesData) {
            $.log(3, "Translating Enemies Data ($dataEnemies)...");
            // $dataEnemies is an array, index 0 is null.
            for (let i = 1; i < enemiesData.length; i++) {
                const enemy = enemiesData[i];
                if (enemy && enemy.name) {
                    enemy.name = this.translate(enemy.name, { context: `$dataEnemies[${i}].name` });
                }
            }
            $.log(3, "Finished translating Enemies Data.");
        },

        translateArmorsData: function(armorsData) {
            $.log(3, "Translating Armors Data ($dataArmors)...");
            // $dataArmors is an array, index 0 is null.
            for (let i = 1; i < armorsData.length; i++) {
                const armor = armorsData[i];
                if (armor) {
                    const baseContext = `$dataArmors[${i}]`;
                    if (armor.name) {
                        armor.name = this.translate(armor.name, { context: `${baseContext}.name` });
                    }
                    if (armor.description) {
                        armor.description = this.translate(armor.description, { context: `${baseContext}.description` });
                    }
                }
            }
            $.log(3, "Finished translating Armors Data.");
        },

        translateWeaponsData: function(weaponsData) {
            $.log(3, "Translating Weapons Data ($dataWeapons)...");
            // $dataWeapons is an array, index 0 is null.
            for (let i = 1; i < weaponsData.length; i++) {
                const weapon = weaponsData[i];
                if (weapon) {
                    const baseContext = `$dataWeapons[${i}]`;
                    if (weapon.name) {
                        weapon.name = this.translate(weapon.name, { context: `${baseContext}.name` });
                    }
                    if (weapon.description) {
                        weapon.description = this.translate(weapon.description, { context: `${baseContext}.description` });
                    }
                }
            }
            $.log(3, "Finished translating Weapons Data.");
        },

        translateMapInfosData: function(mapInfosData) {
            $.log(3, "Translating Map Infos Data ($dataMapInfos)...");
            // $dataMapInfos is an array, can have null elements (especially at index 0).
            for (let i = 0; i < mapInfosData.length; i++) { // Start from 0 as even index 0 might be used by some plugins, though typically it's null for unused map ID 0.
                const mapInfo = mapInfosData[i];
                if (mapInfo && mapInfo.name) {
                    mapInfo.name = this.translate(mapInfo.name, { context: `$dataMapInfos[${i}].name` });
                }
            }
            $.log(3, "Finished translating Map Infos Data.");
        },

        translateTroopsData: function(troopsData) {
            $.log(3, "Translating Troops Data ($dataTroops)...");
            // $dataTroops is an array, index 0 is null.
            for (let i = 1; i < troopsData.length; i++) {
                const troop = troopsData[i];
                if (troop && troop.name) {
                    troop.name = this.translate(troop.name, { context: `$dataTroops[${i}].name` });
                }
                // Note: Troop event pages are also part of the troop data.
                // If these event pages need to be translated *when $dataTroops is loaded*,
                // we would need to call translateEventList here.
                // However, battle events are often dynamically composed or map-specific.
                // For now, only translating troop.name.
                // If troop-specific common events are used, they are in $dataCommonEvents.
                // If map-specific battle events, they are in $dataMapXXX.
            }
            $.log(3, "Finished translating Troops Data.");
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

    // --- MZ Plugin Command Registration ---
    // Check if we are in an MZ environment that supports the new PluginManager command registration
    if (typeof PluginManager.registerCommand === 'function') {
        $.log(2, "MZ environment detected. Registering MZ plugin commands.");

        PluginManager.registerCommand(pluginName, "enable", args => {
            MyTranslator.isEnabled = true;
            $.log(2, 'JulesTranslator enabled via MZ command.');
        });

        PluginManager.registerCommand(pluginName, "disable", args => {
            MyTranslator.isEnabled = false;
            $.log(2, 'JulesTranslator disabled via MZ command.');
        });

        PluginManager.registerCommand(pluginName, "setLang", args => {
            // In MZ, args are parsed from @arg definitions. args.lang should be available.
            const lang = String(args.lang || $.targetLanguage); // Fallback to current if arg is missing
            $.targetLanguage = lang;
            if (MyTranslator.cache) MyTranslator.cache.clear();
            MyTranslator.loadManualTranslations();
            $.log(2, `JulesTranslator language set to (MZ): ${$.targetLanguage}`);
        });

        PluginManager.registerCommand(pluginName, "reload", args => {
            if (MyTranslator.cache) MyTranslator.cache.clear();
            MyTranslator.loadManualTranslations();
            $.log(2, 'JulesTranslator translations reloaded via MZ command.');
        });

    } else {
        // --- Fallback to MV Style Plugin Command Handler ---
        $.log(2, "MV environment detected or registerCommand not found. Using MV plugin command system.");
        const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function(command, args) {
            _Game_Interpreter_pluginCommand.call(this, command, args);
            if (command === pluginName) {
                const subCommand = (args[0] || '').toLowerCase();
                switch (subCommand) {
                    case 'enable':
                        MyTranslator.isEnabled = true;
                        $.log(2, 'JulesTranslator enabled via MV plugin command.');
                        break;
                    case 'disable':
                        MyTranslator.isEnabled = false;
                        $.log(2, 'JulesTranslator disabled via MV plugin command.');
                        break;
                    case 'setlang':
                        if (args[1]) {
                            $.targetLanguage = String(args[1]);
                            if (MyTranslator.cache) MyTranslator.cache.clear();
                            MyTranslator.loadManualTranslations(); // Reload appropriate file
                            $.log(2, `JulesTranslator language set to (MV): ${$.targetLanguage}`);
                        } else {
                            $.log(1, 'JulesTranslator setLang command missing language argument (MV).');
                        }
                        break;
                    case 'reload':
                        if (MyTranslator.cache) MyTranslator.cache.clear();
                        MyTranslator.loadManualTranslations();
                        $.log(2, 'JulesTranslator translations reloaded via MV plugin command.');
                        break;
                    default:
                        $.log(1, `JulesTranslator unknown subcommand (MV): ${subCommand}`);
                        break;
                }
            }
        };
    }

    // --- Hotkey Listener ---
    // Add a method to MyTranslator to handle the check, so it's part of the namespace
    MyTranslator.checkToggleHotkey = function() {
        if (!$.toggleHotkeyKey || $.toggleHotkeyKey === "" || $.toggleHotkeyKey.toLowerCase() === "none") {
            return;
        }

        // Modifiers check (basic - only one modifier supported for now without complex parsing)
        // let modifierActive = true;
        // if ($.toggleHotkeyModifier) {
        //     if (!Input.isPressed($.toggleHotkeyModifier)) {
        //         modifierActive = false;
        //     }
        // }
        // if (!modifierActive) return;

        // Input.isTriggered expects lowercase for letters and specific names for function keys.
        // $.toggleHotkeyKey is already toLowerCase().
        if (Input.isTriggered($.toggleHotkeyKey)) {
            MyTranslator.isEnabled = !MyTranslator.isEnabled;
            $.log(2, `Translator Toggled via Hotkey (${$.toggleHotkeyKey}): ${MyTranslator.isEnabled ? 'ENABLED' : 'DISABLED'}`);

            // Optional: Visual Feedback (simple text on screen for a short duration)
            if (typeof SceneManager._scene.createJulesTranslatorStatusWindow === 'function') {
                SceneManager._scene.createJulesTranslatorStatusWindow();
            }
            if (SceneManager._scene._julesTranslatorStatusWindow) {
                SceneManager._scene._julesTranslatorStatusWindow.showStatus(MyTranslator.isEnabled);
            }
        }
    };

    // Alias SceneManager.update to check for the hotkey
    const _SceneManager_update = SceneManager.update;
    SceneManager.update = function() {
        _SceneManager_update.call(this);
        // Check only when a map or battle scene is active and not changing, and MyTranslator is loaded
        if ((SceneManager._scene instanceof Scene_Map || SceneManager._scene instanceof Scene_Battle) &&
            !SceneManager.isSceneChanging() && MyTranslator && MyTranslator.checkToggleHotkey) {
            MyTranslator.checkToggleHotkey();
        }
    };

    // --- Optional: Simple Status Window for Hotkey Feedback ---
    function Window_JulesTranslatorStatus() {
        this.initialize(...arguments);
    }

    Window_JulesTranslatorStatus.prototype = Object.create(Window_Base.prototype);
    Window_JulesTranslatorStatus.prototype.constructor = Window_JulesTranslatorStatus;

    Window_JulesTranslatorStatus.prototype.initialize = function() {
        const rect = this.statusWindowRect();
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 0; // Start transparent
        this.contentsOpacity = 0;
        this._statusText = "";
        this._showDuration = 0;
    };

    Window_JulesTranslatorStatus.prototype.statusWindowRect = function() {
        const ww = 240;
        const wh = this.fittingHeight(1);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 20;
        return new Rectangle(wx, wy, ww, wh);
    };

    Window_JulesTranslatorStatus.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (this._showDuration > 0) {
            this.contentsOpacity += 15;
            this._showDuration--;
        } else {
            this.contentsOpacity -= 15;
        }
        this.opacity = this.contentsOpacity; // Window fades with contents
    };

    Window_JulesTranslatorStatus.prototype.showStatus = function(isEnabled) {
        this._statusText = `Translator: ${isEnabled ? 'ON' : 'OFF'}`;
        this._showDuration = 90; // Show for 1.5 seconds (90 frames)
        this.refresh();
    };

    Window_JulesTranslatorStatus.prototype.refresh = function() {
        this.contents.clear();
        this.resetFontSettings();
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(this._statusText, 0, 0, this.contentsWidth(), 'center');
    };

    // Add function to Scene_Base to create this window if it doesn't exist
    Scene_Base.prototype.createJulesTranslatorStatusWindow = function() {
        if (!this._julesTranslatorStatusWindow) {
            this._julesTranslatorStatusWindow = new Window_JulesTranslatorStatus();
            this.addChild(this._julesTranslatorStatusWindow);
        }
    };
    // Ensure it's created on map/battle scenes
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createJulesTranslatorStatusWindow();
    };

    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this.createJulesTranslatorStatusWindow();
    };


})(JulesTranslator); // Pass in the namespace
