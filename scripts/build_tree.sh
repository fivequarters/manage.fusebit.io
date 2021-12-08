#!/usr/bin/env bash

# -- Standard Header --
set -e
echoerr() { printf "%s\n" "$*" >&2; }

# -- Add Version Variable --
export REACT_APP_VERSION=$(cat package.json | jq -r .version)

# -- Script --
npm install
npm run build
