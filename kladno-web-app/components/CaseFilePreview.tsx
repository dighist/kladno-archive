import type { CaseFile, Post } from 'lib/sanity.queries'
import Link from 'next/link'
import caseFile from 'schemas/caseFile'

export default function CaseFilePreview(props: { case: any }) {
  console.log(props.case)
  return (
    <div className="h-fit w-full border border-semi-dark p-0 hover:border-lightgrey ">
      <Link
        href={`/casefiles/${props.case._id}`}
        passHref
        className=" hover:cursor-pointer "
      >
        <p className="px-2 pt-2 pb-1 font-serif text-md text-white">
          {props.case.personProsecuted.firstName}{' '}
          {props.case.personProsecuted.lastName}
        </p>
        <div className="ml-2 mb-4 w-max rounded-full bg-semi-dark px-2 py-1">
          <p className="font-mono text-smmono text-dark">Case</p>
        </div>

        <hr className="border-semi-dark"></hr>

        <p className="px-2 py-3 font-mono text-sm text-white">
          This is where information about the case could go.
        </p>

        <hr className="border-semi-dark"></hr>

        <img src={props.case.documents[0][0].image}></img>

        <hr className="border-semi-dark"></hr>

        {props.case.documents && (
          <div className="flex w-full flex-wrap pl-2 pt-1 pb-3">
            {props.case.documents.map((scan) => (
              <div className="mr-2 mt-2 h-2 w-2 rounded-full bg-semi-dark">
                {' '}
              </div>
            ))}
          </div>
        )}
      </Link>
    </div>
  )
}
