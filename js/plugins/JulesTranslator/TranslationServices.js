// ===========================================================================
// JulesTranslator_TranslationServices.js
// ===========================================================================

var JulesTranslator = JulesTranslator || {};
JulesTranslator.TranslationServices = JulesTranslator.TranslationServices || {};

(function($) { // $ refers to JulesTranslator
    'use strict';

    // This module will define classes for different translation services.
    // Instances will be created and managed by the main MyTranslator object.

    // --- Base Class for Machine Translators (Conceptual) ---
    class BaseMachineTranslator {
        constructor(apiKey) {
            this.apiKey = apiKey;
        }

        // Standard method to be implemented by subclasses
        async translate(text, fromLang, toLang, contextInfo = {}) {
            throw new Error("Translate method not implemented in subclass.");
        }

        // Helper for making HTTP requests (conceptual, using Fetch API)
        async _fetch(url, options = {}, attempt = 1) {
            // Use plugin parameters for retry configuration
            const maxRetries = $.maxRetriesOnError; // Parsed from plugin params
            const initialRetryDelay = $.initialRetryDelayMs; // Parsed from plugin params

            const retryableStatusCodes = [429, 500, 502, 503, 504];
            const permanentErrorStatusCodes = [400, 401, 403]; // Errors that should not be retried

            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    let errorBody = null;
                    let errorContentType = response.headers.get("content-type");
                    try {
                        if (errorContentType && errorContentType.includes("application/json")) {
                            errorBody = await response.json();
                        } else {
                            errorBody = await response.text();
                        }
                    } catch (e) {
                        errorBody = `Failed to parse error body: ${e.message}`;
                    }

                    const logMessage = `API request failed (Attempt ${attempt}/${maxRetries + 1}): ${response.status} ${response.statusText}`;
                    $.log(1, logMessage, errorBody);

                    const error = new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
                    error.status = response.status;
                    error.body = errorBody;
                    error.isPermanent = permanentErrorStatusCodes.includes(response.status);

                    if (!error.isPermanent && retryableStatusCodes.includes(response.status) && attempt <= maxRetries) {
                        const delay = initialRetryDelay * Math.pow(2, attempt - 1); // Exponential backoff
                        $.log(2, `Retrying API call to ${url} in ${delay}ms... (Attempt ${attempt + 1})`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return this._fetch(url, options, attempt + 1); // Recursive call for retry
                    }
                    throw error; // Non-retryable error or max retries exceeded
                }

                const successContentType = response.headers.get("content-type");
                if (successContentType && successContentType.includes("application/json")) {
                    return await response.json();
                } else {
                    $.log(1, `API success response was not JSON: ${successContentType}. Returning as text for ${url}`);
                    return await response.text();
                }
            } catch (error) { // Catches network errors or errors thrown by non-ok responses after retries
                if (!error.status && attempt <= maxRetries) { // Likely a network error if no status, and retries left
                    const delay = initialRetryDelay * Math.pow(2, attempt - 1);
                    $.log(1, `Network error during API call (Attempt ${attempt}/${maxRetries + 1}) for ${url}: ${error.message}. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this._fetch(url, options, attempt + 1);
                }
                // Final failure after retries or non-retryable error (could be network or a thrown HTTP error)
                // Ensure isPermanent is set if not already (for network errors, it's not permanent by default)
                if (typeof error.isPermanent === 'undefined') {
                    error.isPermanent = false; // Network errors are generally considered transient unless all retries fail
                }
                $.log(1, `API request error in _fetch for ${url} (Final after ${attempt-1} retries or permanent error):`, error.message, error.status ? `Status: ${error.status}` : '', error.body || '', `Permanent: ${error.isPermanent}`);
                throw error;
            }
        }
    }

    // --- Google Translate Service (Example Shell) ---
    class GoogleTranslateService extends BaseMachineTranslator {
        constructor(apiKey) {
            super(apiKey);
            this.apiUrl = 'https://translation.googleapis.com/language/translate/v2';
            $.log(3, "GoogleTranslateService instance created.");
        }

        async translate(text, fromLang, toLang, contextInfo = {}) {
            if (!this.apiKey) {
                $.log(1, "Google API Key is missing.");
                return text; // Return original text if no API key
            }
            const params = new URLSearchParams({
                key: this.apiKey,
                q: text,
                source: fromLang,
                target: toLang,
                format: 'text'
            });

            try {
                // This is an async operation.
                $.log(3, `GoogleTranslate: Attempting to translate "${text}" from ${fromLang || 'auto'} to ${toLang}.`);
                const fullUrl = `${this.apiUrl}?${params.toString()}`;

                // Using the _fetch method from BaseMachineTranslator
                const data = await this._fetch(fullUrl); // _fetch handles retries internally

                if (data && data.data && data.data.translations && data.data.translations.length > 0 &&
                    data.data.translations[0].translatedText) {
                    $.log(3, `GoogleTranslate: Successfully translated to "${data.data.translations[0].translatedText}"`);
                    return { translatedText: data.data.translations[0].translatedText, error: null };
                } else {
                    $.log(1, "GoogleTranslate: No translation found in response or malformed response.", data);
                    // Attempt to find a more specific error message from Google's response structure
                    let specificErrorMsg = "Malformed response (no translation text).";
                    if (data && data.error && data.error.message) {
                        specificErrorMsg = data.error.message;
                    }
                    return { translatedText: text, error: specificErrorMsg };
                }
            } catch (error) { // Catch errors from _fetch or other issues
                let specificErrorMessage = error.message || "Unknown API error";
                if (error.body && typeof error.body === 'object' && error.body.error) {
                    if (error.body.error.message) {
                        specificErrorMessage = error.body.error.message;
                    } else if (error.body.error.errors && error.body.error.errors.length > 0 && error.body.error.errors[0].message) {
                        specificErrorMessage = error.body.error.errors[0].message;
                    }
                } else if (error.body && typeof error.body === 'string') {
                    specificErrorMessage = error.body.substring(0, 200);
                }
                $.log(1, `GoogleTranslate: Error during API call (status ${error.status || 'N/A'}):`, specificErrorMessage, error.body || '');
                if (error.isPermanent) {
                    $.log(1, "GoogleTranslate: Encountered a permanent error. Disabling GoogleTranslateService for this session.");
                    this.isDisabledForSession = true;
                }
                return { translatedText: text, error: `Google API call failed: ${specificErrorMessage}` };
            }
        }
    }

    // --- DeepL Service (Example Shell) ---
    class DeepLService extends BaseMachineTranslator {
        constructor(apiKey) {
            super(apiKey);
            // Determine API URL based on free or pro key
            this.isFreeTier = apiKey.endsWith(":fx");
            this.apiUrl = this.isFreeTier ?
                'https://api-free.deepl.com/v2/translate' :
                'https://api.deepl.com/v2/translate';
            this.isDisabledForSession = false;
            $.log(2, `DeepLService instance created. API Tier: ${this.isFreeTier ? 'Free' : 'Pro'}. URL: ${this.apiUrl}`);
        }

        async translate(text, fromLang, toLang, contextInfo = {}) {
            if (this.isDisabledForSession) {
                $.log(1, "DeepLService is disabled for this session due to a previous permanent error.");
                return { translatedText: text, error: "Service disabled for session." };
            }
            if (!this.apiKey) {
                $.log(1, "DeepL API Key is missing for DeepLService.");
                this.isDisabledForSession = true; // Missing key is a permanent issue for this session
                return { translatedText: text, error: "API key missing" };
            }
            if (!text) {
                return { translatedText: "", error: null }; // Nothing to translate
            }

            // DeepL expects uppercase language codes for source_lang if specified.
            // For target_lang, it also expects uppercase.
            // For auto-detection (fromLang is 'auto' or empty), don't send source_lang.
            const bodyParams = {
                auth_key: this.apiKey,
                text: [text], // DeepL API expects text as an array of strings
                target_lang: toLang.toUpperCase()
            };

            if (fromLang && fromLang.toLowerCase() !== 'auto') {
                bodyParams.source_lang = fromLang.toUpperCase();
            }

            // Other useful parameters for DeepL:
            // formality: "default", "more", "less" (depends on language pair)
            // split_sentences: "0" (don't split), "1" (split - default), "nonewlines"
            // preserve_formatting: "0" (default), "1"
            // tag_handling: "xml" or "html" (if you want to send markup)
            // Add more as needed via contextInfo or plugin params

            const options = {
                method: 'POST',
                headers: {
                    // DeepL uses x-www-form-urlencoded for POST, not application/json for the body itself
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(bodyParams).toString()
            };

            $.log(3, `DeepL: Translating "${text}" from ${fromLang || 'auto'} to ${toLang}. Request body: ${options.body}`);

            try {
                const response = await fetch(this.apiUrl, options);

                if (!response.ok) {
                    let errorData = null;
                    let specificErrorMessage = response.statusText;
                    try {
                        errorData = await response.json(); // DeepL often returns JSON error messages
                        if (errorData && errorData.message) {
                            specificErrorMessage = errorData.message;
                        }
                        $.log(1, `DeepL API Error ${response.status}: ${specificErrorMessage}`, errorData || '(No JSON body)');
                    } catch (e) {
                        // If parsing JSON fails, try to get raw text
                        const rawErrorText = await response.text().catch(() => 'Failed to get error text');
                        $.log(1, `DeepL API Error ${response.status}: ${response.statusText}. Response not JSON or unreadable:`, rawErrorText);
                        specificErrorMessage = `${response.statusText} (Raw: ${rawErrorText.substring(0,100)})`;
                    }
                    return { translatedText: text, error: `DeepL API Error ${response.status}: ${specificErrorMessage}` };
                }

                const data = await response.json();

                if (data && data.translations && data.translations.length > 0 && data.translations[0].text) {
                    $.log(3, `DeepL: Successfully translated to "${data.translations[0].text}"`);
                    return { translatedText: data.translations[0].text, error: null };
                } else {
                    $.log(1, "DeepL: No translation found in response or malformed response.", data);
                    return { translatedText: text, error: "Malformed response from DeepL API (no translation text)." };
                }
            } catch (error) {
                $.log(1, "DeepL: Error during API call:", error.message || error, error.body ? `Body: ${JSON.stringify(error.body)}` : '');
                if (error.isPermanent) {
                    $.log(1, "DeepL: Encountered a permanent error. Disabling DeepLService for this session.");
                    this.isDisabledForSession = true;
                }
                return { translatedText: text, error: `DeepL API Error: ${error.message || 'Unknown error'}` };
            }
        }
    }

    // Expose specific services if needed, or let MyTranslator instantiate them.
    // MyTranslator will likely do:
    // if ($.machineService === 'google') MyTranslator.translationServices.google = new GoogleTranslateService($.googleApiKey);
    // etc.
    // $.TranslationServices.GoogleTranslateService = GoogleTranslateService; // Will define GoogleTranslateService below

    class GoogleTranslateService extends BaseMachineTranslator {
        constructor(apiKey) {
            super(apiKey);
            this.apiUrl = 'https://translation.googleapis.com/language/translate/v2';
            this.isDisabledForSession = false;
            $.log(2, `GoogleTranslateService instance created. API URL: ${this.apiUrl}`);
        }

        async translate(text, fromLang, toLang, contextInfo = {}) {
            if (this.isDisabledForSession) {
                $.log(1, "GoogleTranslateService is disabled for this session due to a previous permanent error.");
                return { translatedText: text, error: "Service disabled for session." };
            }
            if (!this.apiKey) {
                $.log(1, "Google API Key is missing for GoogleTranslateService.");
                this.isDisabledForSession = true; // Missing key is a permanent issue
                return { translatedText: text, error: "API key missing" };
            }
            if (!text) {
                return { translatedText: "", error: null };
            }

            const params = new URLSearchParams({
                key: this.apiKey,
                q: text,
                target: toLang.toLowerCase(), // Google generally prefers lowercase target
                format: 'text'
            });

            if (fromLang && fromLang.toLowerCase() !== 'auto') {
                params.append('source', fromLang.toLowerCase()); // Google generally prefers lowercase source
            }

            const fullUrl = `${this.apiUrl}?${params.toString()}`;
            $.log(3, `GoogleTranslate: Translating "${text}" from ${fromLang || 'auto'} to ${toLang}. URL: ${fullUrl}`);

            try {
                // Using the _fetch method from BaseMachineTranslator
                const data = await this._fetch(fullUrl); // Default is GET

                if (data && data.data && data.data.translations && data.data.translations.length > 0 &&
                    data.data.translations[0].translatedText) {
                    $.log(3, `GoogleTranslate: Successfully translated to "${data.data.translations[0].translatedText}"`);
                    return { translatedText: data.data.translations[0].translatedText, error: null };
                } else {
                    $.log(1, "GoogleTranslate: No translation found in response or malformed response.", data);
                    return { translatedText: text, error: "Malformed response from Google API (no translation text)." };
                }
            } catch (error) {
                let specificErrorMessage = error.message || "Unknown API error";
                if (error.body && typeof error.body === 'object' && error.body.error) {
                    // Google's V2 error structure: { error: { errors: [...], code: ..., message: ... } }
                    if (error.body.error.message) {
                        specificErrorMessage = error.body.error.message;
                    } else if (error.body.error.errors && error.body.error.errors.length > 0 && error.body.error.errors[0].message) {
                        specificErrorMessage = error.body.error.errors[0].message;
                    }
                } else if (error.body && typeof error.body === 'string') {
                    // If error body was plain text
                    specificErrorMessage = error.body.substring(0, 200); // Truncate long plain text errors
                }
                $.log(1, `GoogleTranslate: Error during API call (status ${error.status || 'N/A'}):`, specificErrorMessage, error.body || '');
                if (error.isPermanent) {
                    $.log(1, "GoogleTranslate: Encountered a permanent error. Disabling GoogleTranslateService for this session.");
                    this.isDisabledForSession = true;
                }
                return { translatedText: text, error: `Google API call failed: ${specificErrorMessage}` };
            }
        }
    }

    // Make classes available on the JulesTranslator.TranslationServices namespace
    $.TranslationServices.GoogleTranslateService = GoogleTranslateService; // Now defined
    $.TranslationServices.DeepLService = DeepLService;
    $.TranslationServices.BaseMachineTranslator = BaseMachineTranslator; // If useful for extensibility


    // --- Google Translate Free Service (Unofficial) ---
    class GoogleTranslateFreeService extends BaseMachineTranslator {
        constructor() {
            super(null); // No API key needed
            this.apiUrl = 'https://translate.googleapis.com/translate_a/single';
            this.isDisabledForSession = false; // Puede deshabilitarse por errores repetidos
            $.log(2, `GoogleTranslateFreeService instance created. WARNING: This is an unofficial, unstable endpoint.`);
        }

        async translate(text, fromLang, toLang, contextInfo = {}) {
            if (this.isDisabledForSession) {
                $.log(1, "GoogleTranslateFreeService is disabled for this session.");
                return { translatedText: text, error: "Service disabled for session (unofficial)." };
            }
            if (!text) {
                return { translatedText: "", error: null };
            }

            const params = new URLSearchParams({
                client: 'gtx',
                sl: fromLang && fromLang.toLowerCase() !== 'auto' ? fromLang.toLowerCase() : 'auto',
                tl: toLang.toLowerCase(),
                dt: 't',
                q: text
            });

            const fullUrl = `${this.apiUrl}?${params.toString()}`;
            $.log(3, `GoogleTranslateFree: Translating "${text}" from ${params.get('sl')} to ${params.get('tl')}. URL: ${fullUrl}`);

            try {
                const response = await fetch(fullUrl);

                if (!response.ok) {
                    $.log(1, `GoogleTranslateFree: HTTP error! status: ${response.status} ${response.statusText} for URL: ${fullUrl}`);
                    if (response.status === 429 || response.status >= 500) {
                        this.isDisabledForSession = true;
                        $.log(1, `GoogleTranslateFreeService disabled for session due to HTTP ${response.status}.`);
                    }
                    return { translatedText: text, error: `HTTP error ${response.status}` };
                }

                const data = await response.json();
                // Response structure: [[["Hola Mundo","Hello World",null,null,1]],null,"en",null,null,null,null,[]]
                if (data && Array.isArray(data) && data[0] && Array.isArray(data[0]) &&
                    data[0][0] && typeof data[0][0][0] === 'string') {
                    const translated = data[0].map(segment => segment[0]).join('');
                    $.log(3, `GoogleTranslateFree: Successfully translated to "${translated}"`);
                    return { translatedText: translated, error: null };
                } else {
                    $.log(1, "GoogleTranslateFree: Malformed response or no translation found.", data);
                    this.isDisabledForSession = true;
                    return { translatedText: text, error: "Malformed response from GoogleTranslateFree API." };
                }
            } catch (error) {
                $.log(1, "GoogleTranslateFree: Error during API call:", error.message || error);
                this.isDisabledForSession = true;
                return { translatedText: text, error: `GoogleTranslateFree API Error: ${error.message || 'Unknown error'}` };
            }
        }
    }

    // Expose the new service
    $.TranslationServices.GoogleTranslateFreeService = GoogleTranslateFreeService;


    $.log(2, "TranslationServices module loaded."); // Updated log

})(JulesTranslator);
