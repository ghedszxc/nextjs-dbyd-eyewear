import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ITwoColumnTextAndMedia {
  title?: string;
  subtitle?: Pick<StoryblokRichTextProps, "doc">;
  image?: {
    desktop?: { url?: string; alt?: string };
    mobile?: { url?: string; alt?: string };
  };
  leftImage?: boolean;
  mobileTextTop?: boolean;
  mt?: string;
  mb?: string;
  px?: string;
  responsiveImage?: boolean;
  containerHeight?: string;
  subtitleClassName?: string;
}
