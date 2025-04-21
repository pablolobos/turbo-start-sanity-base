export const message = {
  type: 'document',
  name: 'message',
  title: 'Messages',
  fields: [
    {
      type: 'string',
      name: 'name',
      title: 'Name',
    },
    {
      type: 'string',
      name: 'email',
      title: 'Email',
    },
    {
      type: 'text',
      name: 'subject',
      title: 'Subject',
    },
    {
      type: 'string',
      name: 'pageTitle',
      title: 'Page Title',
      description: 'The title of the page where the form was submitted',
    },
    {
      type: 'array',
      name: 'fields',
      title: 'Fields',
      of: [
        {
          type: 'object',
          name: 'field',
          title: 'Field',
          fields: [
            {
              type: 'string',
              name: 'name',
              title: 'Name',
            },
            {
              type: 'string',
              name: 'value',
              title: 'Value',
            },
          ]
        }
      ]
    },
    {
      type: 'boolean',
      name: 'read',
      title: 'Read',
      initialValue: false,
    },
    {
      type: 'boolean',
      name: 'starred',
      title: 'Starred',
    },
    {
      type: 'object',
      name: 'utmParams',
      title: 'UTM Parameters',
      fields: [
        {
          type: 'string',
          name: 'utm_source',
          title: 'UTM Source',
        },
        {
          type: 'string',
          name: 'utm_medium',
          title: 'UTM Medium',
        },
        {
          type: 'string',
          name: 'utm_campaign',
          title: 'UTM Campaign',
        },
        {
          type: 'string',
          name: 'utm_term',
          title: 'UTM Term',
        },
        {
          type: 'string',
          name: 'utm_content',
          title: 'UTM Content',
        }
      ]
    },
    {
      type: 'string',
      name: 'emailRecipients',
      title: 'Email Recipients',
    }
  ]
}