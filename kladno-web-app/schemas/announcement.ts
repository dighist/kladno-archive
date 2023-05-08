import { BellIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import institution from './institution'

export default defineType({
  name: 'announcement',
  title: 'Announcement',
  icon: BellIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Announcement Name',
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
