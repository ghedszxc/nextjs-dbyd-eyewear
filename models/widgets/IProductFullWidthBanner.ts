import { StoryblokRichTextProps } from "@storyblok/react/rsc";
export interface Link {
  type: "anchor" | "internal";
  url: string;
  text: string;
}
export interface IProductFullWidthBanner {
  title: string;
  description?: string;
  image?: {
    url: string;
    alt: string;
    type: "image" | "video";
  };
  links?: Link[];
  isVideo?: boolean;

}