import { BellIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import institution from './institution'
import subjectValue from './subject'
import law from './law'
import caseFileDocument from './caseFileDocument'

export default defineType({
  name: 'announcement',
  title: 'Announcement',
  icon: BellIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
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
      name: 'hasReferencesTo',
      title: 'Has References To',
      description: 'Other documents that this announcement references',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'law' }, { type: 'announcement' }],
        },
      ],
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'reference',
      to: [{ type: 'institution' }],
    }),
    defineField({
      name: 'originalFilename',
      title: 'Original Filename',
      type: 'string',
    }),
    defineField({
      name: 'institutionFilePath',
      title: 'Insitituion File Path',
      type: 'string',
    }),
    defineField({
      name: 'dateAnnounced',
      title: 'Date Announced',
      type: 'datetime',
    }),
    defineField({
      name: 'pdf',
      title: 'PDF Scan',
      type: 'file',
    }),
    defineField({
      name: 'scannedText',
      title: 'Scanned Text',
      type: 'text',
    }),
  ],
})
