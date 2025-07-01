# InstallOrUpdateJulesTranslator.ps1

param (
    [string]$ConfigFilePath = "configJules.json"
)

# --- Configuración Inicial ---
$PluginName = "JulesTranslator"
$PluginFileName = "$($PluginName).js"
$PluginFolderName = $PluginName # La carpeta de módulos se llama igual que el plugin

$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$LocalConfigPath = Join-Path -Path $PSScriptRoot -ChildPath $ConfigFilePath
$LocalPluginJsPath = Join-Path -Path $PSScriptRoot -ChildPath $PluginFileName
$LocalPluginFolderPath = Join-Path -Path $PSScriptRoot -ChildPath $PluginFolderName

Function Write-Log ($Message, $Level = "INFO") {
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $FormattedMessage = "[$Timestamp][$Level] $Message"
    Write-Host $FormattedMessage
    # Implementar registro a archivo si se desea en el futuro
    # if ($script:config -and $script:config.scriptSettings.verboseLogging -ne $true -and $Level -eq "DEBUG") {
    # } else { }
}

# --- 1. Leer Configuración ---
Write-Log "Iniciando script de instalación/actualización para $PluginName."
if (-not (Test-Path $LocalConfigPath)) {
    Write-Warning "Archivo de configuración '$ConfigFilePath' no encontrado en la ruta del script ($PSScriptRoot)."
    Write-Warning "Por favor, copia 'configJules.json.example' a '$ConfigFilePath' y edítalo con tu configuración."
    exit 1
}

$configContent = Get-Content -Raw -Path $LocalConfigPath -ErrorAction SilentlyContinue
if (-not $configContent) {
    Write-Error "No se pudo leer el archivo de configuración '$LocalConfigPath'."
    exit 1
}

try {
    $script:config = $configContent | ConvertFrom-Json -ErrorAction Stop
} catch {
    Write-Error "Error parseando '$LocalConfigPath'. Asegúrate de que es un JSON válido."
    Write-Error $_.Exception.Message
    exit 1
}

$pluginParameters = $script:config.pluginParameters
if (-not $pluginParameters) {
    Write-Error "La sección 'pluginParameters' no se encontró en '$LocalConfigPath'."
    exit 1
}

# --- 2. Obtener y Validar Ruta del Juego ---
$gamePath = $null
if ($script:config.scriptSettings -and $script:config.scriptSettings.gamePath -and ($script:config.scriptSettings.gamePath -ne "PASTE_YOUR_GAME_ROOT_FOLDER_PATH_HERE (e.g., C:/Games/MyRPG)")) {
    $gamePath = $script:config.scriptSettings.gamePath
    Write-Log "Ruta del juego leída desde config: $gamePath"
}

while (-not ($gamePath -and (Test-Path $gamePath))) {
    Write-Warning "La ruta del juego no es válida o no está configurada en '$LocalConfigPath'."
    $gamePath = Read-Host -Prompt "Por favor, introduce la ruta completa a la carpeta raíz de tu juego RPG Maker (ej. C:/Games/MyGame)"
    if (-not (Test-Path $gamePath)) {
        Write-Warning "La ruta '$gamePath' no existe. Inténtalo de nuevo."
        $gamePath = $null
    }
}

$gameJsPluginsPath = ""
$gamePluginsJsFilePath = ""

if (Test-Path (Join-Path -Path $gamePath -ChildPath "www/js/plugins.js")) {
    $gameJsPluginsPath = Join-Path -Path $gamePath -ChildPath "www/js/plugins"
    $gamePluginsJsFilePath = Join-Path -Path $gamePath -ChildPath "www/js/plugins.js"
} elseif (Test-Path (Join-Path -Path $gamePath -ChildPath "js/plugins.js")) {
    $gameJsPluginsPath = Join-Path -Path $gamePath -ChildPath "js/plugins"
    $gamePluginsJsFilePath = Join-Path -Path $gamePath -ChildPath "js/plugins.js"
} else {
    Write-Error "No se pudo encontrar 'js/plugins.js' o 'www/js/plugins.js' en la ruta del juego: $gamePath"
    Write-Error "Asegúrate de que la ruta es la carpeta raíz del juego RPG Maker."
    exit 1
}
Write-Log "Ruta de plugins del juego detectada: $gameJsPluginsPath"
Write-Log "Archivo plugins.js del juego detectado: $gamePluginsJsFilePath"

# --- 3. Copiar Archivos del Plugin al Juego ---
Write-Log "Copiando archivos del plugin..."
if (-not (Test-Path $LocalPluginJsPath)) {
    Write-Error "El archivo principal del plugin '$PluginFileName' no se encontró en '$PSScriptRoot'."
    exit 1
}
if (-not (Test-Path $LocalPluginFolderPath -PathType Container)) {
    Write-Error "La carpeta de módulos del plugin '$PluginFolderName' no se encontró en '$PSScriptRoot'."
    exit 1
}

try {
    Copy-Item -Path $LocalPluginJsPath -Destination $gameJsPluginsPath -Force -ErrorAction Stop
    Write-Log "Copiado '$PluginFileName' a '$gameJsPluginsPath'."

    $destinationPluginFolder = Join-Path -Path $gameJsPluginsPath -ChildPath $PluginFolderName
    if (Test-Path $destinationPluginFolder) {
        Write-Log "La carpeta de destino del plugin '$destinationPluginFolder' ya existe. Se reemplazarán sus contenidos."
    }
    Copy-Item -Path $LocalPluginFolderPath\* -Destination $destinationPluginFolder -Recurse -Force -ErrorAction Stop
    Write-Log "Copiada carpeta '$PluginFolderName' a '$destinationPluginFolder'."
} catch {
    Write-Error "Error copiando los archivos del plugin al directorio del juego."
    Write-Error $_.Exception.Message
    exit 1
}

# --- 4. Leer y Modificar plugins.js ---
Write-Log "Modificando '$gamePluginsJsFilePath'..."
$pluginsJsFullContent = Get-Content -Raw -Path $gamePluginsJsFilePath -ErrorAction SilentlyContinue
if (-not $pluginsJsFullContent) {
    Write-Error "No se pudo leer '$gamePluginsJsFilePath'."
    exit 1
}

$jsonArrayString = $null
$prefixContent = ""

$jsonStartIndex = $pluginsJsFullContent.IndexOf('[')
if ($jsonStartIndex -lt 0) {
    Write-Error "No se pudo encontrar el inicio del array JSON ('[') en '$gamePluginsJsFilePath'."
    exit 1
}

$jsonEndIndex = -1
$openBrackets = 0
for ($i = $jsonStartIndex; $i -lt $pluginsJsFullContent.Length; $i++) {
    if ($pluginsJsFullContent[$i] -eq '[') {
        $openBrackets++
    } elseif ($pluginsJsFullContent[$i] -eq ']') {
        $openBrackets--
        if ($openBrackets -eq 0) {
            $jsonEndIndex = $i
            break
        }
    }
}

if ($jsonEndIndex -lt 0) {
    Write-Error "No se pudo encontrar el final del array JSON (']') correspondiente en '$gamePluginsJsFilePath'."
    exit 1
}

$prefixContent = $pluginsJsFullContent.Substring(0, $jsonStartIndex)
$jsonArrayString = $pluginsJsFullContent.Substring($jsonStartIndex, $jsonEndIndex - $jsonStartIndex + 1)

if (-not ($jsonArrayString.TrimStart().StartsWith("[") -and $jsonArrayString.TrimEnd().EndsWith("]"))) {
    Write-Error "La extracción del array JSON de '$gamePluginsJsFilePath' falló. Contenido extraído: $jsonArrayString"
    exit 1
}

$pluginsList = $null
try {
    $pluginsList = $jsonArrayString | ConvertFrom-Json -ErrorAction Stop
} catch {
    Write-Error "Error parseando la sección JSON de '$gamePluginsJsFilePath'. Asegúrate de que es un JSON válido."
    Write-Error "JSON String que se intentó parsear: $jsonArrayString"
    Write-Error $_.Exception.Message
    exit 1
}

if ($null -eq $pluginsList -or $pluginsList.GetType().Name -ne "Object[]") {
     Write-Error "El contenido JSON de '$gamePluginsJsFilePath' no parece ser un array de plugins válido."
     exit 1
}

$pluginEntry = $pluginsList | Where-Object { $_.name -eq $PluginName } | Select-Object -First 1

if ($pluginEntry) {
    Write-Log "Plugin '$PluginName' encontrado en plugins.js. Actualizando parámetros..."
    $pluginEntry.status = $true
    $pluginEntry.parameters = $pluginParameters
} else {
    Write-Log "Plugin '$PluginName' no encontrado en plugins.js. Añadiendo nueva entrada..."
    $pluginDescription = "Provides automatic and manual translation capabilities for RPG Maker MV/MZ games."
    try {
        $jsContent = Get-Content $LocalPluginJsPath -ErrorAction SilentlyContinue
        if ($jsContent -match "(?s)\* @plugindesc (.*?)\n") { # (?s) para que . coincida con newline
            $pluginDescription = ($Matches[1].Trim() -replace '\s+', ' ') # Limpiar saltos de línea en descripción
        }
    } catch {}

    $newPluginEntry = [PSCustomObject]@{
        name       = $PluginName
        status     = $true
        description = $pluginDescription
        parameters = $pluginParameters
    }
    $pluginsList += $newPluginEntry
}

$updatedPluginsJsonString = $pluginsList | ConvertTo-Json -Depth 5 # Profundidad suficiente para parámetros anidados si los hubiera

$finalPluginsJsContent = $prefixContent + $updatedPluginsJsonString

# Verificar si el contenido original después del array JSON tenía algo más (ej. un punto y coma)
$suffixContent = $pluginsJsFullContent.Substring($jsonEndIndex + 1)
if ($suffixContent.Trim() -ne "") {
    $finalPluginsJsContent += $suffixContent
}


try {
    [System.IO.File]::WriteAllText($gamePluginsJsFilePath, $finalPluginsJsContent, (New-Object System.Text.UTF8Encoding($false)))
    Write-Log "'$gamePluginsJsFilePath' actualizado correctamente."
} catch {
    Write-Error "Error escribiendo los cambios a '$gamePluginsJsFilePath'."
    Write-Error $_.Exception.Message
    exit 1
}

Write-Log "¡Proceso completado! El plugin $PluginName debería estar instalado/actualizado en el juego."
Write-Log "Recuerda configurar tus claves API y otros detalles en '$ConfigFilePath' si aún no lo has hecho."
Write-Log "Si el juego no carga o muestra errores relacionados con plugins, revisa '$gamePluginsJsFilePath' manualmente."
Write-Log "Es posible que necesites ajustar el orden de $PluginName en esa lista si hay conflictos con otros plugins."

if ($Host.Name -eq "ConsoleHost") {
    Read-Host -Prompt "Presiona Enter para salir"
}
