#!/usr/bin/env bash

# -- Standard Header --
set -e
echoerr() { printf "%s\n" "$*" >&2; }

# -- App Version --
export REACT_APP_VERSION=$(node -p "require('../package.json').version")

# -- Script --
npm install
npm run build
