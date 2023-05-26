import requests
import json

# Sanity configuration
# Replace these with your project-specific values
PROJECT_ID = 'ku7c6o27'
DATASET = 'production'
TOKEN = 'sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3'  # Be careful to keep this secret!


# Sanity API URLs
SANITY_API_URL = f'https://{PROJECT_ID}.api.sanity.io/v1'
SANITY_QUERY_URL = f'{SANITY_API_URL}/data/query/{DATASET}'
SANITY_MUTATE_URL = f'{SANITY_API_URL}/data/mutate/{DATASET}'

# Sanity API headers
HEADERS = {
    'Authorization': f'Bearer {TOKEN}',
}

# Step 1: Fetch the documents of the type 'caseFileDocument'
query = '*[_type == "caseFileDocument"]'
params = {'query': query}
response = requests.get(SANITY_QUERY_URL, params=params, headers=HEADERS)
case_file_documents = response.json()['result']

# Step 2: Fetch the documents of the type 'case'
query = '*[_type == "caseFile"]'
params = {'query': query}
response = requests.get(SANITY_QUERY_URL, params=params, headers=HEADERS)
cases = response.json()['result']

# print the number of documents
print(f'Found {len(case_file_documents)} case file documents')
print(f'Found {len(cases)} cases')
print()

# Step 2: Update 'case' documents to remove references to 'caseFileDocument' documents
for case in cases:
    # Assuming 'caseFileDocuments' is a field in 'case' that contains the references
    caseFileDocumentsRefs = case['documents']

    print(f'Found {len(caseFileDocumentsRefs)} caseFileDocumentsRefs')
    
    # Filter out references to 'caseFileDocument' documents
    updatedRefs = [ref for ref in caseFileDocumentsRefs if ref['_ref'] not in [doc['_id'] for doc in case_file_documents]]

    # Update the 'case' document
    mutations = {
        'mutations': [
            {
                'patch': {
                    'id': case['_id'],
                    'set': {
                        'documents': []
                    }
                }
            }
        ]
    }
    response = requests.post(SANITY_MUTATE_URL, headers=HEADERS, data=json.dumps(mutations))
    if response.status_code != 200:
        print(f'Error updating case document: {response.json()}')
    else:
        print(f'✅ Updated case document: {case["_id"]}')

print("☀️ --------- About to start deleting caseFileDocuments ----------")
# Step 3: Delete the 'caseFileDocument' documents and their associated assets
for doc in case_file_documents:
    try:
        image_ref = doc['scan']['asset']['_ref']
    except:
        image_ref = None
        print("🚨 image_ref not found for", doc['_id'])

    # Delete the document
    mutations = {
        'mutations': [
            {
                'delete': {
                    'id': doc['_id']
                }
            },
            # {
            #     'delete': {
            #         'id': image_ref
            #     }
            # }
        ]
    }
    response = requests.post(SANITY_MUTATE_URL, headers=HEADERS, data=json.dumps(mutations))
    if response.status_code != 200:
        print(f'Error deleting document or asset: {response.json()}')
    else:
        print(f'✅ Deleted document: {doc["_id"]}')

