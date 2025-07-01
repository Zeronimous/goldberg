# JulesTranslator Plugin for RPG Maker MV/MZ

## 1. Introducción

JulesTranslator es un plugin para RPG Maker MV y RPG Maker MZ diseñado para proporcionar capacidades de traducción automática y manual para los textos de tu juego. Permite traducir tanto el texto dinámico que aparece en pantalla (diálogos, menús, etc.) como el contenido de los archivos de datos del juego (nombres de actores, objetos, habilidades, términos del sistema, y más).

## 2. Características Principales

*   **Traducción Automática**: Soporte para servicios de traducción como Google Translate y DeepL (requiere claves API).
*   **Traducciones Manuales**: Carga de traducciones personalizadas desde archivos JSON.
*   **Traducción de Datos del Juego**: Capacidad para traducir contenido de la mayoría de los archivos `*.json` de la carpeta `data` de tu proyecto.
*   **Traducción de Texto en Eventos**: Traduce texto de comandos "Show Text", "Show Choices", "Show Scrolling Text", y otros comandos de evento relevantes.
*   **Hooks de Ventana**: Intercepta y traduce texto en la mayoría de las ventanas estándar del juego.
*   **Manejo Asíncrono**: Las traducciones automáticas se realizan de forma asíncrona para no congelar el juego. El texto original se muestra mientras se espera la traducción.
*   **Caché de Traducción**: Guarda las traducciones para mejorar el rendimiento y reducir las llamadas a la API.
*   **Menú de Selección de Idioma**: Permite al jugador cambiar el idioma de destino en el juego.
*   **Tecla de Acceso Rápido**: Permite activar/desactivar la traducción globalmente.
*   **Compatibilidad MV/MZ**: Diseñado para funcionar en ambas versiones de RPG Maker.

## 3. Instalación

Esta sección asume que tienes acceso al proyecto fuente en el editor de RPG Maker.

1.  **Descargar Archivos**:
    *   Obtén el archivo `JulesTranslator.js`.
    *   Obtén la carpeta completa `JulesTranslator` que contiene los módulos auxiliares (`DataManagerHooks.js`, `Scene_TranslatorOptions.js`, `TranslationServices.js`, `WindowHooks.js`, `Window_TranslatorLanguage.js`) y una subcarpeta `translations` de ejemplo.
2.  **Copiar Archivos al Proyecto**:
    *   Coloca `JulesTranslator.js` directamente en la carpeta `js/plugins/` de tu proyecto RPG Maker.
    *   Coloca la carpeta `JulesTranslator` (con todos sus contenidos) también directamente en `js/plugins/`. La estructura debería ser:
        ```
        <TuProyecto>/js/plugins/JulesTranslator.js
        <TuProyecto>/js/plugins/JulesTranslator/DataManagerHooks.js
        <TuProyecto>/js/plugins/JulesTranslator/Scene_TranslatorOptions.js
        <TuProyecto>/js/plugins/JulesTranslator/TranslationServices.js
        <TuProyecto>/js/plugins/JulesTranslator/WindowHooks.js
        <TuProyecto>/js/plugins/JulesTranslator/Window_TranslatorLanguage.js
        <TuProyecto>/js/plugins/JulesTranslator/translations/ (esta carpeta es para tus archivos de traducción manual)
        ```
3.  **Activar el Plugin**:
    *   Abre tu proyecto en RPG Maker MV o MZ.
    *   Ve al Gestor de Plugins (Plugin Manager).
    *   Añade `JulesTranslator.js` a la lista de plugins. Asegúrate de que esté **después** de cualquier plugin que modifique significativamente las ventanas de texto o el manejo de datos, si es posible, aunque el plugin intenta ser compatible.
4.  **Configurar Parámetros**:
    *   Haz clic en el plugin `JulesTranslator` en la lista para abrir sus parámetros y configúralos según tus necesidades (ver sección "4. Configuración de Parámetros del Plugin").

## 3.1 Instalación en Juegos Compilados (Avanzado)

La siguiente información es para usuarios que desean intentar usar este plugin en un juego de RPG Maker **ya compilado**, es decir, cuando no se tiene acceso al editor del proyecto de RPG Maker.

**ADVERTENCIA IMPORTANTE:**

*   Este proceso es **técnico, arriesgado y no está oficialmente soportado** por el plugin para una configuración sencilla. Puede que no funcione o incluso podría **romper el juego compilado**.
*   **Realiza una copia de seguridad completa** de la carpeta del juego compilado antes de intentar cualquier modificación.
*   **No tendrás acceso a la interfaz gráfica del Gestor de Plugins** para configurar los parámetros del plugin. Deberás hacerlo manualmente editando archivos, lo cual es propenso a errores.
*   La compatibilidad con otros plugins en un juego compilado es difícil de predecir.

**Limitaciones Clave:**

1.  **Configuración de Parámetros**: Los parámetros del plugin (claves API, idioma por defecto, etc.) se configuran normalmente a través del Gestor de Plugins. Sin acceso a él, el plugin usará sus valores por defecto internos A MENOS que modifiques manualmente el archivo `js/plugins.js` del juego o, de forma más invasiva, el propio archivo `JulesTranslator.js`.
2.  **Orden de Carga**: El orden de los plugins es crucial y se define en `js/plugins.js`. Modificar este archivo incorrectamente puede causar problemas graves.

**Pasos (Bajo tu propio riesgo):**

1.  **Localiza la Carpeta del Juego**:
    *   Encuentra la carpeta principal del juego compilado. Para juegos de Windows, es la que contiene `Game.exe`. A menudo, los archivos del juego están dentro de una subcarpeta `www` (especialmente si fue exportado para PC/Mac o si usa NW.js). Necesitarás acceder a las carpetas `js/plugins/`.

2.  **Copia los Archivos del Plugin**:
    *   Navega a la carpeta de plugins del juego (ej. `www/js/plugins/` o `js/plugins/`).
    *   Copia `JulesTranslator.js` en esta carpeta.
    *   Dentro de esta misma carpeta `js/plugins/`, crea una nueva carpeta llamada `JulesTranslator`.
    *   Copia todos los archivos auxiliares del plugin (`DataManagerHooks.js`, `Scene_TranslatorOptions.js`, `TranslationServices.js`, `WindowHooks.js`, `Window_TranslatorLanguage.js`) dentro de esta nueva carpeta `js/plugins/JulesTranslator/`.
    *   Si planeas usar traducciones manuales, crea también la carpeta `translations` dentro de `js/plugins/JulesTranslator/` (ej. `js/plugins/JulesTranslator/translations/`) y coloca tus archivos `.json` allí.

3.  **Editar `js/plugins.js` (Paso Crítico y Complejo)**:
    *   Localiza y abre el archivo `js/plugins.js` (usualmente en `www/js/plugins.js`). Este archivo define qué plugins carga el juego, su estado y sus parámetros.
    *   El archivo contiene un array de objetos JSON. Cada objeto representa un plugin. Ejemplo:
        ```javascript
        // Formato de una entrada en plugins.js
        // {"name":"NombrePlugin","status":true,"description":"...","parameters":{"param1":"valor1"}}
        ```
    *   Necesitas añadir una nueva entrada para `JulesTranslator`. **La parte más difícil es replicar correctamente el objeto `parameters`**. Debes listar todos los parámetros definidos en la cabecera de `JulesTranslator.js` (las líneas que empiezan con `@param`) y asignarles un valor.
        *   **Ejemplo de entrada para `JulesTranslator` (¡DEBES AJUSTAR LOS VALORES!):**
            ```json
            {
                "name": "JulesTranslator",
                "status": true, // true para activar el plugin
                "description": "Provides automatic and manual translation capabilities for RPG Maker MV/MZ games.", // Puedes copiar del @plugindesc
                "parameters": {
                    "Target Language": "en", // TU IDIOMA DESTINO DESEADO
                    "Machine Translation Service": "google", // "google", "deepl", o "" para ninguno
                    "Google API Key": "TU_GOOGLE_API_KEY", // TU CLAVE API SI USAS GOOGLE
                    "DeepL API Key": "TU_DEEPL_API_KEY",   // TU CLAVE API SI USAS DEEPL
                    "Enable Text Hooking": "true",
                    "Enable Data File Translation": "true",
                    "Translate Actors.json": "true",
                    "Translate Classes.json": "true",
                    "Translate Skills.json": "true",
                    "Translate Items.json": "true",
                    "Translate Weapons.json": "true",
                    "Translate Armors.json": "true",
                    "Translate Enemies.json": "true",
                    "Translate States.json": "true",
                    "Translate System.json": "true",
                    "Translate MapInfos.json": "true",
                    "Translate Event Text": "true",
                    "Translate Troops.json": "true",
                    "Enable Translation Cache": "true",
                    "Manual Translation Folder": "translations",
                    "Game Original Language": "ja", // IDIOMA ORIGINAL DEL JUEGO
                    "Log Level": "2", // 0=None, 1=Error, 2=Info, 3=Debug
                    "Max Retries On Error": "2",
                    "Initial Retry Delay Ms": "500",
                    "Toggle Hotkey Key": "F10",
                    "Toggle Hotkey Modifier": "",
                    "Available Target Languages": "en,es,fr,de,ja,ko,zh-CN,zh-TW,pt,it,ru", // IDIOMAS PARA EL MENÚ
                    "Translator Options Help Text": "Select target language for translation."
                }
            }
            ```
        *   Añade este objeto JSON al array en `plugins.js`. **Asegúrate de que la sintaxis del JSON sea válida** (ej. añade una coma antes si no es el último elemento del array y no hay una ya).
        *   **Orden de Carga**: El lugar donde insertes esta entrada en el array determina el orden de carga. Ponerlo al final es lo más simple, pero puede causar problemas si el plugin necesita cargarse antes que otros o si interactúa con plugins que modifican las mismas funciones. No hay una respuesta fácil para esto sin conocer la lista de plugins existente.

4.  **Alternativa para Parámetros (Modificar `JulesTranslator.js` directamente - No recomendado para todos los parámetros)**:
    *   Si la edición de `plugins.js` para los parámetros es demasiado compleja, *algunos* parámetros (especialmente los que son strings simples como claves API o idioma por defecto) podrían ser "hardcodeados" modificando directamente el archivo `JulesTranslator.js` donde se leen.
    *   Busca líneas como `$.targetLanguage = String($.Parameters['Target Language'] || 'en');` y podrías cambiar `'en'` a tu valor deseado o asignar directamente `$.targetLanguage = 'es';`.
    *   **Esto es más invasivo para el código del plugin y menos flexible.** Es preferible configurar todo vía `plugins.js` si es posible. Los parámetros booleanos o numéricos leídos desde `plugins.js` son strings y el plugin los convierte (`"true" === 'true'`, `parseInt(...)`). Si los hardcodeas, usa el tipo de dato correcto (ej. `$.enableCache = true;`, `$.logLevel = 2;`).

Este método es significativamente más complejo que usar el Plugin Manager y solo se recomienda para usuarios con experiencia técnica. El plugin funcionará de manera óptima cuando se configura a través del editor de RPG Maker.

## 4. Configuración de Parámetros del Plugin

Configura estos parámetros en el Gestor de Plugins de RPG Maker (si tienes acceso al proyecto fuente). Si estás modificando un juego compilado, consulta la sección "3.1 Instalación en Juegos Compilados".

*   **`Target Language`**:
    *   El código del idioma al que quieres traducir el juego (ej. `en` para inglés, `es` para español, `ja` para japonés).
    *   Valor por defecto: `en`.

*   **`Machine Translation Service`**:
    *   Elige el servicio de traducción automática preferido.
    *   Opciones: `None`, `Google Translate`, `DeepL`.
    *   Si se elige `None`, solo se usarán traducciones manuales.
    *   Valor por defecto: `None`.

*   **`Google API Key`**:
    *   Tu clave API para Google Cloud Translation API, si seleccionaste "Google Translate".
    *   Necesitas tener una cuenta de Google Cloud Platform y habilitar la API de Traducción.
    *   Valor por defecto: (vacío).

*   **`DeepL API Key`**:
    *   Tu clave de autenticación para la API de DeepL, si seleccionaste "DeepL".
    *   Compatible con claves API de DeepL Free y DeepL Pro.
    *   Valor por defecto: (vacío).

*   **`Enable Text Hooking`**:
    *   Habilita la traducción del texto que se muestra dinámicamente en las ventanas del juego (diálogos, menús, ayuda, etc.).
    *   Valor por defecto: `true` (Activado).

*   **`Enable Data File Translation`**:
    *   Habilita la traducción del texto contenido en los archivos de datos del juego (ej. `Actors.json`, `Items.json`).
    *   Valor por defecto: `true` (Activado).

---
**`---- Data File Translation Options ----`**
(Estos parámetros solo tienen efecto si `Enable Data File Translation` está activado)

*   **`Translate Actors.json`**: Traduce nombres, apodos y perfiles de actores. (Default: `true`)
*   **`Translate Classes.json`**: Traduce nombres de clases. (Default: `true`)
*   **`Translate Skills.json`**: Traduce nombres, descripciones y mensajes de habilidades. (Default: `true`)
*   **`Translate Items.json`**: Traduce nombres y descripciones de objetos. (Default: `true`)
*   **`Translate Weapons.json`**: Traduce nombres y descripciones de armas. (Default: `true`)
*   **`Translate Armors.json`**: Traduce nombres y descripciones de armaduras. (Default: `true`)
*   **`Translate Enemies.json`**: Traduce nombres de enemigos. (Default: `true`)
*   **`Translate States.json`**: Traduce nombres y mensajes de estados. (Default: `true`)
*   **`Translate System.json`**: Traduce el título del juego, términos del sistema (ej. "Luchar", "Objeto", "Guardar"), tipos de armas/armaduras, elementos, etc. (Default: `true`)
*   **`Translate MapInfos.json`**: Traduce los nombres de los mapas. (Default: `true`)
*   **`Translate Event Text`**: Traduce el texto de los comandos de evento en los archivos de mapa (`MapXXX.json`) y eventos comunes (`CommonEvents.json`). Esto incluye "Show Text", "Show Choices", "Show Scrolling Text". (Default: `true`)
*   **`Translate Troops.json`**: Traduce nombres de tropas. (Principalmente para el editor, pero útil si algún plugin los muestra). (Default: `true`)

---
**`---- Caching Options ----`**

*   **`Enable Translation Cache`**:
    *   Guarda las traducciones realizadas (tanto manuales como automáticas) para evitar retraducir el mismo texto y reducir llamadas a la API.
    *   Valor por defecto: `true` (Activado).

---
**`---- Manual Translations Options ----`**

*   **`Manual Translation Folder`**:
    *   Nombre de la carpeta (dentro de `js/plugins/JulesTranslator/`) donde se buscarán los archivos JSON de traducción manual.
    *   Valor por defecto: `translations`.

*   **`Game Original Language`**:
    *   El código del idioma original en el que están escritos los textos de tu juego (ej. `ja`, `en`).
    *   Esto es crucial para que el plugin sepa qué archivo de traducción manual cargar (ej. si el original es `ja` y el `Target Language` es `en`, buscará `ja_en.json`).
    *   Valor por defecto: `ja`.

---
**`---- Debug Options ----`**

*   **`Log Level`**:
    *   Nivel de detalle para los mensajes del plugin en la consola del desarrollador.
    *   Opciones: `None` (0), `Error` (1), `Info` (2), `Debug` (3).
    *   `Info` es un buen balance para uso general. `Debug` es muy verboso.
    *   Valor por defecto: `Info` (2).

---
**`---- Machine Translation Options ----`**

*   **`Max Retries On Error`**:
    *   Número máximo de reintentos para llamadas a la API de traducción automática en caso de errores transitorios (red, error 50x del servidor).
    *   Valor por defecto: `2`.

*   **`Initial Retry Delay Ms`**:
    *   Retraso inicial en milisegundos antes del primer reintento. Los reintentos subsiguientes usan un backoff exponencial (el retraso se duplica).
    *   Valor por defecto: `500`.

---
**`---- Hotkey Options ----`**

*   **`Toggle Hotkey Key`**:
    *   Tecla para activar/desactivar la traducción en el juego. No distingue mayúsculas/minúsculas.
    *   Ejemplos: `F10`, `T`, `P`. Para teclas de función, usa `F1` a `F12`.
    *   Valor por defecto: `F10`.

*   **`Toggle Hotkey Modifier`**:
    *   (Actualmente no implementado completamente, para uso futuro). Tecla modificadora opcional (shift, control, alt).
    *   Valor por defecto: (vacío).

---
**`---- UI Options ----`**

*   **`Available Target Languages`**:
    *   Lista de códigos de idioma separados por comas que se mostrarán en el menú de selección de idioma en el juego.
    *   Ejemplo: `en,es,fr,ja,ko`.
    *   Valor por defecto: `en,es,fr,de,ja,ko,zh-CN,zh-TW,pt,it,ru`.

*   **`Translator Options Help Text`**:
    *   Texto que se muestra en la ventana de ayuda de la escena de opciones de traducción.
    *   Valor por defecto: `Select target language for translation.`.

## 5. Uso de Traducciones Manuales

Si prefieres proporcionar tus propias traducciones o corregir las automáticas, puedes usar archivos de traducción manual.

1.  **Crea la Carpeta**: Dentro de `js/plugins/JulesTranslator/`, crea la carpeta especificada en el parámetro `Manual Translation Folder` (por defecto, `translations`).
2.  **Nombra los Archivos**: Los archivos JSON deben seguir el formato `[original_lang]_[target_lang].json`.
    *   `[original_lang]` es el valor del parámetro `Game Original Language`.
    *   `[target_lang]` es el código del idioma al que quieres traducir (puede ser el mismo que `Target Language` o cualquier otro que configures mediante comandos de plugin).
    *   **Ejemplo**: Si tu juego está en japonés (`ja`) y quieres traducir a inglés (`en`), el archivo se llamará `ja_en.json` y estará en `js/plugins/JulesTranslator/translations/ja_en.json`.
3.  **Formato JSON**: El archivo debe ser un objeto JSON donde las claves son el texto original y los valores son el texto traducido.
    ```json
    {
      "こんにちは世界": "Hello World",
      "冒険が始まる！": "The adventure begins!",
      "ポーション": "Potion",
      "\\N[1]はポーションを使った。": "\\N[1] used a Potion."
    }
    ```
    *   **Importante**: Los códigos de escape de RPG Maker (como `\N[1]`, `\V[2]`, `\C[3]`) deben incluirse tal cual en el texto original (clave) y en el texto traducido (valor) si deseas que se conserven y funcionen. El plugin extrae estos códigos antes de enviarlos a un servicio de MT, pero para las traducciones manuales, eres responsable de mantenerlos.

El plugin cargará el archivo de traducción manual correspondiente al `Game Original Language` y al `Target Language` actual al iniciarse y cada vez que se cambie el `Target Language`.

## 6. Comandos de Plugin

Puedes usar comandos de plugin en tus eventos para controlar el traductor durante el juego.

**Estilo MV:**

*   `JulesTranslator enable`
    *   Habilita la funcionalidad de traducción.
*   `JulesTranslator disable`
    *   Deshabilita la funcionalidad de traducción. Los textos se mostrarán en su idioma original.
*   `JulesTranslator setLang [codigo_idioma]`
    *   Cambia el idioma de destino. Ejemplo: `JulesTranslator setLang es`.
    *   Esto limpiará la caché de traducción y recargará los archivos de traducción manual para el nuevo par de idiomas.
*   `JulesTranslator reload`
    *   Limpia la caché de traducción y recarga los archivos de traducción manual para el idioma actual.
*   `JulesTranslator openLanguageMenu`
    *   Abre la escena de selección de idioma en el juego.

**Estilo MZ:**
Usa los comandos registrados en el editor de plugins de MZ:

*   **Enable Translator**: Habilita la traducción.
*   **Disable Translator**: Deshabilita la traducción.
*   **Set Target Language**:
    *   Argumento `Language Code`: El código del idioma al que cambiar (ej. `es`).
*   **Reload Translations**: Limpia caché y recarga archivos manuales.
*   **Open Language Menu**: Abre la escena de selección de idioma.

## 7. Notas Importantes sobre Traducción Asíncrona

*   **Traducción Automática es Asíncrona**: Cuando se utilizan servicios de traducción automática (Google, DeepL), el juego solicita traducciones a un servidor externo. Este proceso no es instantáneo.
*   **Visualización Inicial**: Los textos que dependen de la traducción automática podrían mostrarse brevemente en su idioma original. Una vez que la traducción se recibe del servidor, el elemento de texto en el juego se actualizará. Esto es para evitar que el juego se congele mientras espera la respuesta de la API.
*   **Cambio de Idioma**: Cambiar el idioma a través del menú de opciones en el juego intentará refrescar la mayoría de los elementos de texto en pantalla. Sin embargo, para un refresco completo de todos los elementos de la interfaz de usuario, especialmente aquellos gestionados por escenas complejas u otros plugins, ocasionalmente podría ser necesario un cambio de escena (por ejemplo, reingresar a un menú o mapa).
*   **Traducción de Datos**: Los datos del juego (objetos, habilidades, actores, etc.) también se traducen. Si se utiliza traducción automática para estos, el texto original podría usarse inicialmente si la traducción aún no está disponible cuando se accede por primera vez a los datos. Los datos se actualizarán en segundo plano una vez traducidos.

## 8. Solución de Problemas Comunes / FAQ (Básico)

*   **El texto no se traduce**:
    *   Verifica que el plugin esté activado.
    *   Asegúrate de que `Enable Text Hooking` (para UI) y/o `Enable Data File Translation` (para datos) estén activados.
    *   Si usas MT, comprueba que el servicio esté seleccionado y la clave API sea correcta y válida. Revisa la consola del desarrollador (F8 o F12 durante el juego) para mensajes de error de la API.
    *   Si usas traducciones manuales, verifica que el nombre del archivo (`[original]_[destino].json`) y su ubicación sean correctos, y que el JSON esté bien formateado. El `Game Original Language` y `Target Language` deben coincidir con los nombres de archivo.
*   **Algunos textos específicos no se traducen**:
    *   Algunos textos podrían ser dibujados por otros plugins de maneras que JulesTranslator no puede interceptar fácilmente.
    *   El texto en imágenes o partes muy personalizadas de la UI podría no ser traducible por este plugin.
*   **Errores en la consola**: Revisa los mensajes de error. Si son de JulesTranslator, a menudo indican un problema de configuración o de API.

---

¡Gracias por usar JulesTranslator!
