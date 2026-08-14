import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IFaqAccordion {
  collectionTitle: string;
  items: IFaqAccordionItem[];
}

export interface IFaqAccordionItem {
  question: string;
  answer: Pick<StoryblokRichTextProps, "doc">;
}
