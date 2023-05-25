import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import institution from './institution'
import { DocumentDefinition } from '@sanity/types'
import announcement from './announcement'
import subjectValue from './subject'
import law from './law'
import caseFileDocument from './caseFileDocument'
import typeValue from './type'
import keywordValue from './keyword'

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
      name: 'description',
      title: 'Description',
      type: 'text',
    }),

    // new field: 'descriptionCreator', 'Description Creator', single select between 'machine' and 'human' (ideally underneath the field 'description')
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
        'A keyword/tag of the resource (folksonomy, open vocabulary) ',
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
      name: 'spatial',
      title: 'Spatial',
      description: 'Spatial characteristics of the resource.',
      type: 'string',
    }),

    defineField({
      name: 'pdf',
      title: 'PDF Scan',
      type: 'file',
    }),
    defineField({
      name: 'originalFilename',
      title: 'Original Filename',
      type: 'string',
      description: 'The original filename of the file from Dropbox',
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

    defineField({
      name: 'institution',
      title: 'Institution',
      description: 'The institution that issued this regulation',
      type: 'reference',
      to: [institution],
    }),

    // -------------- FIELDS TO BE REVIEWED ----------------

    defineField({
      name: 'dateAnnounced',
      title: 'Date Announced',
      type: 'datetime',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
