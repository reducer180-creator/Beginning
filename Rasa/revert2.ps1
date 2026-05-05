$content = Get-Content 'c:\Users\BIT\AntiGravity\styles.css' -Raw
$index = $content.IndexOf('/*                              CART BUTTON STYLES                           */')
if ($index -ge 0) {
    $index = $content.LastIndexOf('/*', $index)
    if ($index -ge 0) {
        $content = $content.Substring(0, $index)
        Set-Content 'c:\Users\BIT\AntiGravity\styles.css' -Value $content
        Write-Output 'Removed duplicate styles'
    }
}
