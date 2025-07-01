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
*   **Archivos Necesarios**: Debes tener los siguientes archivos y la carpeta en una misma ubicación (ej. una carpeta "JulesTranslatorInstaller" en tu escritorio):
    *   `InstallOrUpdateJulesTranslator.ps1` (el script de instalación)
    *   `configJules.json` (debes crearlo renombrando `configJules.json.example` y editando sus valores)
    *   `JulesTranslator.js` (el archivo principal del plugin)
    *   La carpeta `JulesTranslator/` (conteniendo todos los módulos `.js` auxiliares y tu subcarpeta `translations/` si usas traducciones manuales).

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
        *   Ejemplo: `"C:/Juegos/MiJuegoRPG"` o `"D:/SteamLibrary/steamapps/common/OtroJuego/www"`.
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
*   **Actualizaciones del Plugin**: Para actualizar el plugin JulesTranslator a una nueva versión, simplemente reemplaza `JulesTranslator.js` y el contenido de la carpeta `JulesTranslator/` en la carpeta donde tienes el script `.ps1` (tu carpeta de "instalación" local). Luego, vuelve a ejecutar el script apuntando a la carpeta de tu juego. Esto sobrescribirá los archivos del plugin en el juego y actualizará los parámetros en `plugins.js` si los cambiaste en tu `configJules.json`.

## 4. Configuración de Parámetros del Plugin

Estos parámetros se configuran en el Gestor de Plugins de RPG Maker (si usas el Método A de instalación) o en el archivo `configJules.json` (si usas el Método B con el script de PowerShell).

*   **`Target Language`**:
    *   El código del idioma al que quieres traducir el juego (ej. `en` para inglés, `es` para español, `ja` para japonés).
    *   Valor por defecto: `en`.

*   **`Machine Translation Service`**:
    *   Elige el servicio de traducción automática preferido.
    *   Opciones: `None` (o `""` en JSON), `Google Translate` (`"google"`), `DeepL` (`"deepl"`).
    *   Si se elige `None`, solo se usarán traducciones manuales.
    *   Valor por defecto: `""` (None).

*   **`Google API Key`**:
    *   Tu clave API para Google Cloud Translation API, si seleccionaste "Google Translate".
    *   Necesitas tener una cuenta de Google Cloud Platform y habilitar la API de Traducción.
    *   Valor por defecto: `""`.

*   **`DeepL API Key`**:
    *   Tu clave de autenticación para la API de DeepL, si seleccionaste "DeepL".
    *   Compatible con claves API de DeepL Free y DeepL Pro.
    *   Valor por defecto: `""`.

*   **`Enable Text Hooking`**:
    *   Habilita la traducción del texto que se muestra dinámicamente en las ventanas del juego (diálogos, menús, ayuda, etc.).
    *   Valores: `"true"` o `"false"`.
    *   Valor por defecto: `"true"`.

*   **`Enable Data File Translation`**:
    *   Habilita la traducción del texto contenido en los archivos de datos del juego (ej. `Actors.json`, `Items.json`).
    *   Valores: `"true"` o `"false"`.
    *   Valor por defecto: `"true"`.

---
**`---- Data File Translation Options ----`**
(Estos parámetros solo tienen efecto si `Enable Data File Translation` es `"true"`)

*   **`Translate Actors.json`**: Traduce nombres, apodos y perfiles de actores. (Default: `"true"`)
*   **`Translate Classes.json`**: Traduce nombres de clases. (Default: `"true"`)
*   **`Translate Skills.json`**: Traduce nombres, descripciones y mensajes de habilidades. (Default: `"true"`)
*   **`Translate Items.json`**: Traduce nombres y descripciones de objetos. (Default: `"true"`)
*   **`Translate Weapons.json`**: Traduce nombres y descripciones de armas. (Default: `"true"`)
*   **`Translate Armors.json`**: Traduce nombres y descripciones de armaduras. (Default: `"true"`)
*   **`Translate Enemies.json`**: Traduce nombres de enemigos. (Default: `"true"`)
*   **`Translate States.json`**: Traduce nombres y mensajes de estados. (Default: `"true"`)
*   **`Translate System.json`**: Traduce el título del juego, términos del sistema, etc. (Default: `"true"`)
*   **`Translate MapInfos.json`**: Traduce los nombres de los mapas. (Default: `"true"`)
*   **`Translate Event Text`**: Traduce el texto de los comandos de evento. (Default: `"true"`)
*   **`Translate Troops.json`**: Traduce nombres de tropas. (Default: `"true"`)

---
**`---- Caching Options ----`**

*   **`Enable Translation Cache`**:
    *   Guarda las traducciones para mejorar rendimiento y reducir llamadas API.
    *   Valores: `"true"` o `"false"`.
    *   Valor por defecto: `"true"`.

---
**`---- Manual Translations Options ----`**

*   **`Manual Translation Folder`**:
    *   Nombre de la carpeta (dentro de `js/plugins/JulesTranslator/`) para los archivos JSON de traducción manual.
    *   Valor por defecto: `"translations"`.

*   **`Game Original Language`**:
    *   Código del idioma original del juego. Crucial para seleccionar el archivo manual correcto.
    *   Valor por defecto: `"ja"`.

---
**`---- Debug Options ----`**

*   **`Log Level`**:
    *   Nivel de detalle para logs en la consola.
    *   Opciones: `"0"` (None), `"1"` (Error), `"2"` (Info), `"3"` (Debug).
    *   Valor por defecto: `"2"` (Info).

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
    *   Lista de códigos de idioma separados por comas para el menú de selección en juego.
    *   Ejemplo: `"en,es,fr,ja"`.
    *   Valor por defecto: `"en,es,fr,de,ja,ko,zh-CN,zh-TW,pt,it,ru"`.

*   **`Translator Options Help Text`**:
    *   Texto en la ventana de ayuda de la escena de opciones de traducción.
    *   Valor por defecto: `"Select target language for translation."`.

## 5. Uso de Traducciones Manuales

(Esta sección permanece igual que antes)
...

## 6. Comandos de Plugin

(Esta sección permanece igual que antes)
...

## 7. Notas Importantes sobre Traducción Asíncrona

(Esta sección permanece igual que antes)
...

## 8. Solución de Problemas Comunes / FAQ (Básico)

(Esta sección permanece igual que antes)
...

---

¡Gracias por usar JulesTranslator!
```

He reestructurado la sección de Instalación para presentar ambos métodos y luego he añadido la nueva sección 3.1 con todos los detalles del script de PowerShell. También he revisado la sección 4 para indicar que los parámetros se configuran en el Gestor de Plugins O en `configJules.json`, y he asegurado que los valores de ejemplo en la descripción de los parámetros sean strings cuando corresponda (ya que así los lee el Plugin Manager y el script los pasará como strings también).
