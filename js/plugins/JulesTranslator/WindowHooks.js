// ===========================================================================
// JulesTranslator_WindowHooks.js
// ===========================================================================

var JulesTranslator = JulesTranslator || {};
JulesTranslator.WindowHooks = JulesTranslator.WindowHooks || {};

(function($) { // $ refers to JulesTranslator
    'use strict';

    const WindowHooks = {
        initialize: function() {
            if (!$.Parameters || $.Parameters['Enable Text Hooking'] !== 'true') {
                $.log(2, "WindowHooks: Text Hooking is disabled by parameters. Skipping hooks.");
                return;
            }
            $.log(2, "WindowHooks: Initializing text display hooks with async TranslationResult handling...");
            this.aliasWindowMessageMethods();
            this.aliasWindowChoiceListMethods(); // Este dependerá de DataManagerHooks para el formato de choices
            this.aliasWindowHelpMethods();
            this.aliasWindowScrollTextMethods();
            this.aliasCommonCommandWindowMethods();
            this.aliasWindowNameInputMethods();
            this.aliasWindowBattleLogMethods();
        },

        aliasWindowMessageMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_Message methods (with TranslationResult)...");

            const _Game_Message_add = Game_Message.prototype.add;
            Game_Message.prototype.add = function(text) {
                if (!MyTranslator.isEnabled || typeof text !== 'string') {
                    _Game_Message_add.call(this, text);
                    return;
                }
                const translationResult = MyTranslator.translate(text, { context: 'Game_Message.add' });
                $.log(3, `Game_Message.add: Original: "${text}", Result Status: ${translationResult.status}, Display: "${translationResult.textToDisplay}"`,
                    (translationResult.translationId ? `ID: ${translationResult.translationId}` : ""));

                // $gameMessage stores the textToDisplay (original if pending, or final translated/manual)
                _Game_Message_add.call(this, translationResult.textToDisplay);
                // The actual registration for UI update will happen in Window_Message.drawTextEx
                // because $gameMessage._texts only stores strings, not the full TranslationResult.
            };

            const _Window_Message_drawTextEx = Window_Message.prototype.drawTextEx;
            Window_Message.prototype.drawTextEx = function(text, x, y, ...args) { // text here is what $gameMessage provided
                let textToDraw = text;

                if (MyTranslator.isEnabled && typeof text === 'string' && text.trim() !== '') {
                    // Re-call translate for the current text being drawn.
                    // This will hit the cache if already processed (even as pending) by Game_Message.add
                    // and will give us the translationId if it's pending.
                    const currentTranslationResult = MyTranslator.translate(text, { context: 'Window_Message.drawTextEx' });
                    textToDraw = currentTranslationResult.textToDisplay; // Show original if pending

                    if (currentTranslationResult.status === 'pending' && currentTranslationResult.translationId) {
                        const translationId = currentTranslationResult.translationId;
                        const originalTextForDisplay = currentTranslationResult.originalText; // Store the true original

                        $.log(3, `Window_Message.drawTextEx: Registering pending ID ${translationId} for text "${originalTextForDisplay}"`);

                        const updateMessageText = (newlyTranslatedText) => {
                            $.log(2, `UpdateMessageText (Window_Message) ID ${translationId}. New: "${newlyTranslatedText}"`);
                            if ($gameMessage && $gameMessage._texts) {
                                // Find the originalTextForDisplay in $gameMessage._texts and replace it.
                                // This assumes originalTextForDisplay is what's currently in $gameMessage._texts for this line.
                                const textIndex = $gameMessage._texts.indexOf(originalTextForDisplay);
                                if (textIndex > -1) {
                                    if ($gameMessage._texts[textIndex] === originalTextForDisplay) { // Ensure it hasn't changed
                                        $gameMessage._texts[textIndex] = newlyTranslatedText;
                                        $.log(2, `Updated $gameMessage._texts[${textIndex}] for ID ${translationId}`);
                                        if (this.isOpen() && !this.isClosing() && !this.isOpening() && this._textState) {
                                            // A simple refresh for now. More granular updates are complex.
                                            // Check if the message window is still processing the text that contained the original.
                                            // This check is a heuristic.
                                            if (this._textState.text && this._textState.text.includes(originalTextForDisplay)) {
                                                 $.log(2, `Window_Message attempting to refresh for ID ${translationId}`);
                                                 this._showFast = true;
                                                 this.startMessage(); // Re-starts the current message page/box
                                            }
                                        }
                                    } else if ($gameMessage._texts[textIndex] !== newlyTranslatedText) {
                                         $.log(1, `Window_Message: Text for ID ${translationId} in $gameMessage changed unexpectedly from "${originalTextForDisplay}" to "${$gameMessage._texts[textIndex]}" before update to "${newlyTranslatedText}".`);
                                    }
                                } else {
                                    $.log(2, `Original text for ID ${translationId} ("${originalTextForDisplay}") not found in $gameMessage for update. May be late or message changed.`);
                                }
                            }
                        };
                        MyTranslator.registerTextElement(translationId, originalTextForDisplay, updateMessageText, this);
                    }
                }

                if (Utils.RPGMAKER_NAME === 'MZ') {
                    return _Window_Message_drawTextEx.call(this, textToDraw, x, y, ...args);
                } else {
                    return _Window_Message_drawTextEx.call(this, textToDraw, x, y);
                }
            };
            // Other Window_Message hooks like convertEscapeCharacters are left as is for now.
        },

        aliasWindowChoiceListMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_ChoiceList methods (expects object in $gameMessage.choices)...");
            // This part heavily relies on DataManagerHooks.translateEventList (command 102 for choices)
            // to populate $gameMessage.choices() with objects:
            // { textForDisplay: "Original Choice Text", translationId: "id_if_pending", originalEventText: "Original from event" }

            const _Window_ChoiceList_drawItem = Window_ChoiceList.prototype.drawItem;
            Window_ChoiceList.prototype.drawItem = function(index) {
                const choiceEntry = $gameMessage.choices()[index];
                let textToDraw = "";
                let translationIdForChoice = null;
                let originalTextFromEvent = ""; // The very original text from the event command

                if (typeof choiceEntry === 'object' && choiceEntry !== null && typeof choiceEntry.textForDisplay !== 'undefined') {
                    textToDraw = choiceEntry.textForDisplay; // This is the original text if it was pending
                    translationIdForChoice = choiceEntry.translationId; // null if not pending
                    originalTextFromEvent = choiceEntry.originalEventText;
                     if(translationIdForChoice) $.log(3, `Window_ChoiceList.drawItem [${index}]: Handling choice object, ID: ${translationIdForChoice}, Original: "${originalTextFromEvent}", Display: "${textToDraw}"`);
                } else if (typeof choiceEntry === 'string') { // Fallback for old format or direct string
                    const result = MyTranslator.translate(choiceEntry, { context: 'Window_ChoiceList.drawItem_strFallback' });
                    textToDraw = result.textToDisplay;
                    translationIdForChoice = result.translationId;
                    originalTextFromEvent = result.originalText; // which is choiceEntry
                    if(translationIdForChoice) $.log(3, `Window_ChoiceList.drawItem [${index}]: Fallback string choice: "${choiceEntry}", ID: ${translationIdForChoice}, Display: "${textToDraw}"`);
                } else {
                    $.log(1, `Window_ChoiceList.drawItem [${index}]: Unexpected choice data format:`, choiceEntry);
                    textToDraw = (typeof choiceEntry === 'string') ? choiceEntry : ""; // Default to string if possible or empty
                }

                if (MyTranslator.isEnabled && translationIdForChoice) {
                    const updateChoiceText = (newlyTranslatedText) => {
                        $.log(2, `UpdateChoiceText (Window_ChoiceList) index ${index}, ID ${translationIdForChoice}. New: "${newlyTranslatedText}"`);
                        if ($gameMessage && $gameMessage.choices()) {
                            const currentChoiceInGameMessage = $gameMessage.choices()[index];
                            if (typeof currentChoiceInGameMessage === 'object' && currentChoiceInGameMessage.translationId === translationIdForChoice) {
                                if (currentChoiceInGameMessage.textForDisplay !== newlyTranslatedText) {
                                    currentChoiceInGameMessage.textForDisplay = newlyTranslatedText;
                                    currentChoiceInGameMessage.translationId = null; // Mark as no longer pending
                                    if (this.active && this.isOpen()) this.refresh();
                                }
                            } else if (typeof currentChoiceInGameMessage === 'string' && currentChoiceInGameMessage === originalTextFromEvent && MyTranslator.translate(currentChoiceInGameMessage).translationId === translationIdForChoice ) {
                                 // Fallback case if $gameMessage.choices still has the original string that resulted in this pending ID
                                $gameMessage.choices()[index] = newlyTranslatedText;
                                 if (this.active && this.isOpen()) this.refresh();
                            } else {
                                $.log(1, `Window_ChoiceList: Choice for ID ${translationIdForChoice} at index ${index} seems to have changed or is no longer pending as expected.`);
                            }
                        }
                    };
                    MyTranslator.registerTextElement(translationIdForChoice, originalTextFromEvent, updateChoiceText, {window: this, choiceIndex: index});
                }

                const rect = this.itemRectForText(index);
                this.resetTextColor();
                this.changePaintOpacity(this.isCommandEnabled(index));
                if (Utils.RPGMAKER_NAME === 'MZ') {
                    this.drawTextEx(textToDraw, rect.x, rect.y, rect.width);
                } else {
                    this.drawTextEx(textToDraw, rect.x, rect.y);
                }
            };
        },

        aliasWindowHelpMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_Help methods (with TranslationResult)...");
            const _Window_Help_setText = Window_Help.prototype.setText;
            Window_Help.prototype.setText = function(text) {
                let textToSet = text;

                if (MyTranslator.isEnabled && typeof text === 'string' && text.trim() !== '') {
                    const translationResult = MyTranslator.translate(text, { context: 'Window_Help.setText' });
                    textToSet = translationResult.textToDisplay; // Show original if pending

                    if (translationResult.status === 'pending' && translationResult.translationId) {
                        const translationId = translationResult.translationId;
                        const originalTextForDisplay = translationResult.originalText;
                        $.log(3, `Window_Help.setText: Registering pending ID ${translationId} for text "${originalTextForDisplay}"`);

                        const updateHelpText = (newlyTranslatedText) => {
                            $.log(2, `UpdateHelpText (Window_Help) ID ${translationId}. New: "${newlyTranslatedText}"`);
                            if (this && this._text !== newlyTranslatedText) {
                                _Window_Help_setText.call(this, newlyTranslatedText);
                            }
                        };
                        MyTranslator.registerTextElement(translationId, originalTextForDisplay, updateHelpText, this);
                    }
                } else {
                    textToSet = text;
                }
                _Window_Help_setText.call(this, textToSet);
            };
            // setItem hook can remain as is, as it typically calls this.setText
        },

        aliasWindowScrollTextMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_ScrollText methods (with TranslationResult)...");
            // Game_Message.add already handles the initial translation call.
            // Window_ScrollText.startMessage uses $gameMessage.allText().
            // We need to ensure that if any lines in $gameMessage were pending,
            // they get updated. The refresh logic for Window_Message might be adaptable.

            // For now, this remains largely for logging. A full async update for scroll text
            // would require similar logic to Window_Message if individual lines need to update
            // after the scroll has started, which is very complex.
            // A simpler approach is that the text is finalized before scrolling starts.
            // This means if MyTranslator.translate was async for a line, $gameMessage.allText()
            // would contain the original for that line.
             const _Window_ScrollText_startMessage = Window_ScrollText.prototype.startMessage;
             Window_ScrollText.prototype.startMessage = function() {
                 // Text in $gameMessage._scrollText should be what Game_Message.add put there.
                 // If Game_Message.add put original text for pending items, that's what will scroll.
                 // For a fully dynamic update, each line drawn by Window_ScrollText would need registration.
                 $.log(3, `Window_ScrollText.startMessage: Text from $gameMessage:`, $gameMessage.allText());
                 _Window_ScrollText_startMessage.call(this);
             };
        },

        aliasCommonCommandWindowMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_Command.addCommand (with TranslationResult)...");
            const _Window_Command_addCommand = Window_Command.prototype.addCommand;
            Window_Command.prototype.addCommand = function(name, symbol, enabled, ext) {
                let nameForOriginalCall = name;

                if (MyTranslator.isEnabled && typeof name === 'string' && name.trim() !== '') {
                    const translationResult = MyTranslator.translate(name, {
                        context: `Window_Command.addCommand`, symbol: symbol, windowClass: this.constructor.name
                    });
                    nameForOriginalCall = translationResult.textToDisplay; // Use original if pending

                    if (translationResult.status === 'pending' && translationResult.translationId) {
                        const translationId = translationResult.translationId;
                        const originalName = translationResult.originalText;
                        $.log(3, `${this.constructor.name}.addCommand: Registering pending ID ${translationId} for command "${originalName}" (Symbol: ${symbol})`);

                        const updateCommandName = (newlyTranslatedText) => {
                            $.log(2, `UpdateCommandName (${this.constructor.name}, Symbol: ${symbol}) ID ${translationId}. New: "${newlyTranslatedText}"`);
                            const command = this._list.find(cmd => cmd.symbol === symbol && (typeof ext === 'undefined' || cmd.ext === ext) && cmd.name === originalName);
                            if (command) {
                                if (command.name !== newlyTranslatedText) {
                                    command.name = newlyTranslatedText;
                                    if (this.active && this.isOpen() && typeof this.refresh === 'function') {
                                        this.refresh();
                                    }
                                }
                            } else {
                                 $.log(1, `Command with symbol ${symbol} (original name "${originalName}") not found in ${this.constructor.name} for update.`);
                            }
                        };
                        MyTranslator.registerTextElement(translationId, originalName, updateCommandName, {window: this, symbol: symbol, ext: ext});
                    }
                }
                _Window_Command_addCommand.call(this, nameForOriginalCall, symbol, enabled, ext);
            };
        },

        aliasWindowNameInputMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_NameInput/Edit (with TranslationResult)...");
            if (typeof Window_NameEdit !== 'undefined') {
                const _Window_NameEdit_setup = Window_NameEdit.prototype.setup;
                Window_NameEdit.prototype.setup = function(actor, maxLength) {
                    _Window_NameEdit_setup.call(this, actor, maxLength); // Original setup uses actor.name() for this._defaultName

                    if (MyTranslator.isEnabled && typeof this._defaultName === 'string' && this._defaultName.trim() !== '') {
                        const translationResult = MyTranslator.translate(this._defaultName, { context: 'Window_NameEdit.setup_defaultName', actorId: actor.actorId() });

                        this._name = translationResult.textToDisplay;
                        this._defaultName = translationResult.textToDisplay;

                        if (translationResult.status === 'pending' && translationResult.translationId){
                            const translationId = translationResult.translationId;
                            const originalDefaultName = translationResult.originalText;
                            $.log(2, `Window_NameEdit default name for actor ${actor.actorId()} is pending (ID: ${translationId}). Displaying original: "${originalDefaultName}"`);

                            const updateNameEditField = (newlyTranslatedName) => {
                                $.log(2, `UpdateNameEditField (Actor: ${actor.actorId()}) ID ${translationId}. New: "${newlyTranslatedName}"`);
                                // Only update if this window is still active and for the same actor and the name hasn't been changed by user
                                if (this._actor === actor && this._name === originalDefaultName) {
                                    this._name = newlyTranslatedName;
                                    this._defaultName = newlyTranslatedName; // Keep default in sync
                                    this.refresh(); // Redraw the edit field
                                } else {
                                    $.log(2, `Window_NameEdit update skipped for ID ${translationId} - actor/name changed or window inactive.`);
                                }
                            };
                            MyTranslator.registerTextElement(translationId, originalDefaultName, updateNameEditField, { window: this, actorId: actor.actorId() });

                        } else if (this._defaultName !== translationResult.originalText) { // Log if translated
                             $.log(3, `Window_NameEdit.setup: Actor ID ${actor.actorId()}, DefaultName translated to: "${this._defaultName}" (Original: "${translationResult.originalText}")`);
                        }
                    }
                };
            }

            if (typeof Window_NameInput !== 'undefined') {
                const _Window_NameInput_drawActorName = Window_NameInput.prototype.drawActorName;
                Window_NameInput.prototype.drawActorName = function(actor, x, y, width) {
                    let nameToDraw = actor.name();
                    let originalName = actor.name(); // For registration

                    if (MyTranslator.isEnabled) {
                        const translationResult = MyTranslator.translate(nameToDraw, { context: 'Window_NameInput.drawActorName', actorId: actor.actorId() });
                        nameToDraw = translationResult.textToDisplay;
                        originalName = translationResult.originalText; // True original for this name

                        if (translationResult.status === 'pending' && translationResult.translationId) {
                             const translationId = translationResult.translationId;
                             $.log(2, `Window_NameInput drawing actor name for ${actor.actorId()} is pending (ID: ${translationId}). Displaying: "${nameToDraw}"`);

                             const updateDrawnActorName = (newlyTranslatedName) => {
                                 $.log(2, `UpdateDrawnActorName (Actor: ${actor.actorId()}) ID ${translationId}. New: "${newlyTranslatedName}"`);
                                 // This is tricky because drawActorName is called in refresh.
                                 // We need to ensure the actor's name itself is updated if it's from $dataActors,
                                 // or this window needs a specific way to store and update this displayed name.
                                 // For now, if the actor's name in $dataActors is updated by DataManagerHooks,
                                 // a subsequent refresh of Window_NameInput would pick it up.
                                 // This direct update is for names not from $dataActors or if DMHooks is off.
                                 // A simple this.refresh() might be needed if this window is still active.
                                 if (this.actor() === actor) { // Check if still same actor
                                     // We can't easily change just one part of the window. Force refresh.
                                     this.refresh();
                                 }
                             };
                             MyTranslator.registerTextElement(translationId, originalName, updateDrawnActorName, {window: this, actorId: actor.actorId()});
                        }
                    }
                    this.resetTextColor();
                    this.drawText(nameToDraw, x, y, width);
                };
            }
        },

        aliasWindowBattleLogMethods: function() {
            $.log(3, "WindowHooks: Aliasing Window_BattleLog.addText (with TranslationResult)...");
            if (typeof Window_BattleLog === 'undefined') return;

            const _Window_BattleLog_addText = Window_BattleLog.prototype.addText;
            Window_BattleLog.prototype.addText = function(text) {
                let textToAdd = text;
                if (MyTranslator.isEnabled && typeof text === 'string' && text.trim() !== '') {
                    const translationResult = MyTranslator.translate(text, { context: 'Window_BattleLog.addText' });
                    textToAdd = translationResult.textToDisplay;

                    if (translationResult.status === 'pending' && translationResult.translationId) {
                        const translationId = translationResult.translationId;
                        const originalText = translationResult.originalText; // This is what's added to _lines
                        $.log(3, `Window_BattleLog.addText: Registering pending ID ${translationId} for text "${originalText}"`);

                        const updateBattleLogLine = (newlyTranslatedText) => {
                            $.log(2, `UpdateBattleLogLine ID ${translationId}. New: "${newlyTranslatedText}"`);
                            const lineIndex = this._lines.indexOf(originalText);
                            if (lineIndex > -1) {
                                // Check if the line is still the original to avoid race conditions or double updates
                                if (this._lines[lineIndex] === originalText) {
                                    this._lines[lineIndex] = newlyTranslatedText;
                                    // Battle log window usually refreshes itself when new lines are added or during wait.
                                    // A forced refresh might be needed if no other refresh is imminent.
                                    if (this._window && this._window.isDrawing()) { // Heuristic: if it's actively drawing
                                        this._window.refresh();
                                    }
                                     $.log(2, `Updated battle log line at index ${lineIndex} for ID ${translationId}`);
                                }
                            } else {
                                 $.log(2, `Battle log line for ID ${translationId} ("${originalText}") not found for update.`);
                            }
                        };
                        MyTranslator.registerTextElement(translationId, originalText, updateBattleLogLine, this);
                    }
                }
                _Window_BattleLog_addText.call(this, textToAdd);
            };
        }
    };

    $.WindowHooks = WindowHooks;
})(JulesTranslator);
