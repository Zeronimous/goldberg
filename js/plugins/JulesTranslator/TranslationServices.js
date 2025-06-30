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
        async _fetch(url, options = {}, maxRetries = 2, attempt = 1) {
            const retryableStatusCodes = [429, 500, 502, 503, 504]; // Status codes that might warrant a retry
            const baseRetryDelay = 500; // ms

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
                    $.log(1, `API request failed (Attempt ${attempt}/${maxRetries + 1}): ${response.status} ${response.statusText}`, errorBody);

                    const error = new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
                    error.status = response.status;
                    error.body = errorBody;

                    if (retryableStatusCodes.includes(response.status) && attempt <= maxRetries) {
                        const delay = baseRetryDelay * Math.pow(2, attempt - 1); // Exponential backoff
                        $.log(2, `Retrying API call to ${url} in ${delay}ms... (Attempt ${attempt + 1})`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return this._fetch(url, options, maxRetries, attempt + 1); // Recursive call for retry
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
                // If it's a custom error with status, it's already logged from the !response.ok block
                // This catch is more for fetch() itself failing (e.g. network down)
                if (!error.status && attempt <= maxRetries) { // Likely a network error if no status, and retries left
                    const delay = baseRetryDelay * Math.pow(2, attempt - 1);
                    $.log(1, `Network error during API call (Attempt ${attempt}/${maxRetries + 1}) for ${url}: ${error.message}. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return this._fetch(url, options, maxRetries, attempt + 1);
                }
                // Final failure after retries or non-retryable error
                $.log(1, `API request error in _fetch for ${url} (Final after ${attempt-1} retries):`, error.message, error.status ? `Status: ${error.status}` : '', error.body || '');
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
                // This is an async operation. The main `MyTranslator.translate` function
                // needs to be designed to handle this if real-time machine translation is used.
                // For now, the main plugin uses a synchronous placeholder.
                // A full implementation would require a more complex async handling flow.
                $.log(3, `Google: Translating "${text}" from ${fromLang} to ${toLang}`);
                // const data = await this._fetch(`${this.apiUrl}?${params.toString()}`);
                // if (data && data.data && data.data.translations && data.data.translations.length > 0) {
                //     return data.data.translations[0].translatedText;
                // }
                // $.log(1, "Google Translate: No translation found in response or malformed response.", data);
                return `[Google:${toLang}] ${text}`; // Placeholder for async
            } catch (error) {
                $.log(1, "Google Translate API error:", error);
                return text; // Fallback to original text on error
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
            $.log(2, `DeepLService instance created. API Tier: ${this.isFreeTier ? 'Free' : 'Pro'}. URL: ${this.apiUrl}`);
        }

        async translate(text, fromLang, toLang, contextInfo = {}) {
            if (!this.apiKey) {
                $.log(1, "DeepL API Key is missing for DeepLService.");
                return { translatedText: text, error: "API key missing" }; // Return object with error
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
            } catch (error) { // This catch is for network errors or if _fetch itself throws before response.ok check
                $.log(1, "DeepL: Network or other error during API call:", error);
                return { translatedText: text, error: `Network error or invalid response: ${error.message || error}` };
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
            $.log(2, `GoogleTranslateService instance created. API URL: ${this.apiUrl}`);
        }

        async translate(text, fromLang, toLang, contextInfo = {}) {
            if (!this.apiKey) {
                $.log(1, "Google API Key is missing for GoogleTranslateService.");
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
                return { translatedText: text, error: `Google API call failed: ${specificErrorMessage}` };
            }
        }
    }

    // Make classes available on the JulesTranslator.TranslationServices namespace
    $.TranslationServices.GoogleTranslateService = GoogleTranslateService; // Now defined
    $.TranslationServices.DeepLService = DeepLService;
    $.TranslationServices.BaseMachineTranslator = BaseMachineTranslator; // If useful for extensibility

    $.log(2, "TranslationServices module loaded with service shells.");

})(JulesTranslator);
