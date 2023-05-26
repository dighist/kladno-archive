import { BillIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { dec, defineField, defineType } from 'sanity'

import personType from './person'
import announcement from './announcement'
import subjectValue from './subject'
import law from './law'
import typeValue from './type'
import keywordValue from './keyword'

/**
 * This file is the schema definition for a post.
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */
import { apiVersion, dataset, projectId, useCdn } from '../lib/sanity.api'
import { createClient } from 'next-sanity'

// -------------------------------------------------
// CUSTOM SLUGIFIER FUNCTIONS
// -------------------------------------------------
const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null

const padNumber = (num, size) => {
  let s = String(num)
  return s.padStart(size, '0')
}

async function myAsyncSlugifier(input, schemaType, context) {
  const { getClient } = context
  const client = getClient({ apiVersion: '2022-12-07' })

  // Fetch count of documents of type 'caseFileDocument'
  const query = 'count(*[_type=="caseFileDocument"])'
  const totalCases = await client.fetch(query)

  // Format count as a 5 digit string, padding with zeroes as needed
  const countStr = String(totalCases + 1).padStart(5, '0')

  // Generate the slug
  const slug = `kla_cas_${countStr}`

  return slug
}
// -------------------------------------------------
// CUSTOM SLUGIFIER FUNCTIONS
// -------------------------------------------------

export default defineType({
  name: 'caseFileDocument',
  title: 'Case Files',
  icon: BillIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),

    // ----------------- SLUG TODO ---------------------
    // defineField({
    //   name: 'identifier',
    //   type: 'slug',
    //   options: {
    //     source: () => '_id',
    //     slugify: myAsyncSlugifier,
    //   },
    // }),
    // -------------------------------------------------

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),

    defineField({
      name: 'descriptionCreator',
      title: 'Description Creator',
      type: 'string',
      options: {
        list: [
          { title: 'Machine', value: 'machine' },
          { title: 'Human', value: 'human' },
        ],
      },
    }),

    defineField({
      name: 'subject',
      title: 'Subject',
      description: 'A topic of the resource (taxonomy, closed vocabulary)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [subjectValue],
        },
      ],
    }),

    defineField({
      name: 'keywords',
      title: 'Keywords',
      description:
        'A keyword/tag of the resource (folksonomy, open vocabulary)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [keywordValue],
        },
      ],
    }),

    defineField({
      name: 'language',
      title: 'Language',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Czech', value: 'es' },
          { title: 'German', value: 'fr' },
        ],
      },
    }),
    defineField({
      name: 'source',
      title: 'Source',
      description:
        'A related resource outside of Sanitiy from which the described resource is derived, e.g. Handelsblatt',
      type: 'string',
    }),

    defineField({
      name: 'type',
      title: 'Type',
      description: 'The type of document',
      type: 'reference',
      to: [typeValue],
    }),

    defineField({
      name: 'hasReferencesTo',
      title: 'Has references to',
      description:
        'Other regulations and announcements that this document references',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [law, announcement],
        },
      ],
    }),

    defineField({
      name: 'spatial',
      title: 'Spatial',
      description: 'Spatial characteristics of the resource.',
      type: 'string',
    }),

    defineField({
      name: 'images',
      title: 'Images',
      description: 'Images of the document',
      type: 'array',
      of: [
        {
          type: 'image',
        },
      ],
    }),

    defineField({
      name: 'originalFilename',
      title: 'Original Filename',
      description: 'The original filename of the scan from Dropbox',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'pageNumber',
      title: 'Page Number',
      type: 'number',
    }),
    defineField({
      name: 'transcript',
      title: 'Transcript',
      type: 'text',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
    }),

    // -------------- FIELDS TO BE REVIEWED ----------------

    defineField({
      name: 'date',
      title: 'Date Received In',
      type: 'datetime',
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
})
