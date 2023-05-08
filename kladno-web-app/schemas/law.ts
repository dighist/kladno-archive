import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import institution from './institution'
import PdfPreview from 'components/PdfPreview'
import { DocumentDefinition } from '@sanity/types'

export default defineType({
  name: 'law',
  title: 'Law',
  icon: BookIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Law Name',
      type: 'string',
      validation: (rule) => rule.required(),
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
      type: 'string',
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
