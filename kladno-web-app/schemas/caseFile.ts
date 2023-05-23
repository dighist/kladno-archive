import { PackageIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

import personType from './person'
import announcementType from './announcement'
import caseFileDocumentType from './caseFileDocument'
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
  name: 'caseFile',
  title: 'Cases',
  icon: PackageIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'personProsecuted',
      title: 'Person Prosecuted',
      type: 'reference',
      to: [{ type: personType.name }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    }),

    defineField({
      name: 'documents',
      title: 'Documents',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseFileDocument' }] }],
    }),
    defineField({
      name: 'dateIn',
      title: 'Date Received In',
      type: 'datetime',
    }),
    defineField({
      name: 'datePenalty',
      title: 'Date Penalty Posted',
      type: 'datetime',
    }),

    defineField({
      name: 'announcementsViolated',
      title: 'Announcements Violated',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: announcementType.name }],
        },
      ],
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
      first: 'personProsecuted.firstName',
      last: 'personProsecuted.lastName',
    },
    prepare({ first, last }) {
      return { title: 'Case File: ' + first + ' ' + last }
    },
  },
})
