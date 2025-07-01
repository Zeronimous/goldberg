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
*   **Instalador/Configurador (PowerShell)**: Se proporciona un script de PowerShell para facilitar la instalación y configuración en juegos compilados.

## 3. Instalación

Existen dos métodos principales para instalar y configurar el plugin:

**Método A: Usando el Editor de RPG Maker (Recomendado para desarrolladores con acceso al proyecto fuente)**

1.  **Descargar Archivos**:
    *   Obtén el archivo `JulesTranslator.js`.
    *   Obtén la carpeta completa `JulesTranslator` que contiene los módulos auxiliares (`DataManagerHooks.js`, etc.) y una subcarpeta `translations` de ejemplo.
2.  **Copiar Archivos al Proyecto**:
    *   Coloca `JulesTranslator.js` directamente en la carpeta `js/plugins/` de tu proyecto RPG Maker.
    *   Coloca la carpeta `JulesTranslator` (con todos sus contenidos) también directamente en `js/plugins/`. La estructura debería ser:
        ```
        <TuProyecto>/js/plugins/JulesTranslator.js
        <TuProyecto>/js/plugins/JulesTranslator/DataManagerHooks.js
        <TuProyecto>/js/plugins/JulesTranslator/Scene_TranslatorOptions.js
        // ... y los otros archivos .js y la carpeta translations
        ```
3.  **Activar el Plugin**:
    *   Abre tu proyecto en RPG Maker MV o MZ.
    *   Ve al Gestor de Plugins (Plugin Manager).
    *   Añade `JulesTranslator.js` a la lista de plugins. Asegúrate de que esté **después** de cualquier plugin que modifique significativamente las ventanas de texto o el manejo de datos, si es posible.
4.  **Configurar Parámetros**:
    *   Haz clic en el plugin `JulesTranslator` en la lista para abrir sus parámetros y configúralos según tus necesidades (ver sección "4. Configuración de Parámetros del Plugin").

**Método B: Usando el Script de Instalación PowerShell (Recomendado para juegos compilados o para una configuración rápida basada en archivos)**

Consulta la sección **"3.1 Instalación y Configuración Automatizada con PowerShell"** a continuación.

## 3.1 Instalación y Configuración Automatizada con PowerShell

Este método utiliza un script de PowerShell para facilitar la instalación del plugin y la configuración de sus parámetros, siendo especialmente útil para juegos ya compilados donde no se tiene acceso al editor de RPG Maker.

**Requisitos Previos:**

*   **PowerShell**: Generalmente preinstalado en Windows. Para ejecutar scripts descargados de internet, puede que necesites ajustar tu política de ejecución. Abre PowerShell como Administrador y ejecuta una vez:
    ```powershell
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```
    Responde 'Y' (Sí) o 'A' (Sí a todo) si se te pregunta.
*   **Archivos Necesarios**: Debes tener los siguientes archivos y la carpeta en una misma ubicación (ej. una carpeta "JulesTranslatorInstaller" en tu escritorio). Esta será tu "carpeta de instalación del plugin":
    *   `InstallOrUpdateJulesTranslator.ps1` (el script de instalación)
    *   `configJules.json` (debes crearlo renombrando `configJules.json.example` y editando sus valores)
    *   `JulesTranslator.js` (el archivo principal del plugin)
    *   La carpeta `JulesTranslator/` (conteniendo todos los módulos `.js` auxiliares y tu subcarpeta `translations/` si usas traducciones manuales).

    Estructura de ejemplo para tu "carpeta de instalación del plugin":
    ```
    JulesTranslatorInstaller/
    ├── InstallOrUpdateJulesTranslator.ps1
    ├── configJules.json
    ├── JulesTranslator.js
    └── JulesTranslator/
        ├── DataManagerHooks.js
        ├── Scene_TranslatorOptions.js
        ├── TranslationServices.js
        ├── WindowHooks.js
        ├── Window_TranslatorLanguage.js
        └── translations/
            └── (ej: es_en.json, ja_en.json, etc.)
    ```

**Pasos:**

1.  **Prepara los Archivos**:
    *   Descarga todos los elementos mencionados en "Archivos Necesarios".
    *   Colócalos juntos en una carpeta en tu PC.
    *   Renombra `configJules.json.example` a `configJules.json`.

2.  **Configura `configJules.json`**:
    *   Abre `configJules.json` con un editor de texto (como Notepad++, VS Code, o incluso el Bloc de notas).
    *   **`pluginParameters`**: Edita los valores dentro de este objeto. Estas son las configuraciones para el plugin JulesTranslator. Las claves deben coincidir exactamente con los nombres de los parámetros del plugin.
        *   **Ejemplos Clave a Configurar**:
            *   `"Target Language"`: El idioma al que quieres traducir (ej. `"es"` para español).
            *   `"Machine Translation Service"`: Déjalo como `""` para no usar traducción automática, o pon `"google"` o `"deepl"`.
            *   `"Google API Key"` / `"DeepL API Key"`: Introduce tus claves API si vas a usar traducción automática. Déjalas como `""` si no.
            *   `"Game Original Language"`: El idioma original de los textos del juego (ej. `"en"` si el juego está en inglés).
            *   Revisa todos los demás parámetros listados en `configJules.json` y ajústalos según la documentación (ver Sección 4 de este README para una descripción detallada de cada parámetro).
    *   **`scriptSettings.gamePath`**:
        *   Puedes pegar aquí la ruta completa a la carpeta raíz de tu juego RPG Maker (la carpeta que contiene `Game.exe` o `index.html`, y usualmente una subcarpeta `www` o directamente `js`).
        *   Ejemplo: `"C:/Juegos/MiJuegoRPG"` o `"D:/SteamLibrary/steamapps/common/OtroJuego/www"`. (Nota: Usa barras `/` o barras dobles `\\\\` para las rutas en JSON).
        *   Si dejas el valor por defecto o un placeholder, el script te pedirá la ruta interactivamente cuando lo ejecutes.

3.  **Ejecuta el Script de PowerShell**:
    *   Haz clic derecho sobre el archivo `InstallOrUpdateJulesTranslator.ps1` y selecciona "Ejecutar con PowerShell".
    *   Si no especificaste una `gamePath` válida en `configJules.json`, el script te pedirá que introduzcas la ruta a la carpeta del juego en la ventana de PowerShell. Pégala o escríbela y presiona Enter.
    *   El script realizará lo siguiente:
        1.  Validará la ruta del juego.
        2.  Copiará `JulesTranslator.js` y la carpeta `JulesTranslator/` a la subcarpeta `js/plugins/` del juego.
        3.  Leerá el archivo `js/plugins.js` del juego.
        4.  Añadirá o actualizará la entrada de `JulesTranslator` en `js/plugins.js` con los parámetros que especificaste en `configJules.json`.
        5.  Guardará los cambios en `js/plugins.js`.

4.  **Verifica**:
    *   El script mostrará mensajes en la ventana de PowerShell indicando las acciones realizadas. Revisa si hubo algún mensaje de error.
    *   Inicia el juego para comprobar que el plugin funciona como esperas.
    *   Abre la consola del desarrollador del juego (usualmente presionando F8 o F12 durante el juego en Windows) para ver los logs de `JulesTranslator` y posibles errores de carga o configuración.

**Notas Importantes para el Método del Script:**

*   **Orden de Plugins**: Si `JulesTranslator` es añadido por primera vez, el script lo colocará al final de la lista en `plugins.js`. Si necesitas un orden específico para compatibilidad con otros plugins, y tienes acceso al editor del proyecto, es mejor ajustar el orden allí. Para juegos compilados, cambiar el orden requeriría editar `plugins.js` manualmente.
*   **Copias de Seguridad**: Siempre es buena idea tener una copia de seguridad de tu juego compilado antes de modificar sus archivos. El script no crea copias de seguridad de `plugins.js` automáticamente.
*   **Actualizaciones del Plugin**: Para actualizar el plugin JulesTranslator a una nueva versión, simplemente reemplaza `JulesTranslator.js` y el contenido de la carpeta `JulesTranslator/` en la carpeta donde tienes el script `.ps1` (tu carpeta de "instalación" local). Luego, vuelve a ejecutar el script apuntando a la carpeta de tu juego. Esto sobrescribirá los archivos del plugin en el juego y actualizará los parámetros en `plugins.js` si los cambiaste en tu `configJules.json`.

## 4. Configuración de Parámetros del Plugin

Estos parámetros se configuran en el Gestor de Plugins de RPG Maker (si usas el Método A de instalación) o en el archivo `configJules.json` (si usas el Método B con el script de PowerShell). Los valores en `configJules.json` deben ser strings, incluso para booleanos o números, ya que así los maneja el sistema de parámetros de RPG Maker.

*   **`Target Language`**:
    *   El código del idioma al que quieres traducir el juego (ej. `"en"` para inglés, `"es"` para español).
    *   Valor por defecto: `"en"`.

*   **`Machine Translation Service`**:
    *   Elige el servicio de traducción automática.
    *   Opciones: `""` (None), `"google"` (API de pago de Google), `"deepl"` (API de DeepL, compatible con Free y Pro), `"googlefree"` (Método no oficial y potencialmente inestable de Google Translate, sin API Key).
    *   Valor por defecto: `""`.

*   **`Google API Key`**:
    *   Tu clave API para Google Cloud Translation API (necesaria si `Machine Translation Service` es `"google"`).
    *   Valor por defecto: `""`.

*   **`DeepL API Key`**:
    *   Tu clave de autenticación para la API de DeepL (necesaria si `Machine Translation Service` es `"deepl"`). Compatible con claves API de DeepL Free y DeepL Pro.
    *   Valor por defecto: `""`.

*   **`Enable Text Hooking`**:
    *   Habilita la traducción de texto dinámico en ventanas.
    *   Valores: `"true"` o `"false"`.
    *   Valor por defecto: `"true"`.

*   **`Enable Data File Translation`**:
    *   Habilita la traducción de archivos de datos.
    *   Valores: `"true"` o `"false"`.
    *   Valor por defecto: `"true"`.

---
**`---- Data File Translation Options ----`**
(Solo tienen efecto si `Enable Data File Translation` es `"true"`)

*   **`Translate Actors.json`**: (Default: `"true"`)
*   **`Translate Classes.json`**: (Default: `"true"`)
*   **`Translate Skills.json`**: (Default: `"true"`)
*   **`Translate Items.json`**: (Default: `"true"`)
*   **`Translate Weapons.json`**: (Default: `"true"`)
*   **`Translate Armors.json`**: (Default: `"true"`)
*   **`Translate Enemies.json`**: (Default: `"true"`)
*   **`Translate States.json`**: (Default: `"true"`)
*   **`Translate System.json`**: (Default: `"true"`)
*   **`Translate MapInfos.json`**: (Default: `"true"`)
*   **`Translate Event Text`**: (Default: `"true"`)
*   **`Translate Troops.json`**: (Default: `"true"`)

---
**`---- Caching Options ----`**

*   **`Enable Translation Cache`**:
    *   Valores: `"true"` o `"false"`.
    *   Valor por defecto: `"true"`.

---
**`---- Manual Translations Options ----`**

*   **`Manual Translation Folder`**:
    *   Nombre de la carpeta para archivos JSON manuales (dentro de `js/plugins/JulesTranslator/`).
    *   Valor por defecto: `"translations"`.

*   **`Game Original Language`**:
    *   Código del idioma original del juego. Crucial para seleccionar el archivo manual correcto.
    *   Valor por defecto: `"ja"`.

---
**`---- Debug Options ----`**

*   **`Log Level`**:
    *   Nivel de detalle para logs en la consola. Opciones: `"0"` (None), `"1"` (Error), `"2"` (Info), `"3"` (Debug).
    *   Valor por defecto: `"2"`.

---
**`---- Machine Translation Options ----`**

*   **`Max Retries On Error`**:
    *   Número máximo de reintentos para llamadas API en errores transitorios.
    *   Valor por defecto: `"2"`.

*   **`Initial Retry Delay Ms`**:
    *   Retraso inicial en ms antes del primer reintento.
    *   Valor por defecto: `"500"`.

---
**`---- Hotkey Options ----`**

*   **`Toggle Hotkey Key`**:
    *   Tecla para activar/desactivar traducción. Ej: `"F10"`, `"T"`.
    *   Valor por defecto: `"F10"`.

*   **`Toggle Hotkey Modifier`**:
    *   (No implementado completamente). Modificador opcional.
    *   Valor por defecto: `""`.

---
**`---- UI Options ----`**

*   **`Available Target Languages`**:
    *   Lista de códigos de idioma (separados por comas) para el menú en juego.
    *   Ejemplo: `"en,es,fr,ja"`.
    *   Valor por defecto: `"en,es,fr,de,ja,ko,zh-CN,zh-TW,pt,it,ru"`.

*   **`Translator Options Help Text`**:
    *   Texto en la ventana de ayuda de la escena de opciones de traducción.
    *   Valor por defecto: `"Select target language for translation."`.

## 5. Uso de Traducciones Manuales

Si prefieres proporcionar tus propias traducciones o corregir las automáticas, puedes usar archivos de traducción manual.

1.  **Crea la Carpeta**: Dentro de `js/plugins/JulesTranslator/` (que estará en la carpeta de tu juego después de ejecutar el script de instalación, o en tu carpeta de "instalación" del plugin), crea la carpeta especificada en el parámetro `Manual Translation Folder` (por defecto, `translations`).
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

El plugin cargará el archivo de traducción manual correspondiente al `Game Original Language` y al `Target Language` actual al iniciarse y cada vez que se cambie el `Target Language`. Si usas el script de instalación, asegúrate de que tu carpeta `translations/` esté junto a los demás archivos del plugin para que se copie correctamente al juego.

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
    *   Abre la escena de selección de idioma en el juego. **Nota**: Para que los jugadores puedan usar esto, debes llamar a este comando desde un evento del juego (ej. un PNJ, un objeto del mapa, un ítem, o a través de un plugin de menú personalizado). La tecla F10 (o la configurada en `Toggle Hotkey Key`) solo activa/desactiva la traducción, no abre este menú.

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
    *   Verifica que el plugin esté activado (`status: true` en `plugins.js` o activado en el Plugin Manager).
    *   Asegúrate de que `Enable Text Hooking` (para UI) y/o `Enable Data File Translation` (para datos) estén configurados a `"true"`.
    *   Si usas MT, comprueba que el servicio esté seleccionado y la clave API sea correcta y válida. Revisa la consola del desarrollador (F8 o F12 durante el juego) para mensajes de error de la API.
    *   Si usas traducciones manuales, verifica que el nombre del archivo (`[original]_[destino].json`) y su ubicación (`js/plugins/JulesTranslator/translations/`) sean correctos, y que el JSON esté bien formateado. El `Game Original Language` y `Target Language` deben coincidir con los nombres de archivo.
*   **Algunos textos específicos no se traducen**:
    *   Algunos textos podrían ser dibujados por otros plugins de maneras que JulesTranslator no puede interceptar fácilmente.
    *   El texto en imágenes o partes muy personalizadas de la UI podría no ser traducible por este plugin.
*   **Errores en la consola**: Revisa los mensajes de error. Si son de JulesTranslator, a menudo indican un problema de configuración o de API.
*   **El script de PowerShell no funciona**:
    *   Asegúrate de haber ajustado la política de ejecución de PowerShell (`Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`).
    *   Verifica que todos los archivos necesarios (`.ps1`, `configJules.json`, `JulesTranslator.js`, carpeta `JulesTranslator/`) estén en el mismo directorio desde donde ejecutas el script.
    *   Comprueba que la ruta al juego en `configJules.json` o la que introduces sea correcta.
*   **La opción "Google Translate (Free/Unofficial)" no funciona o da errores**:
    *   Esta opción utiliza un endpoint no oficial de Google que no requiere clave API.
    *   **ADVERTENCIA**: Su uso es bajo tu propio riesgo. Google puede cambiar, restringir o bloquear este endpoint en cualquier momento sin previo aviso, lo que haría que esta opción deje de funcionar. También podría ir en contra de los Términos de Servicio de Google.
    *   Se proporciona como una alternativa experimental si no se dispone de una clave API para los servicios oficiales, pero su fiabilidad no está garantizada. Se recomienda enfáticamente usar las opciones de API oficiales (`"google"` o `"deepl"`) para una traducción estable.

---

¡Gracias por usar JulesTranslator!
