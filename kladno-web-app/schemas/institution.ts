import { DashboardIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'institution',
  title: 'Institution',
  icon: DashboardIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Institution Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
  ],
})
