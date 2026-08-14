import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ITwoColumnText {
  title?: string;
  subtitle?: Pick<StoryblokRichTextProps, "doc">;
  bgColor: string;
  fontColor: string;
  titleFontSize?: string;
  mobilePaddingY?: string;
  bottomPadding?: string;
  cta?: {
    text?: string;
    href?: string;
  };
}
