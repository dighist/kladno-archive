import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'subjectValue',
  title: 'Subject',
  icon: TagIcon,
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'value',
      title: 'Value',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        required: true,
      },
    },
  ],
})
