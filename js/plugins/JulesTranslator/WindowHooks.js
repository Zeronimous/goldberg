// ===========================================================================
// JulesTranslator_WindowHooks.js
// ===========================================================================

var JulesTranslator = JulesTranslator || {};
JulesTranslator.WindowHooks = JulesTranslator.WindowHooks || {};

(function($) { // $ refers to JulesTranslator
    'use strict';

    // This module will be populated by JulesTranslator.js if text hooking is enabled.
    // $.WindowHooks will be assigned the public interface of this module.

    const WindowHooks = {
        initialize: function() {
            if (!$.Parameters || !$.Parameters['Enable Text Hooking'] || $.Parameters['Enable Text Hooking'] !== 'true') {
                $.log(2, "WindowHooks: Text Hooking is disabled by parameters. Skipping hooks.");
                return;
            }
            $.log(2, "WindowHooks: Initializing text display hooks...");
            this.aliasWindowMessageMethods();
            // Placeholder for other window hooks:
            // this.aliasWindowChoiceListMethods();
            // this.aliasWindowHelpMethods();
            // ... etc.
        },

        aliasWindowMessageMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_Message methods...");

            // Alias for startMessage to see when a new message begins
            const _Window_Message_startMessage = Window_Message.prototype.startMessage;
            Window_Message.prototype.startMessage = function() {
                $.log(3, "Window_Message.startMessage original texts:", $gameMessage.allText());
                _Window_Message_startMessage.call(this);
            };
            $.log(3, "WindowHooks: Aliased Window_Message.startMessage");

            // Alias for drawTextEx (commonly used for rendering text with escape codes)
            // Note: In some MZ versions or custom systems, text processing might be centralized
            // in methods like processAllText or convertEscapeCharacters before drawing.
            // drawTextEx is a good starting point for MV and many MZ setups.
            const _Window_Message_drawTextEx = Window_Message.prototype.drawTextEx;
            Window_Message.prototype.drawTextEx = function(text, x, y, ...args) { // Use ...args for MZ compatibility
                let originalText = text;
                // In MV, drawTextEx returns the width of the drawn text. In MZ, it might return void or width.
                // The original function in MV is function(text, x, y), returns textWidth.
                // The original function in MZ is function(text, x, y, width, height), returns textWidth.
                // We need to be careful with the return value and arguments.

                // For RPG Maker MV, the signature is typically (text, x, y)
                // For RPG Maker MZ, it's (text, x, y, width, height) though width/height aren't always used by core.
                // The `...args` will capture any additional arguments for MZ.

                let translatedText = MyTranslator.translate(originalText, {
                    context: 'Window_Message.drawTextEx',
                    fullMessage: $gameMessage.allText() // Provide full message context if available
                });

                $.log(3, `Window_Message.drawTextEx: Original: "${originalText}", Translated: "${translatedText}"`);

                // Call original method, ensuring correct arguments and return value
                // For simplicity, assuming the core text processing logic is what we want to translate.
                // More complex scenarios might involve hooking convertEscapeCharacters or similar.
                if (Utils.RPGMAKER_NAME === 'MZ') { // Check if MZ (Window_Base in MZ has more args for drawTextEx)
                     // MZ's Window_Message.prototype.drawTextEx ultimately calls this.drawTextEx (from Window_Base)
                     // which has the signature (text, x, y, width)
                     // However, Window_Message itself calls it as this.contents.drawText(text, x, y, width, this.fittingHeight(1), align)
                     // The actual Window_Message.drawTextEx in core doesn't directly take width/height.
                     // It's safer to stick to the known signature that Window_Message itself uses internally for its processing loop.
                     // The most commonly overridden part for text display in Window_Message is often related to
                     // how it processes and adds text to its internal buffer, or how convertEscapeCharacters works.
                     // Let's assume `text` is the main content to translate before it gets drawn.
                    return _Window_Message_drawTextEx.call(this, translatedText, x, y, ...args);
                } else { // MV
                    return _Window_Message_drawTextEx.call(this, translatedText, x, y);
                }
            };
            $.log(3, "WindowHooks: Aliased Window_Message.drawTextEx");

            // It might also be beneficial to hook methods that add text to the message, like:
            // Window_Message.prototype.addText (if exists and is suitable)
            // Window_Message.prototype.processNewLine
            // Window_Message.prototype.processNewPage
            // Window_Message.prototype.convertEscapeCharacters - this is a key one!

            const _Window_Message_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
            Window_Message.prototype.convertEscapeCharacters = function(text) {
                // This function is called to process things like \N[1], \V[1] etc.
                // It's a good candidate for translation IF we want to translate text *before* escape codes are processed,
                // or if we want to handle escape codes very carefully during translation.
                // However, drawTextEx often receives text that has ALREADY had some escape codes processed
                // (like \N[1] converted to actor's name).
                // For now, we'll translate in drawTextEx. If issues arise with escape codes,
                // this is a place to investigate further.
                //
                // Example: If we translate here, we need to be careful.
                // let translatedText = MyTranslator.translate(text, { context: 'Window_Message.convertEscapeCharacters' });
                // return _Window_Message_convertEscapeCharacters.call(this, translatedText);
                //
                // For the current strategy (translating in drawTextEx), we just call the original.
                return _Window_Message_convertEscapeCharacters.call(this, text);
            };
            $.log(3, "WindowHooks: Aliased Window_Message.convertEscapeCharacters (passthrough for now)");


            // If $gameMessage.add(text) is the primary way text gets to Window_Message,
            // hooking it on Game_Message might be more central for some texts.
            const _Game_Message_add = Game_Message.prototype.add;
            Game_Message.prototype.add = function(text) {
                // This captures text as it's added by event commands like "Show Text"
                let translatedText = MyTranslator.translate(text, { context: 'Game_Message.add' });
                $.log(3, `Game_Message.add: Original: "${text}", Translated: "${translatedText}"`);
                _Game_Message_add.call(this, translatedText);
            };
            $.log(3, "WindowHooks: Aliased Game_Message.add");

        }
    };

    $.WindowHooks = WindowHooks; // Assign the implemented object to the namespace

})(JulesTranslator);
