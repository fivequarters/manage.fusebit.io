#!/usr/bin/env bash

# -- Standard Header --
echoerr() { printf "%s\n" "$*" >&2; }
export FUSEBIT_DEBUG=

# -- Optional Parameters --
AWS_PROFILE=${AWS_PROFILE:=default}

# -- Script --
set -e

aws --profile=${AWS_PROFILE} s3 sync --acl public-read \
  ./build \
  s3://manage.fusebit.io

aws --profile=${AWS_PROFILE} s3 cp --acl public-read --cache-control max-age=0 \
  build/index.html	\
  s3://manage.fusebit.io/index.html

