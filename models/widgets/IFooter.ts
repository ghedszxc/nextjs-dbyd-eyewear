import { StoryblokRichTextProps } from "@storyblok/react/rsc";

export interface IFooterLink {
  text: string;
  href: string;
}

export interface IFooterNavGroup {
  title: string;
  links: IFooterLink[];
}

export interface IFooterSocial {
  icon?: string;
  title?: string;
  href?: string;
}

export interface IFooter {
  newsletterTitle?: string;
  newsletterSubtitle?: Pick<StoryblokRichTextProps, "doc">;

  social: IFooterSocial;
  navigationLinks?: IFooterNavGroup[];
  copyright: string;
  logo: { src: string; alt: string };
}
