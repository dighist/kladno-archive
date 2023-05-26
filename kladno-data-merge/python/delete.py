import requests
import json
import os
import base64

# Replace these with your project-specific values
SANITY_PROJECT_ID = 'ku7c6o27'
SANITY_DATASET = 'production'
SANITY_TOKEN = 'sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3'  # Be careful to keep this secret!


case_doc_id = "case-2346-doc-1"
case_doc = "case-2346"

update_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/{SANITY_DATASET}"
update_headers = {
    'Content-type': 'application/json',
    'Authorization': f'Bearer {SANITY_TOKEN}'
}
update_data = {
    "mutations": [
        {
            "patch": {
                "id": case_doc,
                "set": {
                    "documents": []
                }

            }
        }
    ]
}
update_response = requests.post(update_url, headers=update_headers, data=json.dumps(update_data))

if update_response.status_code != 200:
    print("Failed to fetch the document")
    print(update_response.json())
    exit(1)

print("\n\n\n")
print(update_response.json())
