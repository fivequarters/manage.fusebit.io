#!/usr/bin/env bash

# -- Standard Header --
set -e
echoerr() { printf "%s\n" "$*" >&2; }

# -- Script --
OPS_PROFILE_NAME=`echo ${SECRET_FUSEBIT_PROFILE} | jq -r '.ops.profileName'`
OPS_PROFILE=`echo ${SECRET_FUSEBIT_PROFILE} | jq -r '.ops.settings.profiles["'${OPS_PROFILE_NAME}'"]'`

echoerr "Creating ~/.aws/config"
mkdir ~/.aws
echo "[default]" > ~/.aws/config
echo "region = us-west-2" >> ~/.aws/config

echoerr "Creating ~/.aws/credentials"
echo "[default]" > ~/.aws/credentials
echo "aws_access_key_id = `echo ${OPS_PROFILE} | jq -r '.awsAccessKeyId'`" >> ~/.aws/credentials
echo "aws_secret_access_key = `echo ${OPS_PROFILE} | jq -r '.awsSecretAccessKey'`" >> ~/.aws/credentials
