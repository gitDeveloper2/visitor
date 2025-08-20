// components/ToolCardClientWrapper.tsx
'use client';

import ToolCard from '@features/tools/components/home/ToolCard';
import {  UITool } from '@features/tools/models/Tools';

export default function ToolCardClientWrapper({ tool }: { tool: UITool }) {
  return <ToolCard tool={tool} />;
}
