#!/bin/sh
set -e

OUT="dev.html"
CMD="pandoc --verbose *.md --to=revealjs --standalone --incremental -o $OUT"

$CMD

live-server --open="$OUT" --watch="$OUT" &

watchexec --verbose -e=md -- "$CMD"
