import { useState, useEffect } from 'react'
import { getAnnouncementByID } from 'lib/sanity.client'
import { Announcement } from 'lib/sanity.queries'
import { Head } from 'next/document'
import PageHead from './PageHead'
import Loading from './Loading'
import BackArrow from './BackArrow'
import Link from 'next/link'

export interface AnnouncementPageProps {
  //   Announcement: Announcement

  id: string
}

export default function AnnouncementPage({ id }: AnnouncementPageProps) {
  const [Announcement, setAnnouncement] = useState<Announcement>()

  useEffect(() => {
    if (id) {
      console.log('ID BEING PASSED', id)

      // Fetch data from API
      getAnnouncementByID(id).then((resp) => {
        console.log(resp)
        setAnnouncement(resp)
      })
    }
  }, [id])

  const formatDate = (date: string) => {
    const dateObj = new Date(date)

    const month = dateObj.toLocaleString('default', { month: 'long' })
    const day = dateObj.getDate()
    const year = dateObj.getFullYear()

    return `${month} ${day}, ${year}`
  }

  return (
    <>
      <PageHead />
      {Announcement ? (
        <div className="h-screen w-full overflow-scroll bg-dark p-4">
          <Link
            href="/"
            className="fixed left-4 top-4 flex items-center  hover:cursor-pointer"
            passHref
          >
            <BackArrow />
            <span className="pl-2 text-head text-lightgrey hover:text-white">
              {' '}
              Kladno Archive
            </span>
          </Link>

          {Announcement.title}
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}
