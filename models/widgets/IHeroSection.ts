import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface Link {
  type: "anchor" | "internal";
  url: string;
  text: string;
}

export interface IHeroSection {
  titleDesktop?: string;
  titleMobile1?: string;
  titleMobile2?: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  visual?: {
    desktop: { url: string; alt: string; type: "image" | "video" };
    mobile: { url: string; alt: string; type: "image" | "video" };
  };
  links?: Link[];
  isVideo?: boolean;
  bodyMaxWidth?: string;
}
