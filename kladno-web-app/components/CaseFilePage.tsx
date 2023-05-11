import { getCaseFileByID } from 'lib/sanity.client'
import { CaseFile } from 'lib/sanity.queries'
import { Head } from 'next/document'
import Link from 'next/link'
import { useEffect,useState } from 'react'

import BackArrow from './BackArrow'
import CaseFileListSection from './CaseFileListSection'
import KladnoHeader from './KladnoHeader'
import Loading from './Loading'
import PageHead from './PageHead'

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
        <div className="h-screen w-full overflow-scroll bg-dark p-4 pb-4 pt-2.5">
          <KladnoHeader />

          <div className="mt-9 text-lightgrey">
            <div className="text-md">
              {caseFile.personProsecuted.firstName}{' '}
              {caseFile.personProsecuted.lastName}
            </div>
            <div className="mt-2 mb-2 px-2 py-1 w-max rounded-full bg-semi-dark"><p className="font-mono text-smmono text-dark">Case</p></div>
            <Link
            href="/"
            className="hover:cursor-pointer"
            passHref
          >
            <BackArrow />
          </Link>
            {/* <div className="font-mono">
              Charge filed on {formatDate(caseFile.datePenalty)}
              <br />
              {caseFile.documents.length} Files
            </div> */}
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
