#!/bin/sh
# usage: sh getpdf.sh 11703 [11026 ...]
mkdir -p pdfs txt
for id in "$@"; do
  dir=$((id / 100))
  if [ ! -s "pdfs/$id.pdf" ]; then
    curl -s -m 30 -o "pdfs/$id.pdf" "https://onlinejudge.org/external/$dir/$id.pdf"
  fi
  if [ -s "pdfs/$id.pdf" ]; then
    pdftotext -layout "pdfs/$id.pdf" "txt/$id.txt" 2>/dev/null
    printf '%s: %s bytes\n' "$id" "$(wc -c < txt/$id.txt)"
  else
    printf '%s: FAILED\n' "$id"
  fi
done
