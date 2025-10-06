import { Metadata } from 'next';
import { generateMetadata, toolsMetadata } from './seo';
import { getBreadcrumbSchema, getWebApplicationSchema } from './structured-data';

export interface ToolMetadataConfig {
  toolId: keyof typeof toolsMetadata;
  path: string;
  breadcrumbName?: string;
}

export function generateToolMetadata(config: ToolMetadataConfig): Metadata {
  const tool = toolsMetadata[config.toolId];
  return generateMetadata({
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    canonical: `https://tools.aipepal.com${config.path}`,
  });
}

export function generateToolSchemas(config: ToolMetadataConfig & { breadcrumbName?: string }) {
  const tool = toolsMetadata[config.toolId];
  const breadcrumbName = config.breadcrumbName || tool.title.split(' - ')[0];
  
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://tools.aipepal.com' },
    { name: 'YouTube Tools', url: 'https://tools.aipepal.com' },
    { name: breadcrumbName, url: `https://tools.aipepal.com${config.path}` },
  ]);

  const appSchema = getWebApplicationSchema(
    breadcrumbName,
    tool.description,
    `https://tools.aipepal.com${config.path}`
  );

  return { breadcrumbSchema, appSchema };
}