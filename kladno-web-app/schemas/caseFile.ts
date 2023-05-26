import { PackageIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

import personType from './person'
import institutionType from './institution'
import announcement from './announcement'
import law from './law'
import caseFileDocumentType from './caseFileDocument'
import typeValue from './type'
import subjectValue from './subject'

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
      name: 'subject',
      title: 'Subject (Criminal Offense)',
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
      name: 'criminalOffenseParagraph',
      title: 'Criminal Offense Paragraph',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [law, announcement],
        },
      ],
    }),
    defineField({
      name: 'accusingInstitution',
      title: 'Accusing Institution',
      type: 'reference',
      to: [{ type: institutionType.name }],
    }),
    defineField({
      name: 'personProsecuted',
      title: 'Accused Person',
      type: 'reference',
      to: [{ type: personType.name }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dateIn',
      title: 'Date Criminal Charge In',
      type: 'datetime',
    }),
    defineField({
      name: 'dateCriminalChargeToCaseworker',
      title: 'Date Criminal Charge To Caseworker',
      type: 'datetime',
    }),
    defineField({
      name: 'datePenalty',
      title: 'Date Penalty Notice',
      type: 'datetime',
    }),
    defineField({
      name: 'dateFinePaid',
      title: 'Date Fine Paid',
      type: 'datetime',
    }),
    defineField({
      name: 'documents',
      title: 'Case Documents',
      type: 'array',

      of: [
        { type: 'reference', weak: false, to: [{ type: 'caseFileDocument' }] },
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
      title: 'title',
    },
  },
})
