$OUT="prez.html"

pandoc --verbose prez.md --to=revealjs --standalone --incremental -o $OUT -M revealjs-url=./reveal.js -M lang=hu
