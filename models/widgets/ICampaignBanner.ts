import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ICampaignBanner {
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  name?: string;
  image?: {
    desktop?: { url?: string; alt?: string };
    mobile?: { url?: string; alt?: string };
  };
  cta?: {
    text?: string;
    href?: string;
  };

  position: string;
  bgColor: string;
  imageMaxWidth?: number;
  mobileImage?: { width: number; height: number; offset: number };
}
