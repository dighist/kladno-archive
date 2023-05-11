import type { CaseFile, Post } from 'lib/sanity.queries'
import Link from 'next/link'
import caseFile from 'schemas/caseFile'

export default function AnnouncementPreview(props: { announcement: any }) {
  return (
    <div className="h-fit w-full  border-2 border-semi-dark p-0 hover:border-lightgrey ">
      <Link
        href={`/announcements/${props.announcement._id}`}
        passHref
        className=" hover:cursor-pointer "
      >
        <p className="px-2 py-4 font-serif text-md text-white">
          Announcement {props.announcement.title.split('-')[2]},{' '}
          {props.announcement.title.split('-')[1]}
        </p>
        <hr className="border-1 border-semi-dark"></hr>

        <p className="px-2 py-4 font-mono text-sm text-white">
          Issued by {props.announcement.institutionFilePath}
        </p>
      </Link>
    </div>
  )
}
