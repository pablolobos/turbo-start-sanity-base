import { ObjectDefinition } from 'sanity'
import { baseBlocks } from './base-blocks'
import { tabs } from './tabs'
import { infoSection } from './info-section'
import { specificationsTable } from './specifications-table'

// Full page builder blocks including tabs
export const pageBuilderBlocks: ObjectDefinition[] = [
  ...baseBlocks,
  tabs,
  infoSection,
];

export const blocks = [...pageBuilderBlocks];
