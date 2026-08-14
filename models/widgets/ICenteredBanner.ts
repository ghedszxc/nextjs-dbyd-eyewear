import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ICenteredBanner {
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  name?: string;
  image?: {
    desktop?: { url?: string; alt?: string; type?: "image" | "video" };
    mobile?: { url?: string; alt?: string; type?: "image" | "video" };
  };
  isVideo?: boolean;
  cta?: {
    text?: string;
    href?: string;
  };
  noTeaserText?: boolean;
  marginTop?: number;
  paddingBottom?: boolean;
  imageHeight?: string;
  mobileImageHeight?: string;
  responsiveImage?: boolean;
  containerHeight?: string;
}
