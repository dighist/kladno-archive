import requests
import json
import os
import base64

# Replace these with your project-specific values
SANITY_PROJECT_ID = 'ku7c6o27'
SANITY_DATASET = 'production'
SANITY_TOKEN = 'sktK1vtVF280yXpcvtuS5tQea5KzUYmVspmiF5PNl374C5D9J6KYG96P5Jf1lzXCWnyTh2c0INg5d5XnA0gtO7edymv3teVucuDQqufuhQTxeQuwyM69ABXAkajQKpEL7VSsbaESOPgzwSCXL0oQ48v0ZYAfhDPzIbPcXjn7sQbbH3KU7Xw3'  # Be careful to keep this secret!

SANITY_API_BASE = f'https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07'
ASSET_ENDPOINT = f'{SANITY_API_BASE}/data/mutate/{SANITY_DATASET}'
DOCUMENT_ENDPOINT = f'{SANITY_API_BASE}/data/mutate/{SANITY_DATASET}'

headers = {
    'Authorization': f'Bearer {SANITY_TOKEN}',
    'Content-Type': 'application/json',
}

# folder structure
# python
#   caseFilesV2.py
#   KLID Sanity Cases
#       1375_Marie Moderová_Oú Kladno_Karton_1451_Sign._17-2M
#           1451_17-2M_1.jpg
#           Marie Moderova (1)
#           Marie Moderova (2)
#               Marie Moderova (10).jpg
#   data.json

"""
in data.json[2]['data'] there is a list of all case metadata
example:

     {
        "KLID": "1757",
        "KLautocode": "1628",
        "KLLastName": "Moderová",
        "KLFirstName": "Marie",
        "KLGender": "F",
        "KLProfessionRaw": "",
        "KLProfessionClustered": "",
        "KLResidenceRaw": "Kladno Eichen 218",
        "KLResidenceCZ": "Kladno město",
        "KLCriminalChargesFrom": "Deutsche Gen.Kladno",
        "KLCriminalChargesDateIN": "04.02.1944",
        "KLCriminalChargesDateCaseworker": "05.02.1944",
        "KLCriminalActionOffence": "Neoprávněný odběr zboží",
        "KLCriminalActionParagraph": "§10 vyhl.213/39Sb.",
        "KLPenaltyNoticeDate": "29.02.1944",
        "KLFine": "5000",
        "KLPrisonSentence": "6W",
        "KLPublicationPress": "",
        "KLFinePaid": "13.03.1944",
        "KLCriminalChargesFromClear": "Deu Gen Kladno",
        "KLCriminalChargesDEU": "Deutsche Polizei",
        "KLCriminalChargesDEUclustered": "Deutsche Polizei",
        "KLCriminalActionOffenceClustered": "Kauf ohne Karten",
        "KLCriminalChargesDateINSort": "1944-02-04",
        "KLPenaltyNoticeDateSort": "1944-02-29",
        "KLFinePaidSort": "1944-03-13",
        "KLBooksABC": "A"
      },
"""

# # given a person's first and last name, return the corresponding 'KLID'
# def get_klid(first_name, last_name):
#     with open('KladnoNEW.json') as f:
#         data = json.load(f)
#     for case in data[2]['data']:
#         # convert special characters to alphanumeric characters for comparison
#         first_name = first_name.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ů', 'u').replace('ý', 'y')
#         last_name = last_name.replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ů', 'u').replace('ý', 'y')

#         case_first_name = case['KLFirstName'].replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ů', 'u').replace('ý', 'y')
#         case_last_name = case['KLLastName'].replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace('ů', 'u').replace('ý', 'y')

#         if case_first_name == first_name and case_last_name == last_name:
#             print("✅ klid", case['KLID'], first_name, last_name)
#             return case['KLID']
        
#     print("❌ klid not found", case_first_name, first_name, "\n", case_last_name, last_name)
#     return None



# Upload an image
def upload_image(image_path):
    with open(image_path, "rb") as image_file:
        binary_data = image_file.read()

    headers = {
        "Authorization": f"Bearer {SANITY_TOKEN}",
        "Content-Type": "image/jpeg"
    }   

    # name of the file in the sanity dataset
    filename = image_path.split('/')[-1]

    # payload for the POST request
    payload = {
        "originalFilename": filename,
        "label": filename,
        "title": filename,
        "description": filename,
        "filename": filename,
    }

    # sanity url 
    # example for uploading images: myProjectId.api.sanity.io/v2021-06-07/assets/images/myDataset
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/assets/images/{SANITY_DATASET}"

    # Send the POST request to the Sanity API
    response = requests.post(url, headers=headers, data=binary_data, json=payload)

    # Check the response
    if response.status_code == 200:
        print("Image successfully uploaded!", filename)
    else:
        print(f"🚫 Image upload failed with status code {response.status_code}.")


    return response.json()['document']['_id']

"""
create a caseFileDocument following the sanity schema in sanity:
{
    defineField({
      name: 'images',
      title: 'Images',
      description: 'Images of the document',
      type: 'array',
      of: [
        {
          type: 'image',
        },
      ],
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    _id,
     defineField({
      name: 'originalFilename',
      title: 'Original Filename',
      description: 'The original filename of the scan from Dropbox',
      type: 'string',
      readOnly: true,
    }),

"""
def create_case(item_path, image_ids, folder_ix, klid):

    # title should be the name of the folder
    title = item_path.split('/')[-1]    
    case_id = f'case-{klid}-doc-{folder_ix}'

    headers = {
        "Authorization": f"Bearer {SANITY_TOKEN}",
        "Content-Type": "application/json"
    }   

    payload = {
        'mutations': [
            {
                'create': {
                    '_type': 'caseFileDocument',
                    'images': make_images_field(image_ids),
                    'title': title,
                    '_id': case_id,
                    'originalFilename': item_path,
                },
            },
        ],
    }
    print("Payload to make the new case", payload, "\n\n")
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/{SANITY_DATASET}"

    response = requests.post(url, headers=headers, data=json.dumps(payload))

    # Check the response
    if response.status_code == 200:
        print("✅ Case successfully created!")
    else:
        print(f"🚫 Case creation failed with status code {response.status_code}.")
    
    print(response.json(), "\n\n")

    return case_id


"""
make image field in caseFileDocument
should follow sanity schema:
defineField({
      name: 'images',
      title: 'Images',
      description: 'Images of the document',
      type: 'array',
      of: [
        {
          type: 'image',
        },
      ],
    }),

i get the error

    
""" 
def make_images_field(image_ids):
    images_field = []
    for (ix, image_id) in enumerate(image_ids):
        images_field.append({
            '_type': 'image',
            'asset': {
                '_type': 'reference',
                '_ref': image_id,
                
            },
            '_key': image_id
        })
    return images_field

"""
Add a caseFileDocument to a caseFile list of documents
should follow sanity schema for caseFiles:

 defineField({
      name: 'documents',
      title: 'Case Documents',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseFileDocument' }] }],
    }),
"""
def add_caseFileDocument_to_case(case_id, caseFileDocument_id):

    ### NOTE: you cannot add a caseFileDocument to a caseFile list of documents in one request
    ### you have to make a request to get the current list of documents, then add the new document to the list, then make a request to update the list

    # Fetch the existing document
    fetch_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/{SANITY_DATASET}"
    fetch_query = f"*[_id == '{case_id}']"
    fetch_headers = {
        'Content-type': 'application/json',
        'Authorization': f'Bearer {SANITY_TOKEN}'
    }
    fetch_response = requests.get(fetch_url, headers=fetch_headers, params={"query": fetch_query})

    if fetch_response.status_code != 200:
        print("Failed to fetch the document")
        exit(1)

    print(fetch_response.json())
    document = fetch_response.json()["result"][0]
    existing_documents = document.get("documents", [])

    # Add your new document to the existing ones
    new_document = {
        "_key": caseFileDocument_id,
        "_type": "reference",
        "_ref": caseFileDocument_id
    }
    existing_documents.append(new_document)

    # Update the document with the new list of documents
    update_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/{SANITY_DATASET}"
    update_headers = {
        'Content-type': 'application/json',
        'Authorization': f'Bearer {SANITY_TOKEN}'
    }
    update_data = {
        "mutations": [
            {
                "patch": {
                    "id": case_id,
                    "set": {
                        "documents": existing_documents
                    }
                }
            }
        ]
    }
    update_response = requests.post(update_url, headers=update_headers, data=json.dumps(update_data))

    if update_response.status_code != 200:
        print("Failed to update the document")
    else:
        print("✅ Successfully updated the document")
    


# iterate over all cases
SANITY_CASES_FILE_PATH = 'KLID Sanity Cases'          

for case in os.listdir(SANITY_CASES_FILE_PATH)[:1]:
    print()
    print("☀️☀️ ------- case", case, "------- ☀️☀️")
    print()

    # get all items in a case
    case_path = os.path.join(SANITY_CASES_FILE_PATH, case)
    for (item_ix, item) in enumerate(os.listdir(case_path)):
        klid = case.split('_')[0]

        # if item is a folder, iterate over all images in the folder, 
        # create a caseFileDocument with all the images
        item_path = os.path.join(case_path, item)
        if os.path.isdir(item_path):
            image_ids = []


            for ix, image in enumerate(os.listdir(item_path)):
                image_path = os.path.join(item_path, image)
                print(f"Uploading image {ix + 1} of {len(os.listdir(item_path))}")
                image_id = upload_image(image_path)
                image_ids.append(image_id)

            # create a caseFileDocument with all the images
            case_file_id = create_case(item_path, image_ids, item_ix, klid)

        # if item is an image, create a caseFileDocument with the image
        elif os.path.isfile(item_path):
            image_id = upload_image(item_path)

            case_file_id = create_case(item_path, [image_id], item_ix)

        # add the caseFileDocument to the caseFile list of documents
        case_id = f'case-{klid}'
        case_file_id = f'case-{klid}-doc-{item_ix}'
        add_caseFileDocument_to_case(case_id, case_file_id)

            

        
    