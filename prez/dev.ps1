$OUT="prez.html"
$CMD="pwsh ./build.ps1"

$CMD

live-server --open="$OUT" --watch="$OUT" &

watchexec --verbose -e=md -- "$CMD"
