import { BasketIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

import personType from './person'
import announcementType from './announcement'

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
  name: 'bucket',
  title: 'Bucket',
  icon: BasketIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'documents',
      title: 'Documents',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseFileDocument' }] }],
    }),
  ],

  preview: {
    select: {
      name: 'title',
    },
    prepare: ({ name }) => {
      return {
        title: name,
      }
    },
  },
})
