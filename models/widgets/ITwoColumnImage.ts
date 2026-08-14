import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ITwoColumnImage {
  left: {
    desktop: { url: string; alt: string };
    mobile: { url: string; alt: string };
    darkBg?: string;
    cta?: { text: string; productName?: string; href: string; ctaColor?: string; icon?: string };
  };
  right: {
    desktop: { url: string; alt: string };
    mobile: { url: string; alt: string };
    darkBg?: string;
    cta?: { text: string; productName?: string; href: string; ctaColor?: string; icon?: string };
  };
  title?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  paddingY?: string;
  bgColor?: string;
  spacingBottom?: boolean;
  responsiveImage?: boolean;
  containerHeight?: string;
}
