import json
import os

"""
{
  "_id": "our_id",
  "_type": "caseFileDocument",
  "title": "Test Casefile document",
  "images": [
    {
      "_type": "image",
      "_sanityAsset": "image@file:///local/path/to/image.jpg"
    }
  ],
  "originalFilename": "KLID Sanity Cases/2346_Anna Ferdová_Oú Kladno_Karton_1447_Sign._17-2F/Anna Ferdová (1)"
},

{
  "_id": "case-2346",
  "_type": "caseFile",
  "documents": [
    {
      "_type": "reference",
      "_key": "caseFileDocument_id",
      "_ref": "caseFileDocument_id"
    }
  ],
  "originalFilename": "Anna Ferdová_Oú Kladno_Karton_1447_Sign._17-2F",
}
"""

SANITY_CASES_FILE_PATH = 'KLID Sanity Cases'   

cases = os.listdir(SANITY_CASES_FILE_PATH)
cases = [case for case in cases if ".DS_Store" not in case]

output_jsons = []

for case in cases:

    case_path = os.path.join(SANITY_CASES_FILE_PATH, case)
    case_documents = os.listdir(case_path)
    case_documents = [cd for cd in case_documents if '.DS_Store' not in cd]

    case_documents_jsons = []
    for (item_ix, item) in enumerate(case_documents):

        klid = case.split('_')[0]

        # if item is a folder, iterate over all images in the folder, 
        # create a caseFileDocument with all the images
        item_path = os.path.join(case_path, item)
        if os.path.isdir(item_path):
            image_ids = []

            images = os.listdir(item_path)
            images = [img for img in images if ".DS_Store" not in img]

            image_jsons = []
            for ix, image in enumerate(images):
                image_path = os.path.join(item_path, image)

                image_path = image_path.replace(' ', '%20')
                # full path to image
                # print(image_path)
                # print(image)
                full_path = "/Users/trudypainter/Desktop/DigitalHistory/kladno-web-app/" + image_path
                # print(full_path)
                # print("\n\n")

                # create json for image
                image_json = {
                    "_id": f"case-{klid}-doc-{item_ix+1}-img-{ix+1}",
                    "assetId": f"case-{klid}-doc-{item_ix+1}-img-{ix+1}",
                    "originalFilename": image,
                    "_type": "image",
                    "_sanityAsset": f"image@file://{full_path}"
                }
                image_jsons.append(image_json)

            # create json for caseFileDocument
            caseFileDocument_json = {
                "_id": f"case-{klid}-doc-{item_ix+1}",
                "_type": "caseFileDocument",
                "title": f"Case {klid} Document {item_ix+1}",
                "images": image_jsons,
                "originalFilename": item_path
            }
            case_documents_jsons.append(caseFileDocument_json)
            output_jsons.append(caseFileDocument_json)     


        # if item is an image, create a caseFileDocument with the image
        elif os.path.isfile(item_path):
            filename = item_path.split('/')[-1]

            # encode format of image to handle spaces
            item_path = item_path.replace(' ', '%20')

            # full path to image
            full_path = "/Users/trudypainter/Desktop/DigitalHistory/kladno-web-app/" + item_path

            print(full_path)

            caseFileDocument_json = {
                "_id": f"case-{klid}-doc-{item_ix+1}",
                "_type": "caseFileDocument",
                "title": f"Case {klid} Document {item_ix+1}",
                "images": [
                    {
                    "_id": f"case-{klid}-doc-{item_ix+1}-img-{ix+1}",
                    "assetId": f"case-{klid}-doc-{item_ix+1}",
                    "originalFilename": filename,
                    "_type": "image",
                    "_sanityAsset": f"image@file://{full_path}"
                    }
                ],
                "originalFilename": item_path
            }
            case_documents_jsons.append(caseFileDocument_json)
            output_jsons.append(caseFileDocument_json)


    # create references to all caseFileDocuments
    case_doc_refs = []
    for cdj in case_documents_jsons:
        case_doc_refs.append({
            "_type": "reference",
            "_key": cdj["_id"],
            "_ref": cdj["_id"]
        })
            
    # create json for caseFile
    caseFile_json = {
        "_id": f"case-{klid}",
        "_type": "caseFile",
        "documents": case_doc_refs,
        "originalFilename": case_path
    }
    output_jsons.append(caseFile_json)

# # remove json objects with duplicate _id
# output_jsons = [dict(t) for t in {tuple(d.items()) for d in output_jsons}]
# output_jsons = [d for d in output_jsons if "_id" in d]


# Open a file for writing
with open('sanity_cases.ndjson', 'w') as f:
    # Write each dictionary as a JSON object separated by a newline character
    for item in output_jsons:
        f.write(json.dumps(item) + '\n')

print("Done!")