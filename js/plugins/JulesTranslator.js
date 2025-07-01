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
 * @param ---- Machine Translation Options ----
 * @default
 *
 * @param Max Retries On Error
 * @parent ---- Machine Translation Options ----
 * @desc Maximum number of retries for machine translation API calls on transient errors (e.g., network, server 50x).
 * @type number
 * @min 0
 * @default 2
 *
 * @param Initial Retry Delay Ms
 * @parent ---- Machine Translation Options ----
 * @desc Initial delay in milliseconds before the first retry for API calls. Subsequent retries use exponential backoff.
 * @type number
 * @min 100
 * @default 500
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
 *
 * @param ---- UI Options ----
 * @default
 *
 * @param Available Target Languages
 * @parent ---- UI Options ----
 * @desc Comma-separated list of language codes to show in the language selection UI (e.g., en,es,fr,ja).
 * @type text
 * @default en,es,fr,de,ja,ko,zh-CN,zh-TW,pt,it,ru
 *
 * @param Translator Options Help Text
 * @parent ---- UI Options ----
 * @desc Text shown in the help window of the translator options scene.
 * @type text
 * @default Select target language for translation.
 *
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
 *   JulesTranslator openLanguageMenu // Opens the in-game language selection menu.
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
 * @command openLanguageMenu
 * @text Open Language Menu
 * @desc Opens the in-game language selection menu.
 *
 * --- For RPG Maker MZ ---
 * This plugin aims for MZ compatibility. MZ uses a different plugin command
 * system. If using MZ, ensure you use MZ-style plugin commands if available,
 * or this plugin might later include specific MZ command registration.
 * For parameter types like 'file' or 'struct', this header uses basic
 * text/select types for broader compatibility; adjust as needed for MZ editor.
 *
 * --- Important Notes on Asynchronous Translation ---
 * - Machine Translation is Asynchronous: When using machine translation
 *   services (Google, DeepL), the game will request translations from an
 *   external server. This process is asynchronous.
 * - Initial Display: Texts subject to machine translation might briefly
 *   display in their original language. Once the translation is received
 *   from the server, the text element in the game will update.
 * - Language Switching: Changing the language via the in-game options menu
 *   will attempt to refresh most on-screen text elements. However, for a
 *   complete refresh of all UI elements, especially those managed by complex
 *   scenes or other plugins, a scene change (e.g., re-entering a menu or
 *   map) might occasionally be necessary.
 * - Data Translation: Game data (items, skills, actors, etc.) is also
 *   translated. If machine translation is used for these, the original
 *   text might be used initially if the translation is not yet available
 *   when the data is first accessed. The data will be updated in the
 *   background once translated.
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
    // const ESCAPE_CODE_REGEX = /\\([VNP thermiqueow]\[\d+\]|FN\[[^\]]+\]|PX\[\d+\]|PF\[\d+\]|[Gg]|[CcIi]\[\d+\]|[\$\.\|\!><\^\{\}\\])/gi;
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

    // const RPGMAKER_ESCAPE_CODE_REGEX = /\\\\(?:[VNPCOWFS]\w*\[[^\]]*\]|[GIgnpTherm]|[$.!><^{}|%^LN_#*@~])/gi;
    // Let's try a more structured one from common libraries, usually looks like:
    // \V[n], \N[n], \P[n], \G, \C[n], \I[n], \$, \., \|, \!, \>, \<, \^, \{, \}
    // MZ adds: \PX[n], \PF[n], \FS[n], \FN[fontname], \OC[n], \OW[n]
    // Also, \\ for literal backslash.

    // Se define el array de patrones de códigos de escape.
    // La mayoría son sensibles a mayúsculas.
    // \\\\ -> representa un solo \ en el string de la regex, que coincide con un \ en el texto.
    const escapeCodePatterns = [
        "\\\\\\\\",             // Literal backslash: \\
        "\\\\V\\[\\d+\\]",       // Variable: \V[n]
        "\\\\N\\[\\d+\\]",       // Actor Name: \N[n]
        "\\\\P\\[\\d+\\]",       // Party Member Name: \P[n]
        "\\\\[Gg]",             // Gold Window: \G or \g (insensible aquí)
        "\\\\C\\[\\d+\\]",       // Change Text Color: \C[n]
        "\\\\I\\[\\d+\\]",       // Draw Icon: \I[n]
        "\\\\\\$",              // Gold Window (obsoleto, \G es preferido): \$
        "\\\\\\.",              // Wait 1/4 second: \.
        "\\\\\\|",              // Wait 1 second: \|
        "\\\\\\!",              // Wait for Input: \!
        "\\\\\\>",              // Start Fast Forward: \>
        "\\\\\\<",              // End Fast Forward: \< (no siempre usado explícitamente)
        "\\\\\\^",              // Close Message Window without waiting: \^
        "\\\\\\{",              // Increase Font Size: \{
        "\\\\\\}",              // Decrease Font Size: \}
        // MZ Specific Codes (MV puede ignorarlos o algunos plugins podrían usarlos)
        "\\\\FS\\[\\d+\\]",      // Font Size: \FS[n]
        "\\\\FN\\[[^\\]]+\\]",   // Font Name: \FN[FontName] (permite cualquier caracter excepto ']')
        "\\\\OW\\[\\d+\\]",      // Outline Width: \OW[n]
        "\\\\OC\\[\\d+\\]",      // Outline Color: \OC[n]
        "\\\\PX\\[\\d+\\]",      // Player Character Name by party index: \PX[n] (MZ)
        "\\\\PF\\[\\d+\\]"       // Player Follower Name by follower index: \PF[n] (MZ)
        // Códigos de control de texto adicionales que podrían ser relevantes para no traducir:
        // \AF[n] - Actor Face (MZ)
        // \PM[n] - Party Member Face (MZ)
        // \TA[n] - Text Alignment (MZ) - No suele tener contenido traducible en sí mismo.
    ];

    // Unir los patrones con '|' y crear el RegExp. Usar solo la bandera 'g' (global).
    // La insensibilidad para \G ya está manejada con [Gg].
    const ESCAPE_CODE_REGEX_PATTERN = new RegExp(escapeCodePatterns.join("|"), 'g');
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

    $.maxRetriesOnError = parseInt($.Parameters['Max Retries On Error'] || 2, 10);
    $.initialRetryDelayMs = parseInt($.Parameters['Initial Retry Delay Ms'] || 500, 10);

    $.toggleHotkeyKey = String($.Parameters['Toggle Hotkey Key'] || 'F10').toLowerCase();
    // $.toggleHotkeyModifier = String($.Parameters['Toggle Hotkey Modifier'] || '').toLowerCase();

    const availableLanguagesParam = String($.Parameters['Available Target Languages'] || 'en,es,fr,de,ja,ko,zh-CN,zh-TW,pt,it,ru');
    $.availableLanguages = availableLanguagesParam.split(',').map(lang => lang.trim()).filter(lang => lang);
    $.translatorOptionsHelpText = String($.Parameters['Translator Options Help Text'] || 'Select target language for translation.');


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
        cache: new Map(), // Cache for final translated strings or pending placeholders
        manualTranslations: {},
        translationServices: {}, // Will hold instances of translation service connectors
        isEnabled: true,
        currentFileContext: null, // For DataManager hooks

        // For async UI updates
        pendingTranslations: new Map(), // Map<string (translationId), { originalText: string, processedText: string, escapeMap: any[], servicePromise: Promise, contexts: Set<object> }>
        translationRequestIdCounter: 0, // Counter to generate unique IDs for translation requests
        activeTextElements: new Map(), // Map<translationId, Set<TextElementUpdater>>
                                       // TextElementUpdater: { updateFunction: (newText) => void, context: any, originalPlaceholder: string }


        initialize: function() {
            this.pendingTranslations = new Map();
            this.translationRequestIdCounter = 0;
            this.activeTextElements = new Map();

            if (!$.enableCache) {
                this.cache = null; // Effectively disables caching
            }
            // loadManualTranslations is now async, its result is handled internally by the method.
            this.loadManualTranslations();
            this._escapeCodePlaceholderIndex = 0; // For generating unique placeholders

            // Initializing machine translation services
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

        _generateTranslationId: function() {
            return `jt_${this.translationRequestIdCounter++}`;
        },

        /**
         * Traduce un texto dado.
         * @param {string} originalText El texto original a traducir.
         * @param {object} contextInfo Información contextual opcional.
         * @returns {TranslationResult} Un objeto que contiene el estado y el valor de la traducción.
         * TranslationResult: {
         *   status: 'final' | 'pending' | 'manual' | 'original_fallback', // Estado de la traducción
         *   textToDisplay: string,     // Texto para mostrar inmediatamente (original o manual)
         *   translationId: string | null, // ID único si status es 'pending', para registrar callbacks
         *   finalText: string | null,    // Texto final traducido si ya está disponible (no pendiente)
         *   originalText: string       // El texto original (trimmed) que se intentó traducir
         * }
         */
        translate: function(originalText, contextInfo = {}) {
            if (!this.isEnabled || !originalText || typeof originalText !== 'string') {
                return { status: 'original_fallback', textToDisplay: originalText, translationId: null, finalText: originalText, originalText: originalText || "" };
            }
            const trimmedOriginalText = originalText.trim();
            if (trimmedOriginalText === '') {
                return { status: 'original_fallback', textToDisplay: originalText, translationId: null, finalText: originalText, originalText: trimmedOriginalText };
            }

            const PROCESSED_MARKER = "@@JT_FINAL@@"; // Marcador para resultados finales en caché (distinto de pending)
            const PENDING_MARKER_PREFIX = "@@JT_PENDING_ID_"; // Marcador para placeholders pendientes en caché

            // 1. Cache Check
            if (this.cache && this.cache.has(trimmedOriginalText)) {
                const cachedValue = this.cache.get(trimmedOriginalText);
                $.log(3, `Translate: Cache hit for: "${trimmedOriginalText}" -> "${cachedValue}"`);

                if (cachedValue.startsWith(PROCESSED_MARKER)) {
                    const finalText = cachedValue.substring(PROCESSED_MARKER.length);
                    return { status: 'final', textToDisplay: finalText, translationId: null, finalText: finalText, originalText: trimmedOriginalText };
                } else if (cachedValue.startsWith(PENDING_MARKER_PREFIX)) {
                    // Es un placeholder pendiente. La UI debe mostrar el original y registrarse.
                    const translationId = cachedValue.split("@@")[0].substring(PENDING_MARKER_PREFIX.length);
                    return { status: 'pending', textToDisplay: trimmedOriginalText, translationId: translationId, finalText: null, originalText: trimmedOriginalText };
                } else {
                    // Caché inválido o formato antiguo, tratar como miss.
                    $.log(1, `Translate: Invalid cache value for "${trimmedOriginalText}": ${cachedValue}`);
                }
            }

            // 2. Extract escape codes
            const { processedText, escapeMap } = this._extractEscapeCodes(trimmedOriginalText);

            // 3. Manual Translation Check
            if (this.manualTranslations[processedText]) {
                let manualTranslationOfProcessed = this.manualTranslations[processedText];
                let finalManualText = this._restoreEscapeCodes(manualTranslationOfProcessed, escapeMap);
                $.log(3, `Translate: Manual hit for (processed) "${processedText}" -> (restored) "${finalManualText}"`);
                if (this.cache) this.cache.set(trimmedOriginalText, PROCESSED_MARKER + finalManualText);
                return { status: 'manual', textToDisplay: finalManualText, translationId: null, finalText: finalManualText, originalText: trimmedOriginalText };
            }

            // 4. Machine Translation
            if ($.machineService && this.translationServices[$.machineService]) {
                const service = this.translationServices[$.machineService];

                if (service.isDisabledForSession) {
                    $.log(2, `Translate: MT service "${$.machineService}" is disabled. Using original for "${trimmedOriginalText}".`);
                    if (this.cache) this.cache.set(trimmedOriginalText, PROCESSED_MARKER + trimmedOriginalText);
                    return { status: 'original_fallback', textToDisplay: trimmedOriginalText, translationId: null, finalText: trimmedOriginalText, originalText: trimmedOriginalText };
                }

                const translationId = this._generateTranslationId();
                const placeholderForCache = `${PENDING_MARKER_PREFIX}${translationId}@@`;

                if (this.cache) this.cache.set(trimmedOriginalText, placeholderForCache);
                $.log(3, `Translate: Attempting MT for "${processedText}" (Original: "${trimmedOriginalText}"). ID: ${translationId}. Returning 'pending' status.`);

                service.translate(processedText, $.gameOriginalLanguage, $.targetLanguage, contextInfo)
                    .then(result => {
                        let mtFinalText;
                        if (result && result.error === null && result.translatedText !== processedText) {
                            mtFinalText = this._restoreEscapeCodes(result.translatedText, escapeMap);
                            $.log(2, `Translate: MT successful for ID ${translationId}: "${trimmedOriginalText}" -> "${mtFinalText}"`);
                        } else {
                            if (result && result.error) $.log(1, `Translate: MT error for ID ${translationId} ("${trimmedOriginalText}"): ${result.error}`);
                            else $.log(3, `Translate: MT no change for ID ${translationId} ("${trimmedOriginalText}").`);
                            mtFinalText = trimmedOriginalText; // Fallback
                        }

                        if (this.cache) {
                            // Solo actualizar caché si el valor sigue siendo el placeholder de esta traducción
                            if (this.cache.get(trimmedOriginalText) === placeholderForCache) {
                                this.cache.set(trimmedOriginalText, PROCESSED_MARKER + mtFinalText);
                            } else {
                                $.log(2, `Translate: Cache for "${trimmedOriginalText}" changed during MT. Not updating with MT result for ID ${translationId}.`);
                            }
                        }
                        MyTranslator.notifyTranslationComplete(translationId, mtFinalText, trimmedOriginalText);
                    })
                    .catch(error => {
                        $.log(1, `Translate: Unhandled MT promise error for ID ${translationId} ("${trimmedOriginalText}"):`, error);
                        if (this.cache && this.cache.get(trimmedOriginalText) === placeholderForCache) {
                            this.cache.set(trimmedOriginalText, PROCESSED_MARKER + trimmedOriginalText); // Fallback
                        }
                        MyTranslator.notifyTranslationComplete(translationId, trimmedOriginalText, trimmedOriginalText); // Notificar con fallback
                    });

                return { status: 'pending', textToDisplay: trimmedOriginalText, translationId: translationId, finalText: null, originalText: trimmedOriginalText };
            }

            // No MT service or not configured
            $.log(3, `Translate: No MT service for "${trimmedOriginalText}". Using original.`);
            if (this.cache) this.cache.set(trimmedOriginalText, PROCESSED_MARKER + trimmedOriginalText);
            return { status: 'original_fallback', textToDisplay: trimmedOriginalText, translationId: null, finalText: trimmedOriginalText, originalText: trimmedOriginalText };
        },

        registerTextElement: function(translationId, originalTextForDisplay, updateFunction, elementContext) {
            // translationId viene del placeholder @@JT_PENDING_ID
            // originalTextForDisplay es el texto que la UI debe mostrar mientras espera.
            if (!this.activeTextElements.has(translationId)) {
                this.activeTextElements.set(translationId, new Set());
            }
            this.activeTextElements.get(translationId).add({ updateFunction, context: elementContext, originalText: originalTextForDisplay });
            $.log(3, `Registered UI element for translation ID ${translationId}. Original display: "${originalTextForDisplay}"`);
        },

        unregisterTextElement: function(translationId, elementContext) {
            // TODO: Implementar si es necesario para limpiar elementos que ya no existen.
            // Podría ser complejo rastrear el `elementContext` exacto.
            // Por ahora, la limpieza se hace en notifyTranslationComplete después de actualizar.
             if (this.activeTextElements.has(translationId)) {
                const updaters = this.activeTextElements.get(translationId);
                let updaterToRemove = null;
                for (const updater of updaters) {
                    // Se necesitaría una forma más robusta de identificar el updater correcto si hay múltiples para el mismo ID y contexto.
                    // Por ahora, si el contexto es el mismo, asumimos que es el que queremos eliminar.
                    // Esto es simplista y puede no ser suficiente.
                    if (updater.context === elementContext) {
                        updaterToRemove = updater;
                        break;
                    }
                }
                if (updaterToRemove) {
                    updaters.delete(updaterToRemove);
                    $.log(3, `Unregistered UI element for translation ID ${translationId}`);
                    if (updaters.size === 0) {
                        this.activeTextElements.delete(translationId);
                    }
                }
            }
        },

        notifyTranslationComplete: function(translationId, translatedText, originalTrimmedText) {
            $.log(2, `Translation complete for ID ${translationId}. Notifying ${this.activeTextElements.has(translationId) ? this.activeTextElements.get(translationId).size : 0} elements.`);
            if (this.activeTextElements.has(translationId)) {
                this.activeTextElements.get(translationId).forEach(updater => {
                    try {
                        // Aquí, `translatedText` ya tiene los códigos de escape restaurados si vinieron de MT.
                        // La función de actualización es responsable de mostrarlo.
                        updater.updateFunction(translatedText);
                    } catch (e) {
                        $.log(1, `Error updating text element for ID ${translationId}:`, e, updater.context);
                        // Fallback: intentar actualizar con el texto original si la actualización con el traducido falla.
                        try {
                            updater.updateFunction(updater.originalText); // originalText aquí es el que se pasó a registerTextElement
                        } catch (e2) {
                            $.log(1, `Error updating text element with fallback original text for ID ${translationId}:`, e2, updater.context);
                        }
                    }
                });
                this.activeTextElements.delete(translationId); // Limpiar después de notificar a todos los suscriptores para este ID.
            }
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

            // Using fetch API for asynchronous loading
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        // For local files (file:// protocol), status might be 0 on success or error.
                        // Need to check response.type as well, or rely on text() to fail for actual errors.
                        if (response.status === 0 && response.type === 'basic') { // Likely local file success
                            return response.json();
                        }
                        throw new Error(`HTTP error ${response.status} while fetching ${fileName}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.manualTranslations = data;
                    $.log(2, `Successfully loaded and parsed manual translations from ${fileName}. Found ${Object.keys(this.manualTranslations).length} entries.`);
                })
                .catch(error => {
                    // Distinguish between file not found (404) and other errors
                    if (error.message && error.message.includes("404")) {
                        $.log(2, `Manual translation file ${fileName} not found at ${filePath}. This might be normal if no manual translations are provided for this language pair.`);
                    } else {
                        $.log(1, `Error loading or parsing manual translation file ${fileName}:`, error);
                    }
                    this.manualTranslations = {}; // Ensure it's empty on error
                });
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
                        this.translateActorsData_v2(dataObject); // Using v2 which is now the main one
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

        translateSystemData: function(systemData) { // systemData es $dataSystem
            $.log(3, "Translating System Data ($dataSystem)...");

            // Propiedades directas
            this._translateAndRegisterDataProperty_v2(systemData, 'gameTitle', '$dataSystem.gameTitle');
            this._translateAndRegisterDataProperty_v2(systemData, 'currencyUnit', '$dataSystem.currencyUnit');

            // Arrays de strings (elements, skillTypes, weaponTypes, armorTypes)
            ['elements', 'skillTypes', 'weaponTypes', 'armorTypes', 'variables', 'switches'].forEach(arrayName => {
                if (systemData[arrayName] && Array.isArray(systemData[arrayName])) {
                    for (let i = 0; i < systemData[arrayName].length; i++) {
                        // Estas son propiedades directas de un array, no objetos.
                        // El helper _v2 está hecho para obj[prop].
                        // Necesitamos un helper para array[i] o modificar el actual.
                        // Por ahora, lo haremos manualmente para estos.
                        const originalValue = systemData[arrayName][i];
                        if (typeof originalValue === 'string' && originalValue.trim() !== '') {
                            const context = `$dataSystem.${arrayName}[${i}]`;
                            const translationResult = this.translate(originalValue, { context });
                            systemData[arrayName][i] = translationResult.textToDisplay;

                            if (translationResult.status === 'pending' && translationResult.translationId) {
                                const transId = translationResult.translationId;
                                const origText = translationResult.originalText;
                                this.registerDataUpdate(transId, origText, (newText) => {
                                    // Asegurarse de que el array y el índice sigan siendo válidos
                                    if ($dataSystem && $dataSystem[arrayName] && $dataSystem[arrayName][i] === origText) {
                                        $dataSystem[arrayName][i] = newText;
                                        $.log(2, `Updated ${context} for ID ${transId} to "${newText}"`);
                                    } else if ($dataSystem && $dataSystem[arrayName] && $dataSystem[arrayName][i] !== newText) {
                                        $.log(1, `${context} changed unexpectedly before ID ${transId} update.`);
                                    }
                                }, context);
                            }
                        }
                    }
                }
            });

            // Objeto terms
            if (systemData.terms) {
                for (const categoryKey in systemData.terms) { // basic, commands, params, messages
                    if (Object.prototype.hasOwnProperty.call(systemData.terms, categoryKey)) {
                        const categoryValue = systemData.terms[categoryKey];
                        const termContextBase = `$dataSystem.terms.${categoryKey}`;

                        if (Array.isArray(categoryValue)) { // ej. terms.commands es un array
                            for (let i = 0; i < categoryValue.length; i++) {
                                const originalTerm = categoryValue[i];
                                if (typeof originalTerm === 'string' && originalTerm.trim() !== '') {
                                    const context = `${termContextBase}[${i}]`;
                                    const translationResult = this.translate(originalTerm, { context });
                                    systemData.terms[categoryKey][i] = translationResult.textToDisplay;

                                    if (translationResult.status === 'pending' && translationResult.translationId) {
                                        const transId = translationResult.translationId;
                                        const origText = translationResult.originalText;
                                        this.registerDataUpdate(transId, origText, (newText) => {
                                            if ($dataSystem && $dataSystem.terms && $dataSystem.terms[categoryKey] && $dataSystem.terms[categoryKey][i] === origText) {
                                                $dataSystem.terms[categoryKey][i] = newText;
                                                $.log(2, `Updated ${context} for ID ${transId} to "${newText}"`);
                                            } else if ($dataSystem && $dataSystem.terms && $dataSystem.terms[categoryKey] && $dataSystem.terms[categoryKey][i] !== newText){
                                                $.log(1, `${context} changed unexpectedly for ID ${transId}.`);
                                            }
                                        }, context);
                                    }
                                }
                            }
                        } else if (typeof categoryValue === 'object' && categoryValue !== null) { // ej. terms.messages es un objeto de strings
                            for (const messageKey in categoryValue) {
                                if (Object.prototype.hasOwnProperty.call(categoryValue, messageKey)) {
                                     this._translateAndRegisterDataProperty_v2(categoryValue, messageKey, `${termContextBase}.${messageKey}`);
                                }
                            }
                        }
                    }
                }
            }
            $.log(3, "Finished translating System Data (v2).");
        },

        registerDataUpdate: function(translationId, originalTextForDisplay, updateFunction, dataContext) {
            if (!this.activeTextElements.has(translationId)) {
                this.activeTextElements.set(translationId, new Set());
            }
            // La updateFunction aquí es específica para actualizar el objeto de datos.
            this.activeTextElements.get(translationId).add({
                updateFunction: updateFunction,
                context: dataContext,
                originalText: originalTextForDisplay
            });
            $.log(3, `Registered data update for ID ${translationId}, Context: ${dataContext}`);
        },

    // --- Language Change Notification System ---
    _languageChangeListeners: new Set(),

    subscribeToLanguageChange: function(callback) {
        this._languageChangeListeners.add(callback);
    },

    unsubscribeFromLanguageChange: function(callback) {
        this._languageChangeListeners.delete(callback);
    },

    dispatchLanguageChange: function() {
        $.log(2, "Dispatching language change event to listeners.");
        // Limpiar activeTextElements para el idioma anterior
        this.activeTextElements.clear();
        // Limpiar caché también (aunque processOk ya lo hace, es bueno tenerlo aquí por si se llama desde otro lado)
        if (this.cache) this.cache.clear();

        // Recargar traducciones manuales para el nuevo idioma (ya se hace en processOk, pero por completitud)
        // this.loadManualTranslations(); // Asegurarse que $.targetLanguage ya está actualizado

        this._languageChangeListeners.forEach(callback => {
            try {
                callback();
            } catch (e) {
                $.log(1, "Error in language change listener:", e);
            }
        });
        // Forzar un refresco de la escena actual si es posible
        if (SceneManager._scene) {
            if (typeof SceneManager._scene.refresh === 'function') {
                $.log(2, "Attempting to call refresh() on current scene.");
                SceneManager._scene.refresh();
            } else if (SceneManager._scene instanceof Scene_Map || SceneManager._scene instanceof Scene_Battle || SceneManager._scene instanceof Scene_MenuBase) {
                // Para escenas comunes, un goto a sí misma es una forma de forzar recarga completa.
                // Esto puede ser disruptivo (ej. perder estado de ventana no guardado). Usar con precaución.
                // Por ahora, no lo haremos automáticamente, dejaremos que las ventanas se suscriban.
                // $.log(2, `Attempting to reload current scene: ${SceneManager._scene.constructor.name}`);
                // SceneManager.goto(SceneManager._scene.constructor);
            }
        }
    },
    // --- End Language Change Notification System ---

        _translateAndRegisterDataProperty: function(dataObject, propertyName, dataContextString, globalDataObject, pathToArray, indexInArray) {
            const originalValue = dataObject[propertyName];
            if (typeof originalValue === 'string' && originalValue.trim() !== '') {
                const translationResult = this.translate(originalValue, { context: dataContextString });

                dataObject[propertyName] = translationResult.textToDisplay; // Mostrar original si está pendiente

                if (translationResult.status === 'pending' && translationResult.translationId) {
                    const translationId = translationResult.translationId;
                    const originalText = translationResult.originalText; // El original que se puso en la propiedad

                    MyTranslator.registerDataUpdate(
                        translationId,
                        originalText,
                        (newlyTranslatedText) => {
                            // Re-acceder al objeto de datos global en caso de que haya sido reemplazado (poco probable para $dataXXX)
                            // pero más seguro para datos de mapas, etc.
                            let targetObject = globalDataObject;
                            if (pathToArray) { // Si es una propiedad dentro de un array (ej. $dataActors[i].name)
                                if (globalDataObject[pathToArray] && globalDataObject[pathToArray][indexInArray]) {
                                    targetObject = globalDataObject[pathToArray][indexInArray];
                                } else {
                                    $.log(1, `Data object path ${pathToArray}[${indexInArray}] not found for ID ${translationId} update.`);
                                    return;
                                }
                            } else { // Si es una propiedad directa del objeto global (ej. $dataSystem.gameTitle)
                                targetObject = globalDataObject;
                            }

                            if (targetObject && targetObject[propertyName] === originalText) {
                                targetObject[propertyName] = newlyTranslatedText;
                                $.log(2, `Updated ${dataContextString} for ID ${translationId} to "${newlyTranslatedText}"`);
                            } else if (targetObject && targetObject[propertyName] !== newlyTranslatedText) {
                                $.log(1, `${dataContextString} changed unexpectedly before ID ${translationId} update. Current: "${targetObject ? targetObject[propertyName] : 'N/A'}"`);
                            }
                        },
                        dataContextString
                    );
                }
            }
        },

        translateItemsData: function(itemsData) {
            $.log(3, "Translating Items Data ($dataItems)...");
            for (let i = 1; i < itemsData.length; i++) {
                const item = itemsData[i];
                if (item) {
                    const baseContext = `$dataItems[${i}]`;
                    this._translateAndRegisterDataProperty(item, 'name', `${baseContext}.name`, $dataItems, null, i);
                    this._translateAndRegisterDataProperty(item, 'description', `${baseContext}.description`, $dataItems, null, i);
                    this._translateAndRegisterDataProperty(item, 'message1', `${baseContext}.message1`, $dataItems, null, i);
                    this._translateAndRegisterDataProperty(item, 'message2', `${baseContext}.message2`, $dataItems, null, i);
                    this._translateAndRegisterDataProperty(item, 'message3', `${baseContext}.message3`, $dataItems, null, i);
                    this._translateAndRegisterDataProperty(item, 'message4', `${baseContext}.message4`, $dataItems, null, i);
                }
            }
            $.log(3, "Finished translating Items Data.");
        },

        translateActorsData: function(actorsData) {
            $.log(3, "Translating Actors Data ($dataActors)...");
            for (let i = 1; i < actorsData.length; i++) {
                const actor = actorsData[i];
                if (actor) {
                    const baseContext = `$dataActors[${i}]`;
                    // Para propiedades dentro de un array, necesitamos pasar el nombre del array y el índice
                    // Asumiendo que actorsData es $dataActors directamente.
                    // El helper _translateAndRegisterDataProperty no está diseñado para modificar el array global directamente,
                    // sino el objeto que se le pasa. En este caso, `actor` es una referencia a $dataActors[i].
                    this._translateAndRegisterDataProperty(actor, 'name', `${baseContext}.name`, $dataActors, /*pathToArray*/ null, i);
                    this._translateAndRegisterDataProperty(actor, 'nickname', `${baseContext}.nickname`, $dataActors, /*pathToArray*/ null, i);
                    this._translateAndRegisterDataProperty(actor, 'profile', `${baseContext}.profile`, $dataActors, /*pathToArray*/ null, i);
                    // Si $dataActors fuera una propiedad de otro objeto, pathToArray sería 'actors'.
                    // Como es el objeto global, y actor es $dataActors[i], no necesitamos pathToArray.
                    // Sin embargo, la función de actualización necesita saber cómo encontrar $dataActors[i].
                    // Revisión de _translateAndRegisterDataProperty:
                    // El globalDataObject es $dataActors. pathToArray debería ser null (o el nombre de la propiedad si $dataActors fuera un campo).
                    // El indexInArray es i.
                    // La función de actualización necesita $dataActors[i][propertyName].
                    // La forma actual del helper es un poco confusa para arrays de objetos.
                    // Vamos a simplificar: el helper opera sobre el objeto dado (actor, item).
                    // La función de actualización también opera sobre ese mismo objeto, asumiendo que es una referencia.
                }
            }
            $.log(3, "Finished translating Actors Data.");
        },

        // Revisión del helper para que sea más claro con objetos dentro de arrays globales
        _translateAndRegisterDataProperty_v2: function(targetObject, propertyName, dataContextString) {
            // targetObject es la entidad específica (ej. $dataActors[i], $dataItems[j])
            const originalValue = targetObject[propertyName];
            if (typeof originalValue === 'string' && originalValue.trim() !== '') {
                const translationResult = this.translate(originalValue, { context: dataContextString });

                targetObject[propertyName] = translationResult.textToDisplay;

                if (translationResult.status === 'pending' && translationResult.translationId) {
                    const translationId = translationResult.translationId;
                    const originalText = translationResult.originalText;

                    MyTranslator.registerDataUpdate(
                        translationId,
                        originalText,
                        (newlyTranslatedText) => {
                            // Asumimos que targetObject sigue siendo la referencia correcta al objeto en el array global
                            if (targetObject && targetObject[propertyName] === originalText) {
                                targetObject[propertyName] = newlyTranslatedText;
                                $.log(2, `Updated ${dataContextString} for ID ${translationId} to "${newlyTranslatedText}"`);
                            } else if (targetObject && targetObject[propertyName] !== newlyTranslatedText) {
                                $.log(1, `${dataContextString} changed unexpectedly before ID ${translationId} update. Current: "${targetObject ? targetObject[propertyName] : 'N/A'}"`);
                            }
                        },
                        dataContextString
                    );
                }
            }
        },

        // Re-implementar translateActorsData con _v2
        translateActorsData_v2: function(actorsData) { // actorsData es $dataActors
            $.log(3, "Translating Actors Data ($dataActors) v2...");
            for (let i = 1; i < actorsData.length; i++) {
                const actor = actorsData[i]; // actor es $dataActors[i]
                if (actor) {
                    const baseContext = `$dataActors[${i}]`;
                    this._translateAndRegisterDataProperty_v2(actor, 'name', `${baseContext}.name`);
                    this._translateAndRegisterDataProperty_v2(actor, 'nickname', `${baseContext}.nickname`);
                    this._translateAndRegisterDataProperty_v2(actor, 'profile', `${baseContext}.profile`);
                }
            }
            $.log(3, "Finished translating Actors Data (v2)."); // Log actualizado
        },

        translateSkillsData: function(skillsData) { // skillsData es $dataSkills
            $.log(3, "Translating Skills Data ($dataSkills)...");
            for (let i = 1; i < skillsData.length; i++) {
                const skill = skillsData[i]; // skill es $dataSkills[i]
                if (skill) {
                    const baseContext = `$dataSkills[${i}]`;
                    this._translateAndRegisterDataProperty_v2(skill, 'name', `${baseContext}.name`);
                    this._translateAndRegisterDataProperty_v2(skill, 'description', `${baseContext}.description`);
                    this._translateAndRegisterDataProperty_v2(skill, 'message1', `${baseContext}.message1`);
                    this._translateAndRegisterDataProperty_v2(skill, 'message2', `${baseContext}.message2`);
                    // MZ specific messages on skills (message3, message4 for ally/enemy fainted are not typical on skill object itself in MZ, but on states or from battle manager)
                    // However, some custom setups or MV carry-overs might use them.
                    if (skill.hasOwnProperty('message3')) { // Check if property exists
                        this._translateAndRegisterDataProperty_v2(skill, 'message3', `${baseContext}.message3`);
                    }
                    if (skill.hasOwnProperty('message4')) {
                        this._translateAndRegisterDataProperty_v2(skill, 'message4', `${baseContext}.message4`);
                    }
                }
            }
            $.log(3, "Finished translating Skills Data.");
        },

        translateClassesData: function(classesData) { // classesData es $dataClasses
            $.log(3, "Translating Classes Data ($dataClasses)...");
            for (let i = 1; i < classesData.length; i++) {
                const classObj = classesData[i]; // classObj es $dataClasses[i]
                if (classObj) {
                    const baseContext = `$dataClasses[${i}]`;
                    this._translateAndRegisterDataProperty_v2(classObj, 'name', `${baseContext}.name`);
                }
            }
            $.log(3, "Finished translating Classes Data.");
        },

        translateStatesData: function(statesData) { // statesData es $dataStates
            $.log(3, "Translating States Data ($dataStates)...");
            for (let i = 1; i < statesData.length; i++) {
                const state = statesData[i]; // state es $dataStates[i]
                if (state) {
                    const baseContext = `$dataStates[${i}]`;
                    this._translateAndRegisterDataProperty_v2(state, 'name', `${baseContext}.name`);
                    this._translateAndRegisterDataProperty_v2(state, 'message1', `${baseContext}.message1`);
                    this._translateAndRegisterDataProperty_v2(state, 'message2', `${baseContext}.message2`);
                    this._translateAndRegisterDataProperty_v2(state, 'message3', `${baseContext}.message3`);
                    this._translateAndRegisterDataProperty_v2(state, 'message4', `${baseContext}.message4`);

                    // MZ specific messages
                    if (Utils.RPGMAKER_NAME === 'MZ') {
                        if (state.hasOwnProperty('messageInflicted')) {
                            this._translateAndRegisterDataProperty_v2(state, 'messageInflicted', `${baseContext}.messageInflicted`);
                        }
                        if (state.hasOwnProperty('messageAlready')) {
                            this._translateAndRegisterDataProperty_v2(state, 'messageAlready', `${baseContext}.messageAlready`);
                        }
                        if (state.hasOwnProperty('messageProtected')) {
                            this._translateAndRegisterDataProperty_v2(state, 'messageProtected', `${baseContext}.messageProtected`);
                        }
                        if (state.hasOwnProperty('messageEmerged')) {
                            this._translateAndRegisterDataProperty_v2(state, 'messageEmerged', `${baseContext}.messageEmerged`);
                        }
                        if (state.hasOwnProperty('messageDisappeared')) {
                            this._translateAndRegisterDataProperty_v2(state, 'messageDisappeared', `${baseContext}.messageDisappeared`);
                        }
                    }
                }
            }
            $.log(3, "Finished translating States Data.");
        },

        translateEnemiesData: function(enemiesData) { // enemiesData es $dataEnemies
            $.log(3, "Translating Enemies Data ($dataEnemies)...");
            for (let i = 1; i < enemiesData.length; i++) {
                const enemy = enemiesData[i]; // enemy es $dataEnemies[i]
                if (enemy) {
                    const baseContext = `$dataEnemies[${i}]`;
                    this._translateAndRegisterDataProperty_v2(enemy, 'name', `${baseContext}.name`);
                }
            }
            $.log(3, "Finished translating Enemies Data.");
        },

        translateArmorsData: function(armorsData) { // armorsData es $dataArmors
            $.log(3, "Translating Armors Data ($dataArmors)...");
            for (let i = 1; i < armorsData.length; i++) {
                const armor = armorsData[i]; // armor es $dataArmors[i]
                if (armor) {
                    const baseContext = `$dataArmors[${i}]`;
                    this._translateAndRegisterDataProperty_v2(armor, 'name', `${baseContext}.name`);
                    this._translateAndRegisterDataProperty_v2(armor, 'description', `${baseContext}.description`);
                }
            }
            $.log(3, "Finished translating Armors Data.");
        },

        translateWeaponsData: function(weaponsData) { // weaponsData es $dataWeapons
            $.log(3, "Translating Weapons Data ($dataWeapons)...");
            for (let i = 1; i < weaponsData.length; i++) {
                const weapon = weaponsData[i]; // weapon es $dataWeapons[i]
                if (weapon) {
                    const baseContext = `$dataWeapons[${i}]`;
                    this._translateAndRegisterDataProperty_v2(weapon, 'name', `${baseContext}.name`);
                    this._translateAndRegisterDataProperty_v2(weapon, 'description', `${baseContext}.description`);
                    }
                }
            }
            $.log(3, "Finished translating Weapons Data.");
        },

        translateMapInfosData: function(mapInfosData) { // mapInfosData es $dataMapInfos
            $.log(3, "Translating Map Infos Data ($dataMapInfos)...");
            for (let i = 0; i < mapInfosData.length; i++) {
                const mapInfo = mapInfosData[i]; // mapInfo es $dataMapInfos[i]
                if (mapInfo) { // Puede haber nulls, especialmente en el índice 0
                    const baseContext = `$dataMapInfos[${i}]`;
                    this._translateAndRegisterDataProperty_v2(mapInfo, 'name', `${baseContext}.name`);
                    // 'displayName' es otro campo que a veces se usa y podría necesitar traducción.
                    // Por defecto, si displayName está vacío, el juego usa 'name'.
                    // Si se quiere traducir displayName explícitamente si existe:
                    if (mapInfo.hasOwnProperty('displayName')) {
                         this._translateAndRegisterDataProperty_v2(mapInfo, 'displayName', `${baseContext}.displayName`);
                    }
                }
            }
            $.log(3, "Finished translating Map Infos Data.");
        },

        translateTroopsData: function(troopsData) { // troopsData es $dataTroops
            $.log(3, "Translating Troops Data ($dataTroops)...");
            for (let i = 1; i < troopsData.length; i++) {
                const troop = troopsData[i]; // troop es $dataTroops[i]
                if (troop) {
                    const baseContext = `$dataTroops[${i}]`;
                    this._translateAndRegisterDataProperty_v2(troop, 'name', `${baseContext}.name`);
                    // Los eventos de la tropa (troop.pages) se procesan cuando se carga la tropa para la batalla,
                    // o si se accede a ellos de otra manera. La traducción de nombres de enemigos dentro
                    // de la tropa (troop.members) se basa en $dataEnemies.
                }
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
                                    // For Show Text, we want the actual string in the command parameters.
                                    // The Window_Message hook will handle TranslationResult and pending states.
                                    const translationResult = this.translate(originalLine, {
                                        context: `${contextInfo.context}.command[${i}].textLine[${j-(i+1)}]`
                                    });
                                    textLineCommand.parameters[0] = translationResult.textToDisplay;

                                    if (originalLine !== textLineCommand.parameters[0]) {
                                        $.log(3, ` -> Translated line ${j-(i+1)}: "${originalLine}" TO "${textLineCommand.parameters[0]}" (Status: ${translationResult.status})`);
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
                            $.log(3, `translateEventList: Found Show Choices (102) at ${cmdContext}. Processing choices for TranslationResult objects.`);
                            const originalChoices = command.parameters[0];
                            const newChoicesParameter = [];

                            for (let choiceIndex = 0; choiceIndex < originalChoices.length; choiceIndex++) {
                                const originalChoiceText = originalChoices[choiceIndex];
                                if (typeof originalChoiceText === 'string') {
                                    const translationResult = this.translate(originalChoiceText, {
                                        context: `${cmdContext}.choice[${choiceIndex}]`
                                    });

                                    // Store an object that Window_ChoiceList can use
                                    newChoicesParameter.push({
                                        textForDisplay: translationResult.textToDisplay, // Original if pending, translated if final/manual
                                        translationId: translationResult.translationId, // null if not pending
                                        originalEventText: translationResult.originalText // The actual original string
                                    });
                                    $.log(3, ` -> Choice ${choiceIndex}: Original: "${originalChoiceText}", Result:`, translationResult);
                                } else {
                                    // If a choice is not a string, keep it as is (should not happen in standard data)
                                    newChoicesParameter.push(originalChoiceText);
                                    $.log(3, ` -> Choice ${choiceIndex} was not a string:`, originalChoiceText);
                                }
                            }
                            command.parameters[0] = newChoicesParameter; // Replace original choices array with new array of objects
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
                                    // Similar to Show Text, Window_ScrollText will handle the display.
                                    const translationResult = this.translate(originalLine, {
                                        context: `${contextInfo.context}.command[${i}].scrollLine[${j-(i+1)}]`
                                    });
                                    textLineCommand.parameters[0] = translationResult.textToDisplay;
                                    if (originalLine !== textLineCommand.parameters[0]) {
                                        $.log(3, ` -> Translated scroll line ${j-(i+1)}: "${originalLine}" TO "${textLineCommand.parameters[0]}" (Status: ${translationResult.status})`);
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
                            const nameContext = `${cmdContext}.actorNameChange.actorId${actorId}`;
                            const translationResult = this.translate(originalName, { context: nameContext });

                            command.parameters[1] = translationResult.textToDisplay;
                            $.log(3, ` -> Cmd 129 (Change Actor Name): Original: "${originalName}", Display: "${translationResult.textToDisplay}"`);

                            if (translationResult.status === 'pending' && translationResult.translationId) {
                                // Actualizar el parámetro del comando directamente es difícil si el evento ya no está "activo"
                                // o si la lista de comandos es una copia. Por ahora, no se registrará una actualización
                                // para el comando en sí. El nombre se cambiará al valor original (textToDisplay).
                                // Si el actor está en pantalla, su nombre visible podría actualizarse a través de hooks de ventana
                                // si esos hooks vuelven a traducir el nombre del actor desde $gameActors.
                                $.log(2, `Cmd 129: Actor name change for ID ${translationResult.translationId} is pending. Parameter set to original: "${translationResult.textToDisplay}"`);
                            }
                        }
                        break;

                    case 132: // Change Actor Nickname (MV)
                        if (Utils.RPGMAKER_NAME === 'MV' && command.parameters && typeof command.parameters[1] === 'string') {
                            const actorId = command.parameters[0];
                            const originalNickname = command.parameters[1];
                            const nickContext = `${cmdContext}.actorNicknameChange.actorId${actorId}`;
                            const translationResult = this.translate(originalNickname, { context: nickContext });

                            command.parameters[1] = translationResult.textToDisplay;
                            $.log(3, ` -> Cmd 132 (Change Nickname MV): Original: "${originalNickname}", Display: "${translationResult.textToDisplay}"`);

                            if (translationResult.status === 'pending' && translationResult.translationId) {
                                $.log(2, `Cmd 132: Nickname change for ID ${translationResult.translationId} is pending. Parameter set to original.`);
                                // Similar a Change Actor Name, no se registrará actualización directa del comando.
                            }
                        }
                        break;

                    case 133: // Change Profile
                        if (command.parameters && typeof command.parameters[1] === 'string') {
                            const actorId = command.parameters[0]; // Parámetro 0 es actorId
                            const originalProfileLine1 = command.parameters[1];
                            const p1Context = `${cmdContext}.profileChange.actorId${actorId}.line1`;
                            const resultP1 = this.translate(originalProfileLine1, { context: p1Context });

                            command.parameters[1] = resultP1.textToDisplay;
                            $.log(3, ` -> Cmd 133 (Change Profile L1): Original: "${originalProfileLine1}", Display: "${resultP1.textToDisplay}"`);
                            if (resultP1.status === 'pending' && resultP1.translationId) {
                                $.log(2, `Cmd 133 L1 for ID ${resultP1.translationId} is pending. Parameter set to original.`);
                            }

                            if (Utils.RPGMAKER_NAME === 'MV' && command.parameters.length > 2 && typeof command.parameters[2] === 'string') {
                                const originalProfileLine2 = command.parameters[2];
                                const p2Context = `${cmdContext}.profileChange.actorId${actorId}.line2`;
                                const resultP2 = this.translate(originalProfileLine2, { context: p2Context });
                                command.parameters[2] = resultP2.textToDisplay;
                                $.log(3, ` -> Cmd 133 (Change Profile L2 MV): Original: "${originalProfileLine2}", Display: "${resultP2.textToDisplay}"`);
                                if (resultP2.status === 'pending' && resultP2.translationId) {
                                    $.log(2, `Cmd 133 L2 for ID ${resultP2.translationId} (MV) is pending. Parameter set to original.`);
                                }
                            }
                        }
                        break;

                    // TODO: Revisar otros comandos que puedan tener texto:
                    // 103: Input Number (no text)
                    // 104: Select Item (no direct text, uses item names)
                    // 118: Label (no text)
                    // 119: Jump to Label (no text)
                    // 121: Control Switches (names in editor, not runtime text)
                    // 122: Control Variables (names in editor)
                    // 123: Control Self Switch (no text)
                    // 124: Control Timer (no text)
                    // 125: Change Gold (no text)
                    // 126: Change Items (item names)
                    // 127: Change Weapons (weapon names)
                    // 128: Change Armors (armor names)
                    // 134: Change Class (class names) - El nombre de la clase se lee de $dataClasses
                    // 135: Change Actor Graphic (no text)
                    // 136: Change Vehicle Graphic (no text)
                    // 201: Transfer Player (map names from MapInfos.json)
                    // 205: Set Move Route (puede tener scripts con texto, pero eso es avanzado)
                    // 231: Show Picture (name is editor only)
                    // 232: Move Picture
                    // 301: Battle Processing (troop names from Troops.json)
                    // 302: Shop Processing (item names)
                    // 303: Name Input Processing (actor name, handled by window)
                    // 320: Change Actor Name (ya cubierto)
                    // 324: Change Actor Nickname (ya cubierto)
                    // 325: Change Actor Profile (ya cubierto)
                    // 355/655: Script calls (generalmente no se traduce el contenido del script)
                    // 356 (MV) / 357 (MZ) Plugin Command: El contenido es específico del plugin.
                    // Los textos que aparecen por estos comandos (ej. nombres de ítems en tienda)
                    // deben ser traducidos cuando se cargan los datos correspondientes (Items.json, etc.)
                    // o por los hooks de ventana que los muestran.

                    // Los más importantes ya están cubiertos: Show Text, Choices, Scroll Text,
                    // y los cambios de nombre/perfil de actor.

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

        PluginManager.registerCommand(pluginName, "openLanguageMenu", args => {
            if ($.Scene_TranslatorOptions) {
                SceneManager.push($.Scene_TranslatorOptions);
                $.log(2, 'JulesTranslator language menu opened via MZ command.');
            } else {
                $.log(1, 'Scene_TranslatorOptions is not defined. Make sure component file is included.');
            }
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
                    case 'openlanguagemenu': // ensure lowercase for MV command parsing
                        if ($.Scene_TranslatorOptions) {
                            SceneManager.push($.Scene_TranslatorOptions);
                            $.log(2, 'JulesTranslator language menu opened via MV command.');
                        } else {
                            $.log(1, 'Scene_TranslatorOptions is not defined. Make sure component file is included.');
                        }
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

// --- Suscripción genérica de escenas al cambio de idioma ---
// Esto se coloca fuera del IIFE de JulesTranslator para modificar Scene_Base globalmente,
// pero solo si JulesTranslator (y por ende MyTranslator) está cargado.
if (Imported.JulesTranslator && JulesTranslator.Parameters && JulesTranslator.Parameters['Enable Text Hooking'] === 'true') {
    (function($) { // Usamos $ para referirnos a JulesTranslator namespace
        const _Scene_Base_initialize = Scene_Base.prototype.initialize;
        Scene_Base.prototype.initialize = function() {
            _Scene_Base_initialize.call(this);
            // Crear el bound function una vez por instancia de escena
            this._julesTranslatorLanguageChangeBound = this.onJulesTranslatorLanguageChange.bind(this);
        };

        const _Scene_Base_start = Scene_Base.prototype.start;
        Scene_Base.prototype.start = function() {
            _Scene_Base_start.call(this);
            // Suscribirse cuando la escena realmente comienza y es la activa
            if (MyTranslator && MyTranslator.subscribeToLanguageChange) {
                MyTranslator.subscribeToLanguageChange(this._julesTranslatorLanguageChangeBound);
            }
        };

        const _Scene_Base_terminate = Scene_Base.prototype.terminate;
        Scene_Base.prototype.terminate = function() {
            _Scene_Base_terminate.call(this);
            // Desuscribirse cuando la escena termina
            if (MyTranslator && MyTranslator.unsubscribeFromLanguageChange) {
                MyTranslator.unsubscribeFromLanguageChange(this._julesTranslatorLanguageChangeBound);
            }
        };

        Scene_Base.prototype.onJulesTranslatorLanguageChange = function() {
            // Solo actuar si esta escena es la actual.
            if (SceneManager._scene !== this) {
                return;
            }

            $.log(2, `Language change event received in active scene: ${this.constructor.name}. Refreshing windows.`);

            if (this._windowLayer) {
                this._windowLayer.children.forEach(childWindow => {
                    if (childWindow instanceof Window_Base) {
                        try {
                            if (childWindow instanceof Window_Command) {
                                // Para Window_Command, es crucial reconstruir la lista de comandos
                                // ya que los nombres se establecen en makeCommandList (a través de addCommand).
                                // El addCommand hookeado usará el nuevo $.targetLanguage.
                                childWindow.clearCommandList();
                                childWindow.makeCommandList();
                                // makeCommandList usualmente llama a refresh internamente o se espera que se llame después.
                                // Si no, un refresh explícito es necesario.
                                // childWindow.refresh(); // makeCommandList a menudo no refresca visualmente de inmediato.
                            }
                            // Un refresh general para la mayoría de las ventanas debería redibujar su contenido.
                            // Las ventanas que dependen de datos (ej. Window_Status) deberían recoger los datos re-traducidos
                            // si los datos globales ($dataActors, etc.) también se actualizan o si la ventana
                            // vuelve a traducir los datos que obtiene.
                            if (typeof childWindow.refresh === 'function') {
                                childWindow.refresh();
                                $.log(3, `Refreshed window: ${childWindow.constructor.name}`);
                            } else {
                                $.log(3, `Window ${childWindow.constructor.name} has no refresh method.`);
                            }
                        } catch (e) {
                            $.log(1, `Error refreshing window ${childWindow.constructor.name} on language change:`, e);
                        }
                    }
                });
            }

            // Casos especiales para escenas que podrían necesitar más que solo refrescar ventanas
            if (this instanceof Scene_Map) {
                // Si el nombre del mapa se muestra en una ventana específica (ej. Window_MapName),
                // esa ventana debería refrescarse por el bucle anterior.
                // Si hay otros elementos de UI directamente en la escena, necesitarían manejo aquí.
                // Por ejemplo, si Scene_Map necesitara redibujar algo que depende del idioma.
                if (typeof this.refreshDisplayName === "function") { // Para el nombre del mapa si se muestra
                    this.refreshDisplayName();
                }
            }
            // Para Scene_Message (si es una escena y no solo una ventana global)
            // o si Window_Message necesita un trato especial cuando está activa durante un cambio de idioma:
            if ($gameMessage && $gameMessage.isBusy() && SceneManager._scene._messageWindow && SceneManager._scene._messageWindow.isOpen()) {
                $.log(2, "Language change during active message. Attempting to restart message window.");
                // Esto es disruptivo pero asegura que el texto se re-traduzca con el nuevo idioma.
                SceneManager._scene._messageWindow._showFast = true;
                SceneManager._scene._messageWindow.startMessage();
            }
        };
    })(JulesTranslator); // Pasar el namespace del plugin si es necesario para $.log
}
