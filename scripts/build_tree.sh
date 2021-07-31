#!/usr/bin/env bash

# -- Standard Header --
set -e
echoerr() { printf "%s\n" "$*" >&2; }

# -- Script --
npm install
REACT_APP_INTEGRATIONS_FEED_URL=https://manage.fusebit.io/feed/integrationsFeed.json \
  REACT_APP_CONNECTORS_FEED_URL=https://manage.fusebit.io/feed/connectorsFeed.json \
  npm run build
