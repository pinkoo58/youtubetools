import RegionRestrictionClient from './RegionRestrictionClient';
import { generateToolMetadata } from '@/lib/metadata-template';
import { ToolPageTemplate } from '@/components/ToolPageTemplate';

export const metadata = generateToolMetadata({
  toolId: 'region-restriction-checker',
  path: '/youtube-tools/region-restriction-checker'
});

export default function RegionRestrictionChecker() {
  return (
    <ToolPageTemplate
      toolId="region-restriction-checker"
      path="/youtube-tools/region-restriction-checker"
    >
      <RegionRestrictionClient />
    </ToolPageTemplate>
  );
}