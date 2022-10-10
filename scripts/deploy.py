#!/usr/bin/env .venv/bin/python3

import subprocess
import json
import os

import boto3


BUCKET_ID = "md-asynts-com-45dea518-0c16-479b-9459-0c77c39a628e"
CREDENTIALS_PATH = "/home/me/.config/Scaleway/credentials.json"
BUILD_PATH = "./build"

def run(argv):
    completed_process = subprocess.run(argv)
    assert completed_process.returncode == 0

def connect_s3_resource():
    # Load access token from local file.
    with open(CREDENTIALS_PATH) as fp:
        credentials = json.load(fp)

    # Use the Paris server.
    return boto3.resource(
        service_name="s3",
        region_name="fr-par",
        endpoint_url="https://s3.fr-par.scw.cloud",
        aws_access_key_id=credentials["access_key"],
        aws_secret_access_key=credentials["secret_key"],
        config=None,
    )

def upload_build_dir(*, s3_bucket):
    for rootpath, _, filenames in os.walk(BUILD_PATH):
        for filename in filenames:
            filepath = os.path.join(rootpath, filename)
            key = os.path.relpath(filepath, BUILD_PATH)

            print(f"uploading: {key}")
            s3_bucket.upload_file(filepath, key)

run(["npm", "run", "build"])

s3_resource = connect_s3_resource()
s3_bucket = s3_resource.Bucket(BUCKET_ID)

upload_build_dir(s3_bucket=s3_bucket)
