import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IAboutHeroBanner {
  image: {
    desktop: { url: string; alt: string };
    mobile: { url: string; alt: string };
  };
  subtitle?: string;
  heading?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  cta?: { text: string; href: string };
  overlay?: { color: string; blendMode: string };
  paddingTopMobile?: boolean;
  paddingTopDesktop?: boolean;
  minHeightMobile?: string;
}
