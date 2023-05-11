import { useState, useEffect } from 'react'
import { getBucketByID } from 'lib/sanity.client'
import { Bucket } from 'lib/sanity.queries'
import { Head } from 'next/document'
import PageHead from './PageHead'
import Loading from './Loading'
import BackArrow from './BackArrow'
import Link from 'next/link'

export interface BucketPageProps {
  //   Bucket: Bucket

  id: string
}

export default function BucketPage({ id }: BucketPageProps) {
  const [Bucket, setBucket] = useState<Bucket>()

  useEffect(() => {
    if (id) {
      console.log('ID BEING PASSED', id)

      // Fetch data from API
      getBucketByID(id).then((resp) => {
        console.log(resp)
        setBucket(resp)
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
      {Bucket ? (
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

          {Bucket.title}
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}
