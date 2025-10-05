import RegionRestrictionClient from './RegionRestrictionClient';

export const metadata = {
  title: "YouTube Region Restriction Checker – Free Online Tool",
  description: "Check if YouTube videos are blocked in specific countries. Verify regional availability and restrictions instantly. No signup required.",
  openGraph: {
    title: "YouTube Region Restriction Checker – Free Online Tool",
    description: "Check if YouTube videos are blocked in specific countries. Verify regional availability and restrictions instantly. No signup required.",
    url: "https://tools.aipepal.com/youtube-tools/region-restriction-checker",
    siteName: "AIPepal Tools",
  },
};

export default function RegionRestrictionChecker() {
  return <RegionRestrictionClient />;
}