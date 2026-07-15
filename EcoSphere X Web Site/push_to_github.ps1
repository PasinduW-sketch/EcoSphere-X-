# EcoSphere X - Direct GitHub API Uploader Utility
# Use this when Git is not installed on the system PATH

$owner = "PasinduW-sketch"
$repo = "EcoSphere-X-"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       EcoSphere X - GitHub Direct API Uploader" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "This utility will upload index.html, app.js, assets, and"
Write-Host "server files directly to the GitHub repository:"
Write-Host "https://github.com/$owner/$repo" -ForegroundColor Green
Write-Host ""

# Request GitHub PAT (Personal Access Token) securely
$token = Read-Host -Prompt "Enter your GitHub Personal Access Token (PAT) with 'repo' write permissions"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "Error: Token cannot be empty. Script terminated." -ForegroundColor Red
    exit
}

# Get list of files in the current folder, excluding this script and node_modules if any
$files = Get-ChildItem -Path . -File -Recurse | Where-Object { 
    $_.Name -ne "push_to_github.ps1" -and 
    $_.FullName -notlike "*\.git\*" -and
    $_.FullName -notlike "*\node_modules\*"
}

$headers = @{
    "Authorization" = "token $token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "PowerShell-GitHub-Uploader"
}

Write-Host ""
Write-Host "Found $($files.Count) files to push. Uploading now..." -ForegroundColor Yellow
Write-Host "----------------------------------------------------------"

foreach ($file in $files) {
    # Resolve path relative to current directory
    $relativePath = Resolve-Path $file.FullName -Relative
    
    # Standardize path format for GitHub API (forward slashes, remove leading dot-slash)
    $cleanPath = $relativePath -replace "^\.\\", "" -replace "^\./", ""
    $githubPath = $cleanPath -replace "\\", "/"
    
    Write-Host "Uploading: $githubPath ... " -NoNewline
    
    try {
        # Read file bytes and encode to Base64
        $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $base64Content = [Convert]::ToBase64String($bytes)
        
        # Check if the file already exists in the repo to fetch its SHA (required for file updates)
        $url = "https://api.github.com/repos/$owner/$repo/contents/$githubPath"
        $sha = $null
        try {
            $existingFile = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -ErrorAction SilentlyContinue
            $sha = $existingFile.sha
        } catch {
            # File does not exist yet (expected for new uploads)
        }
        
        # Construct GitHub Request Body
        $body = @{
            message = "Upload $githubPath via CMC Operations API console"
            content = $base64Content
        }
        if ($sha) {
            $body.sha = $sha
        }
        
        $jsonBody = ConvertTo-Json $body
        
        # Send PUT request to create/update file
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Put -Body $jsonBody -ContentType "application/json"
        
        Write-Host "SUCCESS" -ForegroundColor Green
    } catch {
        Write-Host "FAILED" -ForegroundColor Red
        Write-Host "Error details: $_" -ForegroundColor DarkRed
    }
}

Write-Host "----------------------------------------------------------"
Write-Host "Direct API upload complete!" -ForegroundColor Green
Write-Host "Check your repository at: https://github.com/$owner/$repo" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
