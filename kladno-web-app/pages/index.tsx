import { PreviewSuspense } from '@sanity/preview-kit'
import IndexPage from 'components/IndexPage'
import {
  getAllCaseFiles,
  getAllAnnouncements,
  getAllLaws,
  getSettings,
} from 'lib/sanity.client'
import { CaseFile, Post, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import { lazy } from 'react'

interface PageProps {
  caseFiles: CaseFile[]
  announcements: any[]
  laws: any[]
  settings: Settings
  preview: boolean
  token: string | null
}

interface Query {
  [key: string]: string
}

interface PreviewData {
  token?: string
}

export default function Page(props: PageProps) {
  const { caseFiles, settings, preview, token, announcements, laws } = props

  return (
    <IndexPage
      caseFiles={caseFiles}
      settings={settings}
      announcements={announcements}
      laws={laws}
    />
  )
}

export const getStaticProps: GetStaticProps<
  PageProps,
  Query,
  PreviewData
> = async (ctx) => {
  const { preview = false, previewData = {} } = ctx

  const [settings, caseFiles = [], announcements = [], laws = []] =
    await Promise.all([
      getSettings(),
      getAllCaseFiles(),
      getAllAnnouncements(),
      getAllLaws(),
    ])

  return {
    props: {
      caseFiles,
      settings,
      announcements,
      laws,
      preview,
      token: previewData.token ?? null,
    },
  }
}
