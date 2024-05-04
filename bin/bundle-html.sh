#!/usr/bin/env bash

set -e
cd "$(dirname "${BASH_SOURCE[0]}")"

echo Building docs...

mkdir -p ../docs

# shellcheck disable=SC2002
cat ../dist/web-crypto-api-test.html |
    awk '{if (/web-crypto-api-test.css/) { print "<style type=\\"text/css\\">"; system("cat ../dist/web-crypto-api-test.css"); print "</style>"} else {print}}' |
    awk '{if (/web-crypto-api-test.js/) { print "<script type=\\"text/javascript\\">"; system("cat ../dist/web-crypto-api-test.js"); print "</script>"} else {print}}' |
    awk '{if (/favicon.svg/) { printf("%s","<link rel=\\"icon\\" href=\\"data:image/svg+xml;base64,"); system("base64 --wrap=0 ../dist/favicon.svg"); print "\\"/>"} else {print}}' \
        >../docs/index.html
