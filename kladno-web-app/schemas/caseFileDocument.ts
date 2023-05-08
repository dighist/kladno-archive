import { BillIcon } from '@sanity/icons'
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
  name: 'caseFileDocument',
  title: 'Case File Document',
  icon: BillIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'scan',
      title: 'Scan',
      type: 'image',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
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
