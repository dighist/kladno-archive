import { useState, useEffect } from 'react'
import { getLawByID } from 'lib/sanity.client'
import { Law } from 'lib/sanity.queries'
import { Head } from 'next/document'
import PageHead from './PageHead'
import Loading from './Loading'
import BackArrow from './BackArrow'
import Link from 'next/link'
import { Document, Page } from 'react-pdf'

export interface LawPageProps {
  //   Law: Law

  id: string
}

export default function LawPage({ id }: LawPageProps) {
  const [law, setLaw] = useState<Law>()

  useEffect(() => {
    if (id) {
      console.log('ID BEING PASSED', id)

      // Fetch data from API
      getLawByID(id).then((resp) => {
        console.log(resp)
        setLaw(resp)
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

  const [numPages, setNumPages] = useState(null)
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <>
      <PageHead />
      {law ? (
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

          <div className="my-24 mt-32 text-lightgrey">
            <div className="text-head">
              Law {law.title.split('-')[2]} ({law.title.split('-')[1]})
            </div>
            <div className="font-mono">
              Charge filed on {formatDate(law.dateAnnounced)}
              <br />
              Issued by {law.institutionIssuedBy}
            </div>
          </div>

          <div className="my-24 mt-32 text-lightgrey">
            <a href={law.pdf} download target="_blank">
              Download PDF
            </a>

            <Document file={law.pdf} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}
