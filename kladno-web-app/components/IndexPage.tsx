import PageHead from 'components/PageHead'
import IntroTemplate from 'intro-template'
import * as demo from 'lib/demo.data'
import type { CaseFile, Post, Settings } from 'lib/sanity.queries'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import AnnouncementPreview from './AnnouncementPreview'
import CaseFilePreview from './CaseFilePreview'
import KladnoHeader from './KladnoHeader'
import LawPreview from './LawPreview'
import SearchBar from './Search'

export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  caseFiles: CaseFile[]
  settings: Settings
  announcements: any[]
  laws: any[]
}

export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, caseFiles, settings, laws, announcements } = props

  const [columnsData, setColumnsData] = useState<any[][]>([])
  const [filters, setFilters] = useState([])

  const [allElms, setAllElms] = useState<any[]>([])

  const calculateColumn = (columnsHeights: number[]): number => {
    let shortestColumnIndex = 0
    let minHeight = columnsHeights[0]

    for (let i = 1; i < columnsHeights.length; i++) {
      if (columnsHeights[i] < minHeight) {
        minHeight = columnsHeights[i]
        shortestColumnIndex = i
      }
    }

    return shortestColumnIndex
  }

  useEffect(() => {
    // filter case files based on filters
    let allFiles = []

    if (filters.length === 0) {
      allFiles = caseFiles.concat(laws).concat(announcements)
    } else {
      if (filters.includes('caseFiles')) {
        allFiles = allFiles.concat(caseFiles)
      }
      if (filters.includes('laws')) {
        allFiles = allFiles.concat(laws)
      }
      if (filters.includes('announcements')) {
        allFiles = allFiles.concat(announcements)
      }
    }

    // randomize order of all files
    allFiles.sort(() => Math.random() - 0.5)
    setAllElms(allFiles)
  }, [caseFiles, laws, announcements, filters])

  useEffect(() => {
    const columns = 6 // You can change this to the desired number of columns
    const columnsHeights = new Array(columns).fill(0)
    const newColumnsData = new Array(columns).fill([]).map(() => [])

    allElms.forEach((image) => {
      const columnIndex = calculateColumn(columnsHeights)
      newColumnsData[columnIndex].push(image)
      columnsHeights[columnIndex] += 1 // You can use the actual image height for more accurate calculation
    })

    setColumnsData(newColumnsData)
  }, [allElms])

  return (
    <div className="min-h-screen bg-dark px-4 pb-4 pt-2.5">
      <PageHead />

      <KladnoHeader />
      <SearchBar
        filters={filters}
        setFilters={setFilters}
        announcementLength={announcements.length}
        lawLength={laws.length}
        caseFileLength={caseFiles.length}
      />

      <div className="flex w-full justify-center gap-4">
        {columnsData.map((column, columnIndex) => (
          <div key={columnIndex} className="w-1/5 ">
            {column.map((file) => (
              <>
                {file._type === 'caseFile' && (
                  <div className="my-4 w-full ">
                    <CaseFilePreview case={file} />
                  </div>
                )}
                {file._type === 'announcement' && (
                  <div className="my-4 w-full ">
                    <AnnouncementPreview announcement={file} />
                  </div>
                )}
                {file._type === 'law' && (
                  <div className="my-4 w-full ">
                    <LawPreview law={file} />
                  </div>
                )}
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
