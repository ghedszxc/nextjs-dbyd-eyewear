import { StoryblokRichTextProps } from "@storyblok/react/rsc";

type NavItem = {
  label: string;
  href?: string;
  children?: {
    header: string;
    image?: string;
    description?: Pick<StoryblokRichTextProps, "doc">;
    href?: string;
    children?: { label: string; href: string; totalItems?: string }[];
  }[];
};

export interface INavigation {
  NavData: NavItem[];
  isPLPRoute?: boolean | "";
  lang?: string;
}
