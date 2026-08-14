import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IThreeColumnCard {
  number: string;
  title: string;
  body?: Pick<StoryblokRichTextProps, "doc">;
  image?: {
    url: string;
    alt: string;
    type: "image" | "video";
  };
}

export interface IThreeColumnSection {
  cards: IThreeColumnCard[];
  iconLeft?: {
    url: string;
    alt: string;
  };
  iconRight?: {
    url: string;
    alt: string;
  };
}
