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
            this.aliasWindowChoiceListMethods();
            this.aliasWindowHelpMethods();
            this.aliasWindowScrollTextMethods();
            this.aliasCommonCommandWindowMethods();
            this.aliasWindowNameInputMethods();
            this.aliasWindowBattleLogMethods(); // Call for battle log window hooks
            // Placeholder for other window hooks:
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

            // Alias for drawTextEx
            // Text passed to this function from Window_Message's main loop
            // should already have been translated by the Game_Message.add hook.
            // This hook is now primarily for logging or handling texts that might
            // be drawn by drawTextEx outside the normal $gameMessage flow (if any).
            const _Window_Message_drawTextEx = Window_Message.prototype.drawTextEx;
            Window_Message.prototype.drawTextEx = function(text, x, y, ...args) {
                // The text here *should* already be translated if it came from $gameMessage.add
                $.log(3, `Window_Message.drawTextEx received: "${text}" (should be translated if from $gameMessage)`);

                // We will NOT call MyTranslator.translate here again for $gameMessage text to avoid double processing.
                // The PROCESSED_MARKER logic in MyTranslator.translate() would prevent re-translation
                // if we did call it, but it's cleaner to avoid the call if we know the upstream hook handles it.

                if (Utils.RPGMAKER_NAME === 'MZ') {
                    return _Window_Message_drawTextEx.call(this, text, x, y, ...args);
                } else { // MV
                    return _Window_Message_drawTextEx.call(this, text, x, y);
                }
            };
            $.log(3, "WindowHooks: Aliased Window_Message.drawTextEx (now mostly for logging/passthrough for $gameMessage text)");

            // Alias for convertEscapeCharacters
            // This is crucial because it processes \N[1], \V[1] etc.
            // If text is translated *before* this, the escape codes must be preserved.
            // If text is translated *after* this (e.g. in drawTextEx), then names/variables are already part of the string.
            // Our current strategy: translate in Game_Message.add. So, this function will receive
            // already translated text. Escape codes within the *original* untranslated string
            // should still function correctly if the translation didn't garble them.
            const _Window_Message_convertEscapeCharacters = Window_Message.prototype.convertEscapeCharacters;
            Window_Message.prototype.convertEscapeCharacters = function(text) {
                // Text here is potentially already translated by Game_Message.add hook.
                // The original convertEscapeCharacters should operate on this (possibly translated) text.
                // Example: If original was "Hero \N[1] finds item." and translated to "Héroe \N[1] encuentra objeto.",
                // this function should still correctly replace \N[1] with the actor's name.
                $.log(3, `Window_Message.convertEscapeCharacters processing: "${text}"`);
                return _Window_Message_convertEscapeCharacters.call(this, text);
            };
            $.log(3, "WindowHooks: Aliased Window_Message.convertEscapeCharacters (passthrough)");

            // Primary hook for dialogue text from event commands ("Show Text", "Show Choices" etc.)
            const _Game_Message_add = Game_Message.prototype.add;
            Game_Message.prototype.add = function(text) {
                // This is our main translation point for new lines added to the message queue.
                let translatedText = MyTranslator.translate(text, {
                    context: 'Game_Message.add',
                    originalFull: text // Provide context if needed later
                });
                $.log(3, `Game_Message.add: Original: "${text}", Processed by MyTranslator: "${translatedText}"`);
                _Game_Message_add.call(this, translatedText); // Add the translated (or placeholder) text to game message
            };
            $.log(3, "WindowHooks: Aliased Game_Message.add (Primary translation point for dialogue)");

            // Further hooks will be added here
        },

        aliasWindowChoiceListMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_ChoiceList methods...");

            // Log choices when they are set by the game message system
            const _Game_Message_setChoices = Game_Message.prototype.setChoices;
            Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
                $.log(3, `Game_Message.setChoices: Original choices:`, JSON.parse(JSON.stringify(choices))); // Deep copy for logging
                // We don't translate here because $gameMessage stores original text.
                // Translation should happen at the display stage in Window_ChoiceList.
                _Game_Message_setChoices.call(this, choices, defaultType, cancelType);
            };
            $.log(3, "WindowHooks: Aliased Game_Message.setChoices (for logging)");

            // Translate choice text when it's drawn
            const _Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
            Window_ChoiceList.prototype.drawItem = function(index) {
                const originalChoiceText = this.commandName(index); // Gets the text of the choice
                let translatedChoiceText = MyTranslator.translate(originalChoiceText, {
                    context: 'Window_ChoiceList.drawItem',
                    choiceIndex: index,
                    allChoices: $gameMessage.choices()
                });

                $.log(3, `Window_ChoiceList.drawItem [${index}]: Original: "${originalChoiceText}", Translated: "${translatedChoiceText}"`);

                // Temporarily modify the choice text for this drawing operation.
                // This is a bit tricky as drawItem itself relies on commandName, which relies on $gameMessage.choices().
                // A cleaner way might be to hook a method that prepares the text for commandName,
                // or to have commandName itself call translate.
                // For now, let's try a temporary override if possible, or modify a temporary list.
                //
                // A common pattern for drawItem is:
                // var rect = this.itemRectForText(index);
                // this.drawTextEx(this.commandName(index), rect.x, rect.y);
                //
                // So, if we can't easily change what commandName(index) returns *just for this call*,
                // we might need to alias a lower-level drawing function or ensure commandName() itself is hooked.
                //
                // Let's assume commandName(index) is what drawItem uses.
                // We need to make `this.commandName(index)` return the translated text for the duration of this drawItem call.
                // This is difficult without modifying the Window_ChoiceList's internal state or how it fetches command names.

                // Alternative: Many command windows (Window_Command subclasses) use `addCommand` to build their list.
                // Window_ChoiceList has a `makeCommandList` which populates its internal list.
                // Let's try hooking makeCommandList instead, as it's more standard for command-based windows.

                // Reverting drawItem hook for now, will hook makeCommandList.
                // _Window_ChoiceList_drawItem.call(this, index); // Call original with potentially untranslated text if we can't modify it.
                // This demonstrates the challenge. Let's pivot to makeCommandList.
                _Window_ChoiceList_drawItem.call(this, index); // Call original, translation will be handled in makeCommandList
            };
            // $.log(3, "WindowHooks: Aliased Window_ChoiceList.drawItem (initial attempt, may revise)");


            const _Window_ChoiceList_makeCommandList = Window_ChoiceList.prototype.makeCommandList;
            Window_ChoiceList.prototype.makeCommandList = function() {
                _Window_ChoiceList_makeCommandList.call(this); // Call original to populate commands
                // After original makeCommandList, this._list should be populated if it's a Window_Command subclass.
                // Window_ChoiceList is a bit special. It gets choices from $gameMessage.choices().
                // It then uses `addCommand(name, symbol, enabled, ext)` to add them.
                // So, we should alias `addCommand` for Window_ChoiceList.
            };
            // This shows makeCommandList itself isn't the direct place for Window_ChoiceList, but addCommand is.

            // Let's alias addCommand for Window_ChoiceList.
            // Note: Window_ChoiceList.prototype.addCommand is inherited from Window_Command.
            // We need to be careful if we want to *only* affect Window_ChoiceList.
            // A common way is to check `this instanceof Window_ChoiceList` within the Window_Command alias,
            // or specifically alias Window_ChoiceList.prototype.addCommand if it has its own or if we define it.
            // For now, let's assume we are adding it to Window_ChoiceList specifically or it's safe to modify
            // the inherited Window_Command.prototype.addCommand with a check.

            // It's cleaner to target the point where Window_ChoiceList *uses* the choice strings
            // when building its display list. This is usually within its own makeCommandList or similar setup method.

            // Window_ChoiceList.prototype.makeCommandList does this:
            // var choices = $gameMessage.choices();
            // choices.forEach(function(choice, index) {
            //     this.addCommand(choice, 'choice', true, index);
            // }, this);
            // So, the `choice` string is passed to `addCommand`.
            // Let's alias `Window_Command.prototype.addCommand` and check the context.

            // This is becoming complex. Let's simplify the `drawItem` approach by directly drawing translated text.
            // We will re-alias drawItem and manually call drawing functions with translated text.
            // This avoids messing with internal command lists just for display.

            // Re-aliasing drawItem with direct drawing:
            Window_ChoiceList.prototype.drawItem = function(index) {
                const originalChoiceText = $gameMessage.choices()[index]; // Get text directly from source
                let translatedChoiceText = MyTranslator.translate(originalChoiceText, {
                    context: 'Window_ChoiceList.drawItem',
                    choiceIndex: index,
                    allChoices: $gameMessage.choices()
                });

                $.log(3, `Window_ChoiceList.drawItem [${index}]: Original: "${originalChoiceText}", Drawing: "${translatedChoiceText}"`);

                const rect = this.itemRectForText(index);
                this.resetTextColor(); // Ensure default text color
                this.changePaintOpacity(this.isCommandEnabled(index));

                // Use drawTextEx to handle potential escape characters in translated text.
                // Window_Base.prototype.drawTextEx changed signature from MV (text, x, y) to MZ (text, x, y, width)
                if (Utils.RPGMAKER_NAME === 'MZ') {
                    // MZ's Window_Command (and thus Window_ChoiceList) inherits drawTextEx from Window_Base
                    this.drawTextEx(translatedChoiceText, rect.x, rect.y, rect.width);
                } else { // MV
                    // MV's Window_Command also has drawTextEx, typically calling this.contents.drawText
                    // The common signature for Window_Command.prototype.drawTextEx in MV is (text, x, y)
                    this.drawTextEx(translatedChoiceText, rect.x, rect.y);
                }
            };
            $.log(3, "WindowHooks: Re-aliased Window_ChoiceList.drawItem with direct translated drawing (MZ/MV awareness for drawTextEx).");

        },

        aliasWindowHelpMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_Help methods...");

            const _Window_Help_setText = Window_Help.prototype.setText;
            Window_Help.prototype.setText = function(text) {
                let originalText = text;
                // Help text can sometimes be null or empty, MyTranslator.translate handles empty strings.
                let translatedText = MyTranslator.translate(originalText, {
                    context: 'Window_Help.setText'
                });

                $.log(3, `Window_Help.setText: Original: "${originalText}", Translated: "${translatedText}"`);
                _Window_Help_setText.call(this, translatedText);
            };
            $.log(3, "WindowHooks: Aliased Window_Help.setText");

            // setText is usually the main one. setItem(item) often calls this.setText(item.description).
            // If direct item description setting needs specific handling, setItem could also be hooked,
            // but hooking setText should cover most cases.
            const _Window_Help_setItem = Window_Help.prototype.setItem;
            Window_Help.prototype.setItem = function(item) {
                // We log here to see the item, but rely on setText hook for translation
                $.log(3, `Window_Help.setItem called with item:`, item ? JSON.parse(JSON.stringify(item)) : item);
                _Window_Help_setItem.call(this, item);
            };
            $.log(3, "WindowHooks: Aliased Window_Help.setItem (for logging, translation via setText)");
        },

        aliasWindowScrollTextMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_ScrollText methods...");

            // Game_Message is responsible for holding the scroll text
            // Game_Message.prototype.add is already hooked and translates text.
            // So, when Window_ScrollText pulls from $gameMessage, text should be translated.

            // We can hook Window_ScrollText.prototype.startMessage or refresh to log the content.
            const _Window_ScrollText_startMessage = Window_ScrollText.prototype.startMessage;
            Window_ScrollText.prototype.startMessage = function() {
                // $gameMessage.scrollText() should contain the (already translated) text.
                // In MV, this is often $gameMessage.allText(). In MZ, it might be slightly different
                // or directly use $gameMessage._scrollText.
                const allScrollText = $gameMessage.allText ? $gameMessage.allText() : ($gameMessage._scrollText || "");
                $.log(3, `Window_ScrollText.startMessage: Displaying text from $gameMessage:`, allScrollText);
                _Window_ScrollText_startMessage.call(this);
            };
            $.log(3, "WindowHooks: Aliased Window_ScrollText.startMessage (for logging)");

            // Alternatively, or additionally, refresh might be a good place to log.
            const _Window_ScrollText_refresh = Window_ScrollText.prototype.refresh;
            Window_ScrollText.prototype.refresh = function() {
                const allScrollText = $gameMessage.allText ? $gameMessage.allText() : ($gameMessage._scrollText || "");
                $.log(3, `Window_ScrollText.refresh: Text content from $gameMessage:`, allScrollText);
                // No translation call here, assuming Game_Message.add handled it.
                _Window_ScrollText_refresh.call(this);
            };
            $.log(3, "WindowHooks: Aliased Window_ScrollText.refresh (for logging)");
        },

        aliasCommonCommandWindowMethods: function() {
            $.log(3, "WindowHooks: Aliasing common command window methods (Window_Command)...");

            // Most command windows (Title, Menu, Shop, GameEnd, etc.) inherit from Window_Command
            // and use addCommand to populate their list. By hooking Window_Command.prototype.addCommand,
            // we can translate command names for many windows at once.
            const _Window_Command_addCommand = Window_Command.prototype.addCommand;
            Window_Command.prototype.addCommand = function(name, symbol, enabled, ext) {
                let originalName = name;
                let translatedName = MyTranslator.translate(originalName, {
                    context: `Window_Command.addCommand`,
                    symbol: symbol,
                    windowClass: this.constructor.name // Get the specific window class name
                });

                // It's important to log which window is adding the command for context.
                $.log(3, `${this.constructor.name}.addCommand: Original: "${originalName}", Symbol: "${symbol}", Translated: "${translatedName}"`);
                _Window_Command_addCommand.call(this, translatedName, symbol, enabled, ext);
            };
            $.log(3, "WindowHooks: Aliased Window_Command.prototype.addCommand");

            // Specific command windows like Window_TitleCommand, Window_MenuCommand, etc.
            // usually just call this.addCommand(...) in their makeCommandList.
            // So, hooking Window_Command.addCommand should cover them.

            // Example: Logging makeCommandList for Window_TitleCommand to see it in action.
            if (typeof Window_TitleCommand !== 'undefined') {
                const _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
                Window_TitleCommand.prototype.makeCommandList = function() {
                    $.log(3, `Window_TitleCommand.makeCommandList invoking original...`);
                    _Window_TitleCommand_makeCommandList.call(this);
                    // Commands are already translated by the hooked addCommand by this point.
                };
                $.log(3, "WindowHooks: Aliased Window_TitleCommand.makeCommandList (for logging flow)");
            }

            if (typeof Window_MenuCommand !== 'undefined') {
                const _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
                Window_MenuCommand.prototype.makeCommandList = function() {
                    $.log(3, `Window_MenuCommand.makeCommandList invoking original...`);
                    _Window_MenuCommand_makeCommandList.call(this);
                };
                $.log(3, "WindowHooks: Aliased Window_MenuCommand.makeCommandList (for logging flow)");
            }

            // This approach should also cover Window_ShopCommand, Window_GameEnd, Window_PartyCommand etc.
            // as they typically follow the same pattern.
        },

        aliasWindowNameInputMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_NameInput and Window_NameEdit methods...");

            // Window_NameEdit is the window where the actual character input happens.
            // Its `setup` method initializes the name.
            if (typeof Window_NameEdit !== 'undefined') {
                const _Window_NameEdit_setup = Window_NameEdit.prototype.setup;
                Window_NameEdit.prototype.setup = function(actor, maxLength) {
                    // The original setup copies actor.name() to this._name and this._defaultName
                    // We want to translate actor.name() before it's used by setup,
                    // or translate this._defaultName after setup.
                    // Translating actor.name() directly here could have side effects if other parts of the
                    // game expect actor.name() to be the original.
                    // Let's translate the defaultName *after* the original setup.

                    _Window_NameEdit_setup.call(this, actor, maxLength); // Calls original, which sets this._name and this._defaultName

                    let originalDefaultName = this._defaultName;
                    let translatedDefaultName = MyTranslator.translate(originalDefaultName, {
                        context: 'Window_NameEdit.setup_defaultName',
                        actorId: actor.actorId()
                    });

                    if (originalDefaultName !== translatedDefaultName) {
                        this._name = translatedDefaultName; // Set the initial edit field text to translated
                        this._defaultName = translatedDefaultName; // Also update the stored default
                        $.log(3, `Window_NameEdit.setup: Actor ID ${actor.actorId()}, OriginalDefault: "${originalDefaultName}", TranslatedDefault: "${translatedDefaultName}"`);
                    } else {
                        $.log(3, `Window_NameEdit.setup: Actor ID ${actor.actorId()}, DefaultName: "${originalDefaultName}" (no change or not found)`);
                    }
                };
                $.log(3, "WindowHooks: Aliased Window_NameEdit.prototype.setup");
            }

            // Window_NameInput is the window that contains the NameEdit window and also draws the actor's face and name.
            // The name it draws is usually directly from the actor object.
            if (typeof Window_NameInput !== 'undefined') {
                const _Window_NameInput_drawActorName = Window_NameInput.prototype.drawActorName;
                Window_NameInput.prototype.drawActorName = function(actor, x, y, width) {
                    // The name here comes from actor.name()
                    // This should ideally be translated when Actors.json is loaded.
                    // If we translate it here again, we risk double translation if DataManager hook is also active.
                    // However, if DataManager hook for Actors.json is off, this would be a fallback.
                    // Let MyTranslator.translate handle the @@JT@@ marker to prevent double translation.

                    let originalActorName = actor.name();
                    let translatedActorName = MyTranslator.translate(originalActorName, {
                        context: 'Window_NameInput.drawActorName',
                        actorId: actor.actorId()
                    });

                    $.log(3, `Window_NameInput.drawActorName: Actor ID ${actor.actorId()}, Original: "${originalActorName}", Drawing: "${translatedActorName}"`);

                    // We can't just pass translatedActorName to the original if the original function
                    // re-fetches actor.name(). We need to temporarily change actor.name() or draw it ourselves.
                    // The original drawActorName is: this.drawText(actor.name(), x, y, width);
                    // So we can just call this.drawText with the translated name.

                    this.resetTextColor();
                    this.drawText(translatedActorName, x, y, width);
                    // _Window_NameInput_drawActorName.call(this, actor, x, y, width); // This would use original actor.name()
                };
                $.log(3, "WindowHooks: Aliased Window_NameInput.prototype.drawActorName");
            }

            // The character table in Window_NameInput (e.g., LATIN1, LATIN2, KANA)
            // is usually hardcoded in Window_NameInput.prototype.table().
            // Translating these characters (e.g. if you want to replace default Kana with Cyrillic for input)
            // would involve aliasing table() and returning a modified character set. This is more advanced.
            // For now, we focus on the actor's name.
        },

        aliasWindowBattleLogMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_BattleLog methods...");

            if (typeof Window_BattleLog === 'undefined') {
                $.log(2, "WindowHooks: Window_BattleLog not found, skipping hooks for it.");
                return;
            }

            // Hook for simple text additions
            const _Window_BattleLog_addText = Window_BattleLog.prototype.addText;
            Window_BattleLog.prototype.addText = function(text) {
                let originalText = text;
                // Battle log text can be simple ("<Actor> is confused.") or part of a larger formatted message.
                // MyTranslator.translate should handle the @@JT@@ marker if text was pre-formatted and translated.
                let translatedText = MyTranslator.translate(originalText, {
                    context: 'Window_BattleLog.addText'
                });
                $.log(3, `Window_BattleLog.addText: Original: "${originalText}", Translated: "${translatedText}"`);
                _Window_BattleLog_addText.call(this, translatedText);
            };
            $.log(3, "WindowHooks: Aliased Window_BattleLog.prototype.addText");

            // Hook for displaying actions (e.g., "Actor uses Skill", "Actor attacks")
            // This is complex because these messages are often formatted using item/skill names.
            // The names themselves should ideally be translated when data files (Actors.json, Skills.json) are loaded.
            // The format strings (e.g., "%1 uses %2") come from TextManager.js (e.g., TextManager.useItem).
            // We should hook TextManager terms for these.
            // Hooking displayAction is more for observing or if a specific game has custom messages here.

            const _Window_BattleLog_displayAction = Window_BattleLog.prototype.displayAction;
            Window_BattleLog.prototype.displayAction = function(subject, item) {
                $.log(3, `Window_BattleLog.displayAction: Subject: ${subject.name()}, Item: ${item.name}`);
                // The actual message like "%1 attacks" or "%1 uses %2" is usually generated using TextManager.
                // Example: TextManager.useItem (for skills/items) or TextManager.actorAttack (for basic attacks).
                // These TextManager properties pull from $dataSystem.terms.messages.
                // So, $dataSystem.terms.messages should be translated by DataManagerHooks.
                // This hook on displayAction is thus more for logging or very specific overrides.
                // For now, we'll assume the components (subject name, item name, and the format string from TextManager)
                // are handled by other translation points (DataManager hooks for names/terms).
                _Window_BattleLog_displayAction.call(this, subject, item);
            };
            $.log(3, "WindowHooks: Aliased Window_BattleLog.prototype.displayAction (for logging, assumes terms/names are translated elsewhere)");

            // Hook for critical hit messages
            // E.g., BattleManager.displayCritical(target, item) which often pushes 'displayCritical' to log.
            // Window_BattleLog.prototype.displayCritical might then use TextManager.criticalToActor or criticalToEnemy.
            // These are also terms in $dataSystem.terms.messages.
            if (typeof Window_BattleLog.prototype.displayCritical === 'function') {
                const _Window_BattleLog_displayCritical = Window_BattleLog.prototype.displayCritical;
                Window_BattleLog.prototype.displayCritical = function(target) { // Target is usually passed
                    $.log(3, `Window_BattleLog.displayCritical: Target: ${target.name()}`);
                    // The message (e.g., "Critical Hit!") comes from TextManager.criticalToActor / criticalToEnemy
                    // which should be translated via DataManager hook for System.json.
                    _Window_BattleLog_displayCritical.call(this, target);
                };
                $.log(3, "WindowHooks: Aliased Window_BattleLog.prototype.displayCritical (for logging)");
            }

            // Other messages like damage, states, miss, evade also use TextManager properties
            // that point to $dataSystem.terms.messages.
            // Example: Window_BattleLog.prototype.displayHpDamage
            // It uses messages like TextManager.hpDamage, TextManager.actorDamage, etc.
            // So, the primary way to translate battle log messages is to translate $dataSystem.terms.messages
            // via the DataManager hook, and ensure actor/skill/item names are translated.
            // The addText hook here will catch any simple, non-formatted text lines directly added.
        }
    };

    $.WindowHooks = WindowHooks; // Assign the implemented object to the namespace

})(JulesTranslator);
