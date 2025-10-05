import TagsExtractorClient from './TagsExtractorClient';

export const metadata = {
  title: "YouTube Tags Extractor – Free Online Tool",
  description: "Extract YouTube video tags instantly. Copy selected tags or all tags at once. No signup required, fast and free.",
  openGraph: {
    title: "YouTube Tags Extractor – Free Online Tool",
    description: "Extract YouTube video tags instantly. Copy selected tags or all tags at once. No signup required, fast and free.",
    url: "https://tools.aipepal.com/youtube-tools/tags-extractor",
    siteName: "AIPepal Tools",
  },
};

export default function TagsExtractor() {
  return <TagsExtractorClient />;
}