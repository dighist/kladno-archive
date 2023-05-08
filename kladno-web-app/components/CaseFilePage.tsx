import { useState, useEffect } from 'react'
import { getCaseFileByID } from 'lib/sanity.client'
import { CaseFile } from 'lib/sanity.queries'
import { Head } from 'next/document'
import PageHead from './PageHead'
import Loading from './Loading'
import BackArrow from './BackArrow'
import Link from 'next/link'
import CaseFileListSection from './CaseFileListSection'

export interface CaseFilePageProps {
  //   caseFile: CaseFile

  id: string
}

export default function CaseFilePage({ id }: CaseFilePageProps) {
  const [caseFile, setCaseFile] = useState<CaseFile>()

  useEffect(() => {
    if (id) {
      console.log('ID BEING PASSED', id)

      // Fetch data from API
      getCaseFileByID(id).then((resp) => {
        console.log(resp)
        setCaseFile(resp)
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
      {caseFile ? (
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
              {caseFile.personProsecuted.firstName}{' '}
              {caseFile.personProsecuted.lastName}
            </div>
            <div className="font-mono">
              Charge filed on {formatDate(caseFile.datePenalty)}
              <br />
              {caseFile.documents.length} Files
            </div>
          </div>

          <div className="my-sticky-div flex w-full justify-end">
            <div className="my-2 w-96 rounded-3xl border-[1.2px] border-white p-2 px-4">
              <input
                type="text"
                placeholder="Search"
                className=" bg-dark text-lightgrey caret-lightgrey focus:border-white focus:outline-none "
              />
            </div>
          </div>

          <hr className="h-[0.8px] bg-lightgrey"></hr>

          <CaseFileListSection caseFile={caseFile} />
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}
