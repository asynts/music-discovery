#!/bin/bash
set -e

~/dev/scripts/backup.rb \
    --name "music-discovery" \
    --url "git@github.com:asynts/music-discovery" \
    --upload "s3://backup.asynts.com/git/music-discovery"
