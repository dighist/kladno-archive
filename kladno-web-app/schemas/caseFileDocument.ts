import { BillIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { dec, defineField, defineType } from 'sanity'

import personType from './person'
import announcement from './announcement'
import subjectValue from './subject'
import law from './law'
import typeValue from './type'

/**
 * This file is the schema definition for a post.
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */

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
    //description
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
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
      name: 'subject',
      title: 'Subject',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [subjectValue],
        },
      ],
    }),
    defineField({
      name: 'scan',
      title: 'Scan',
      type: 'image',
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
      name: 'date',
      title: 'Date Received In',
      type: 'datetime',
    }),
    defineField({
      name: 'originalFilename',
      title: 'Original Filename',
      type: 'string',
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      name: 'originalFilename',
      image: 'scan',
    },
    prepare: ({ name, image }) => {
      return {
        title: name.split('.')[0],
        imageUrl:
          image && image.asset ? `${image.asset.url}?w=200&h=200&fit=crop` : '',
      }
    },
  },
})
