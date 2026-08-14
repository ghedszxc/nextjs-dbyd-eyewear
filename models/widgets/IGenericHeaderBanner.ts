import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IGenericHeaderBanner {
  heading?: string;
  subtitle?: Pick<StoryblokRichTextProps, "doc">;
  bgColor?: string;
  textColor?: string;
  topPadding?: boolean;
  mb?: string;
}
