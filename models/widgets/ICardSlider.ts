import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface ICardSlider {
  title?: string;
  subtitle?: string;
  items?: ICardSliderItem[];
}

export interface ICardSliderItem {
  number?: number;
  length?: number;
  image?: {
    url: string;
    alt: string;
    type: "image" | "video";
  };
  title: string;
  description: Pick<StoryblokRichTextProps, "doc">;
}
