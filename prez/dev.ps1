$OUT="dev.html"
$CMD="pandoc --verbose prez.md --to=revealjs --standalone --incremental -o $OUT"

$CMD

live-server --open="$OUT" --watch="$OUT" &

watchexec --verbose -e=md -- "$CMD"
