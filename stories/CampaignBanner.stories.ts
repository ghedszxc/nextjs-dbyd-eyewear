import type { Meta, StoryObj } from "@storybook/react";

import { ICampaignBanner } from "@/models/widgets/ICampaignBanner";
import CampaignBanner from "@/widgets/CampaignBanner";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Widgets/CampaignBanner",
  component: CampaignBanner,
  tags: ["autodocs"],
} satisfies Meta<ICampaignBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    title: "Latest Campaigns",
    body: {
      doc: {
        type: "doc" as StoryblokRichTextNodeTypes,
        content: [
          {
            type: "paragraph" as StoryblokRichTextNodeTypes,
            content: [
              {
                text: "We're all for quality. We think substance is just as important as style. We work with the latest innovations and quality materials to provide the best frames. ",
                // @ts-ignore
                type: "text",
              },
            ],
          },
        ],
      },
    },
    name: "Campaign name",
    image: {
      desktop: {
        url: "/images/campaign-banner-d.png",
        alt: "Campaign Banner Desktop",
      },
      mobile: {
        url: "/images/campaign-banner-m.png",
        alt: "Campaign Banner Mobile",
      },
    },
    cta: {
      href: "#",
      text: "Call to actions →",
    },
    position: "right",
    bgColor: "#F7F2EA",
  },
};

export const PositionLeft: Story = {
  args: {
    ...Default.args,
    position: "left",
  },
};
