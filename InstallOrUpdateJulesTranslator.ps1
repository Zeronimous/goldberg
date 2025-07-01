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
    if ($script:config -and $script:config.scriptSettings.verboseLogging -ne $true -and $Level -eq "DEBUG") {
        # No mostrar DEBUG si verboseLogging no está activo
    } else {
        # Futura escritura a archivo de log si se desea
    }
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
        $gamePath = $null # Reset para que el bucle continúe
    }
}

# Determinar la ruta base de los assets del juego (www o raíz)
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
    Write-Error "Asegúrate de que la ruta es la carpeta raíz del juego RPG Maker (la que contiene Game.exe o index.html)."
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
    Copy-Item -Path $LocalPluginFolderPath -Destination $destinationPluginFolder -Recurse -Force -ErrorAction Stop
    Write-Log "Copiada carpeta '$PluginFolderName' a '$destinationPluginFolder'."
} catch {
    Write-Error "Error copiando los archivos del plugin al directorio del juego."
    Write-Error $_.Exception.Message
    exit 1
}

# --- 4. Leer y Modificar plugins.js ---
Write-Log "Modificando '$gamePluginsJsFilePath'..."
$pluginsJsContent = Get-Content -Raw -Path $gamePluginsJsFilePath -ErrorAction SilentlyContinue
if (-not $pluginsJsContent) {
    Write-Error "No se pudo leer '$gamePluginsJsFilePath'."
    exit 1
}

# Guardar y remover las líneas var RPGMaker... si existen (común en MV)
$rpgMakerVarLines = ""
if ($pluginsJsContent.StartsWith("var RPGMakerName")) {
    $lines = $pluginsJsContent -split [System.Environment]::NewLine
    $jsonStartIndex = 0
    for ($i = 0; $i -lt $lines.Length; $i++) {
        if ($lines[$i].TrimStart().StartsWith("[")) {
            $jsonStartIndex = $i
            break
        }
        $rpgMakerVarLines += $lines[$i] + [System.Environment]::NewLine
    }
    $pluginsJsonString = $lines[$jsonStartIndex..($lines.Length -1)] | Out-String
} else {
    $pluginsJsonString = $pluginsJsContent
}

$pluginsList = $null
try {
    $pluginsList = $pluginsJsonString | ConvertFrom-Json -ErrorAction Stop
} catch {
    Write-Error "Error parseando '$gamePluginsJsFilePath'. Asegúrate de que su contenido JSON es válido (después de las líneas 'var RPGMaker...')."
    Write-Error $_.Exception.Message
    exit 1
}

if ($null -eq $pluginsList -or $pluginsList.GetType().Name -ne "Object[]") {
     Write-Error "El contenido de '$gamePluginsJsFilePath' no parece ser un array de plugins JSON válido."
     exit 1
}

$pluginEntry = $pluginsList | Where-Object { $_.name -eq $PluginName } | Select-Object -First 1

if ($pluginEntry) {
    Write-Log "Plugin '$PluginName' encontrado en plugins.js. Actualizando parámetros..."
    $pluginEntry.status = $true # Asegurar que esté activo
    $pluginEntry.parameters = $pluginParameters
} else {
    Write-Log "Plugin '$PluginName' no encontrado en plugins.js. Añadiendo nueva entrada..."
    $pluginDescription = "Provides automatic and manual translation capabilities for RPG Maker MV/MZ games." # Tomar de @plugindesc
    # Intentar extraer la descripción del archivo .js del plugin
    try {
        $jsContent = Get-Content $LocalPluginJsPath -ErrorAction SilentlyContinue
        if ($jsContent -match "(?s)\* @plugindesc (.*?)\n") {
            $pluginDescription = $Matches[1].Trim()
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

# Convertir de nuevo a JSON
# Para MV, el JSON es compacto. Para MZ, es indentado.
# ConvertTo-Json por defecto indenta. Para MV, podríamos necesitar -Compress si causa problemas,
# pero usualmente MV también puede leer JSON indentado.
# El formato estándar de plugins.js de MV es una sola línea después de las variables RPGMaker.
# El formato de MZ es un JSON indentado.
# Intentaremos -Compress para MV y formato indentado para MZ.
# Sin embargo, la robustez es más importante que el formato exacto si el motor lo lee bien.
# Por ahora, usaremos el formato por defecto de ConvertTo-Json (indentado).
# Si es estrictamente necesario un formato compacto para MV, se podría hacer:
# $updatedPluginsJsonString = $pluginsList | ConvertTo-Json -Compress
$updatedPluginsJsonString = $pluginsList | ConvertTo-Json -Depth 5


# Re-añadir las líneas var RPGMaker...
$finalPluginsJsContent = $rpgMakerVarLines + $updatedPluginsJsonString

try {
    # Guardar con codificación UTF-8 sin BOM, que es lo común para estos archivos.
    [System.IO.File]::WriteAllLines($gamePluginsJsFilePath, $finalPluginsJsContent, (New-Object System.Text.UTF8Encoding($false)))
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

# Pausa opcional para que el usuario vea la salida antes de que la ventana se cierre si se ejecuta haciendo doble clic.
if ($Host.Name -eq "ConsoleHost") {
    Read-Host -Prompt "Presiona Enter para salir"
}
