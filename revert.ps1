$content = Get-Content 'c:\Users\BIT\AntiGravity\styles.css' -Raw
$index = $content.IndexOf('/*                              PREMIUM CART UI                              */')
if ($index -ge 0) {
    # Move back a little bit to remove the line above
    $index = $content.LastIndexOf('/*', $index)
    if ($index -ge 0) {
        $content = $content.Substring(0, $index)
        Set-Content 'c:\Users\BIT\AntiGravity\styles.css' -Value $content
        Write-Output 'Reverted styles'
    }
}
