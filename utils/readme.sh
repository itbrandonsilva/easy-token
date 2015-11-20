#!/bin/bash

cat README_HEADER.md > README.md;
cat ../examples/express/main.js | sed 's/^/    /' >> README.md;
printf '  \n# Documentation  \n' >> README.md;
jsdoc -X ../src | node /usr/local/bin/jsdoc-transformer.js >> README.md;
mv README.md ..;
