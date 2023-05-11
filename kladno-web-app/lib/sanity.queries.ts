import { groq } from 'next-sanity'

const postFields = groq`
  _id,
  title,
  date,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`

export const caseFileByIDQuery = groq`
*[_type == "caseFile" && slug.current == $slug][0] {
  ${postFields}
}
`

export interface Author {
  name?: string
  picture?: any
}

export interface Post {
  _id: string
  title?: string
  coverImage?: any
  date?: string
  excerpt?: string
  author?: Author
  slug?: string
  content?: any
}

export interface CaseFile {
  _id: string
  dateIn: string
  datePenalty: string
  documents: CaseFileDocument[]
  announcementsViolated: any
  personProsecuted: Person
}
export const caseFileFields = groq`
  _id,
  _type,
  title,
  dateIn,
  datePenalty,
  coverImage,
  "documents": documents[]->{
    ...,
    "scan": scan.asset->url,
    originalFilename},
  "personProsecuted": personProsecuted->{firstName, lastName},
`

export interface Announcement {
  _id: string
  title: string
  year: string
  description: string
  institution: any
  originalFilename: string
  institutionFilePath: string
  dateAnnounced: string
  pdf: any
  scannedText: string
}
export const announcementFields = groq`
  _id,
  _type,
  title,
  year,
  description,
  institution,
  originalFilename,
  institutionFilePath,
  dateAnnounced,
  "pdf": pdf.asset->url,
  scannedText,
`

export interface Law {
  _id: string
  title: string
  description: string
  originalFilename: string
  institutionIssuedBy: string
  dateAnnounced: string
  pdf: any
  scannedText: string
}
export const lawFields = groq`
  _id,
  _type,
  title,
  description,
  originalFilename,
  institutionIssuedBy,
  dateAnnounced,
  "pdf": pdf.asset->url,
  scannedText,
`

export interface Bucket {
  _id: string
  title: string
  description: string
  documents: any[]
}

export const bucketFields = groq`
  _id,
  _type,
  title,
  description,
  "documents": documents[]->{
    ...,
    "scan": scan.asset->url,
    originalFilename},
`

export interface CaseFileDocument {
  _id: string
  scan: string
  date: string
  originalFilename: string
}

export interface Person {
  _id: string
  firstName: string
  lastName: string
}

export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
}

export const settingsQuery = groq`*[_type == "settings"][0]`

export const indexQuery = groq`
*[_type == "caseFile"] | order(date desc, _updatedAt desc) {
  ${caseFileFields}
}`

export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`
