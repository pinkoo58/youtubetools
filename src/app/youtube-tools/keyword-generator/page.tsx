import KeywordGeneratorClient from './KeywordGeneratorClient';
import { generateToolMetadata } from '@/lib/metadata-template';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

export const metadata = generateToolMetadata({
  toolId: 'keyword-generator',
  path: '/youtube-tools/keyword-generator'
});

export default function KeywordGenerator() {
  return (
    <ToolPageTemplate
      toolId="keyword-generator"
      path="/youtube-tools/keyword-generator"
    >
      <KeywordGeneratorClient />
    </ToolPageTemplate>
  );
}