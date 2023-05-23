import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import institution from './institution'
import PdfPreview from 'components/PdfPreview'
import { DocumentDefinition } from '@sanity/types'
import announcement from './announcement'
import subjectValue from './subject'
import law from './law'
import caseFileDocument from './caseFileDocument'
import typeValue from './type'

export default defineType({
  name: 'law',
  title: 'Regulation',
  icon: BookIcon,
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
      name: 'type',
      title: 'Type',
      description: 'The type of document',
      type: 'reference',
      to: [typeValue],
    }),

    defineField({
      name: 'hasReferencesTo',
      title: 'Has References To',
      description: 'Other documents that this regulation references',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'law' }],
        },
      ],
    }),

    defineField({
      name: 'source',
      title: 'Source',
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
      name: 'institutionIssuedBy',
      title: 'Institution Issued By',
      type: 'reference',
      to: [institution],
    }),
    defineField({
      name: 'dateAnnounced',
      title: 'Date Announced',
      type: 'datetime',
    }),
    defineField({
      name: 'originalFilename',
      title: 'Original Filename',
      type: 'string',
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
  preview: {
    select: {
      title: 'title',
    },
  },
})
