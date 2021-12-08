#!/usr/bin/env bash

VERSION=$(cat package.json | jq .version)

git tag ${VERSION} || true

git push --tags --no-verify || true