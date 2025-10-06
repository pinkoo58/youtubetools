import { ReactNode } from 'react';
import { generateToolSchemas } from '@/lib/metadata-template';
import { toolsMetadata } from '@/lib/seo';

interface ToolPageTemplateProps {
  toolId: keyof typeof toolsMetadata;
  path: string;
  breadcrumbName?: string;
  children: ReactNode;
}

export function ToolPageTemplate({ toolId, path, breadcrumbName, children }: ToolPageTemplateProps) {
  const { breadcrumbSchema, appSchema } = generateToolSchemas({
    toolId,
    path,
    breadcrumbName
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(appSchema),
        }}
      />
      {children}
    </>
  );
}