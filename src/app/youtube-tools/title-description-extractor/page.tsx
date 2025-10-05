import TitleDescriptionClient from './TitleDescriptionClient';

export const metadata = {
  title: "YouTube Title and Description Extractor – Free Online Tool",
  description: "Extract YouTube video titles and descriptions instantly. No signup required, fast and free.",
  openGraph: {
    title: "YouTube Title and Description Extractor – Free Online Tool",
    description: "Extract YouTube video titles and descriptions instantly. No signup required, fast and free.",
    url: "https://tools.aipepal.com/youtube-tools/title-description-extractor",
    siteName: "AIPepal Tools",
  },
};

export default function TitleDescriptionExtractor() {
  return <TitleDescriptionClient />;
}