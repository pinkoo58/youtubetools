import TagsExtractorClient from './TagsExtractorClient';
import { generateToolMetadata } from '@/lib/metadata-template';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

export const metadata = generateToolMetadata({
  toolId: 'tags-extractor',
  path: '/youtube-tools/tags-extractor'
});

export default function TagsExtractor() {
  return (
    <ToolPageTemplate
      toolId="tags-extractor"
      path="/youtube-tools/tags-extractor"
    >
      <TagsExtractorClient />
    </ToolPageTemplate>
  );
}