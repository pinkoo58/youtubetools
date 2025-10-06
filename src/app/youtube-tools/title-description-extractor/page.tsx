import TitleDescriptionClient from './TitleDescriptionClient';
import { generateToolMetadata } from '@/lib/metadata-template';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

export const metadata = generateToolMetadata({
  toolId: 'title-description-extractor',
  path: '/youtube-tools/title-description-extractor'
});

export default function TitleDescriptionExtractor() {
  return (
    <ToolPageTemplate
      toolId="title-description-extractor"
      path="/youtube-tools/title-description-extractor"
    >
      <TitleDescriptionClient />
    </ToolPageTemplate>
  );
}