import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IGenericFullWidthBanner {
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  image?: {
    desktop?: { src?: string; alt?: string };
    mobile?: { src?: string; alt?: string };
    src?: string;
    alt?: string;
  };
  video?: {
    src: string;
    type?: string;
  };
  cta?: {
    text?: string;
    href?: string;
  };
  theme?: "light" | "dark";
  background_color?: string;
}
