import requests
import json
import os
import base64

# Replace these with your project-specific values
SANITY_PROJECT_ID = 'ku7c6o27'
SANITY_DATASET = 'production'
SANITY_TOKEN = 'sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3'  # Be careful to keep this secret!


case_id = "case-2346"

# Fetch the existing document
fetch_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/{SANITY_DATASET}"
fetch_query = f"*[_id == '{case_id}']"
# fetch_query = f"*[_type == 'caseFile']"
fetch_headers = {
    'Content-type': 'application/json',
    'Authorization': f'Bearer {SANITY_TOKEN}'
}
fetch_response = requests.get(fetch_url, headers=fetch_headers, params={"query": fetch_query})

if fetch_response.status_code != 200:
    print("Failed to fetch the document")
    exit(1)

print("\n\n\n")
print(fetch_response.json())
print("\n\n\n")
print(fetch_response.json().get('documents'))