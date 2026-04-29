$outputFile = "allsource.md"
$extensions = @(".cs", ".js", ".vue", ".css", ".html")
$excludeDirs = @("\\bin\\", "\\obj\\", "\\node_modules\\", "\\dist\\", "\\\.vscode\\", "\\Migrations\\", "\\Properties\\", "\\\.git\\")
$excludeFiles = @("appsettings.json", "appsettings.Development.json", "package.json", "package-lock.json", "vite.config.js", "launchSettings.json")

if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

Write-Host "Đang quét file..."
$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $ext = $_.Extension
    $path = $_.FullName
    $name = $_.Name
    
    $isSource = $extensions -contains $ext
    $isNotExcludedDir = $true
    foreach ($dir in $excludeDirs) {
        if ($path -match $dir) {
            $isNotExcludedDir = $false
            break
        }
    }
    $isNotExcludedFile = $excludeFiles -notcontains $name
    
    $isSource -and $isNotExcludedDir -and $isNotExcludedFile
}

Write-Host "Đã tìm thấy $($files.Count) files. Bắt đầu gộp..."

foreach ($file in $files) {
    $relativePath = Resolve-Path -Relative $file.FullName
    $relativePath = $relativePath -replace "^\.\\", ""
    
    $ext = $file.Extension.TrimStart(".")
    $language = $ext
    if ($ext -eq "vue") { $language = "html" }
    elseif ($ext -eq "cs") { $language = "csharp" }
    elseif ($ext -eq "js") { $language = "javascript" }
    
    $header = "## File: $relativePath`n"
    $codeBlockStart = "```$language`n"
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    $codeBlockEnd = "`n````n`n"
    
    if ($null -ne $content) {
        Add-Content -Path $outputFile -Value ($header + $codeBlockStart + $content + $codeBlockEnd) -Encoding UTF8
    }
}

Write-Host "Hoàn tất! File đã được lưu tại $outputFile"