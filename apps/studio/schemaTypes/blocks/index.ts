import { ObjectDefinition } from 'sanity'
import { baseBlocks } from './base-blocks'
import { tabs } from './tabs'

// Full page builder blocks including tabs
export const pageBuilderBlocks: ObjectDefinition[] = [
  ...baseBlocks,
  tabs,
];

export const blocks = [...pageBuilderBlocks];
