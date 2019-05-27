#!/usr/bin/env bash

GITHUB_REPO="meca3"

echo "Generating documentation from sources"

for file in *.js
do
    filename=$(basename -- "$file")
    filename="${filename%.*}"
    jsdoc2md ${file}> ${GITHUB_REPO}.wiki/${filename}.md
done

rm ${GITHUB_REPO}.wiki/main.md

echo "Successfully generated documentation"