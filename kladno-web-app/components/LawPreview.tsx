import type { CaseFile, Post } from 'lib/sanity.queries'
import Link from 'next/link'
import caseFile from 'schemas/caseFile'

export default function LawPreview(props: { law: any }) {
  console.log(props.law)
  return (
    <div className="h-fit w-full  border border-semi-dark p-0 hover:border-lightgrey ">
      <Link
        href={`/laws/${props.law._id}`}
        passHref
        className=" hover:cursor-pointer "
      >
        <p className="px-2 pt-2 pb-1 font-serif text-md text-white">
          Law {props.law.title.split('-')[2]} ({props.law.title.split('-')[1]})
        </p>
        <div className="ml-2 mb-4 w-max rounded-full bg-semi-dark px-2 py-1">
          <p className="font-mono text-smmono text-dark">Law</p>
        </div>
        <hr className="border-semi-dark"></hr>

        <p className="px-2 py-3 font-mono text-sm text-white">
          Additional information about the law could go here.
        </p>
      </Link>
    </div>
  )
}
