import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity.api'
import {
  indexQuery,
  type Post,
  type CaseFile,
  type Person,
  postAndMoreStoriesQuery,
  postBySlugQuery,
  postSlugsQuery,
  type Settings,
  settingsQuery,
  caseFileFields,
  announcementFields,
  lawFields,
  bucketFields,
  Bucket,
  Law,
  Announcement,
} from 'lib/sanity.queries'
import { createClient } from 'next-sanity'
import announcement from 'schemas/announcement'

/**
 * Checks if it's safe to create a client instance, as `@sanity/client` will throw an error if `projectId` is false
 */
const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null

export async function getSettings(): Promise<Settings> {
  if (client) {
    return (await client.fetch(settingsQuery)) || {}
  }
  return {}
}

export async function getAllPosts(): Promise<Post[]> {
  if (client) {
    return (await client.fetch(indexQuery)) || []
  }
  return []
}

export async function getAllCaseFiles(): Promise<CaseFile[]> {
  if (client) {
    return (await client.fetch(indexQuery)) || []
  }
  return []
}

export async function getAllAnnouncements(): Promise<any> {
  // query to get all announcements
  const query = `*[_type == "announcement"] {_type, ...}`
  return await client.fetch(query)
}

export async function getAllLaws(): Promise<any> {
  // query to get all laws
  const query = `*[_type == "law"] {_type, ...}`
  return await client.fetch(query)
}

export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  if (client) {
    const slugs = (await client.fetch<string[]>(postSlugsQuery)) || []
    return slugs.map((slug) => ({ slug }))
  }
  return []
}

export async function getPostBySlug(slug: string): Promise<Post> {
  if (client) {
    return (await client.fetch(postBySlugQuery, { slug })) || ({} as any)
  }
  return {} as any
}

export async function getCaseFileByID(id: string): Promise<CaseFile> {
  const documentId = id
  const query = `*[_id == $documentId][0] {
    ${caseFileFields}
  }`

  return await client.fetch(query, { documentId })
}

export async function getAnnouncementByID(id: string): Promise<Announcement> {
  const documentId = id
  const query = `*[_id == $documentId][0] {
    ${announcementFields}
  }`

  return await client.fetch(query, { documentId })
}

export async function getLawByID(id: string): Promise<Law> {
  const documentId = id
  const query = `*[_id == $documentId][0] {
    ${lawFields}
  }`

  return await client.fetch(query, { documentId })
}

export async function getBucketByID(id: string): Promise<Bucket> {
  const documentId = id
  const query = `*[_id == $documentId][0] {
    ${bucketFields}
  }`

  return await client.fetch(query, { documentId })
}

export async function getPostAndMoreStories(
  slug: string,
  token?: string | null
): Promise<{ post: Post; morePosts: Post[] }> {
  if (projectId) {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: token || undefined,
    })
    return await client.fetch(postAndMoreStoriesQuery, { slug })
  }
  return { post: null, morePosts: [] }
}
