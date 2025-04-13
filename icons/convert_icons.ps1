# ImageMagick installation path
$imagemagickPath = "C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\magick.exe"

# Check if ImageMagick exists at the specified path
if (-not (Test-Path $imagemagickPath)) {
    Write-Host "ImageMagick not found at: $imagemagickPath"
    Write-Host "Please verify the installation path or install ImageMagick from: https://imagemagick.org/script/download.php"
    exit 1
}

$sizes = @(
    @{name="icon-19.png"; size=19},
    @{name="icon-38.png"; size=38},
    @{name="icon-48.png"; size=48},
    @{name="icon-96.png"; size=96}
)

Write-Host "Starting icon conversion..."
Write-Host "Current directory: $PWD"

foreach ($size in $sizes) {
    & $imagemagickPath convert -background none -resize "$($size.size)x$($size.size)" icon.svg $size.name
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Created $($size.name) successfully"
    } else {
        Write-Host "Failed to create $($size.name)"
        exit 1
    }
}

Write-Host "Icon conversion complete!" 