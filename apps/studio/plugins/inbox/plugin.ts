import { definePlugin } from 'sanity';
import { message } from './schema';
import InboxTool from './components/inbox-tool';
import React from 'react';

interface InboxToolConfig {
  title: string;
  name: string;
  component: () => React.ReactElement;
}

const inboxTool = (): InboxToolConfig => {
  return {
    title: 'Leads',
    name: 'inbox-tool',
    component: () => (
      InboxTool()
    ),
  }
}

export const inboxPlugin = definePlugin({
  name: 'inbox-plugin',
  schema: {
    types: [message],
  },
  tools: [
    inboxTool()
  ],
});
