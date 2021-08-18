#!/usr/bin/env bash

# -- Standard Header --
echoerr() { printf "%s\n" "$*" >&2; }
export FUSEBIT_DEBUG=

# -- Optional Parameters --
AWS_PROFILE=${AWS_PROFILE:=default}

# -- Script --
set -e

aws --profile=${AWS_PROFILE} s3 sync --acl public-read --cache-control max-age=300 \
  ./build \
  s3://${S3_BUCKET}

aws --profile=${AWS_PROFILE} s3 cp --acl public-read --cache-control max-age=0 \
  build/index.html	\
  s3://${S3_BUCKET}/index.html

aws cloudfront create-invalidation --profile ${AWS_PROFILE} --distribution-id ${CLOUDFRONT_ID} --paths '/*'
