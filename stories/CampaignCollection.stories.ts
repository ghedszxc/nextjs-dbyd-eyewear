import type { Meta, StoryObj } from "@storybook/react";

import { ICampaignCollection } from "@/models/widgets/ICampaignCollection";
import CampaignCollection from "@/widgets/CampaignCollection";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Widgets/CampaignCollection",
  component: CampaignCollection,
  tags: ["autodocs"],
} satisfies Meta<ICampaignCollection>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    campaigns: [
      {
        name: "Campaign name",
        image: {
          desktop: {
            url: "/images/campaign-card-1-d.png",
            alt: "Campaign Card 1",
          },
          mobile: {
            url: "/images/campaign-card-1-m.png",
            alt: "Campaign Card 1",
          },
        },
        cta: {
          href: "#",
          text: "Call to action →",
        },
      },
      {
        name: "Campaign name",
        image: {
          desktop: {
            url: "/images/campaign-card-2.png",
            alt: "Campaign Card 2",
          },
          mobile: {
            url: "/images/campaign-card-2.png",
            alt: "Campaign Card 2",
          },
        },
        cta: {
          href: "#",
          text: "Call to action →",
        },
      },
      {
        name: "Campaign name",
        image: {
          desktop: {
            url: "/images/campaign-card-1-d.png",
            alt: "Campaign Card 1",
          },
          mobile: {
            url: "/images/campaign-card-1-m.png",
            alt: "Campaign Card 1",
          },
        },
        cta: {
          href: "#",
          text: "Call to action →",
        },
      },
      {
        name: "Campaign name",
        image: {
          desktop: {
            url: "/images/campaign-card-2.png",
            alt: "Campaign Card 2",
          },
          mobile: {
            url: "/images/campaign-card-2.png",
            alt: "Campaign Card 2",
          },
        },
        cta: {
          href: "#",
          text: "Call to action →",
        },
      },
      {
        name: "Campaign name",
        image: {
          desktop: {
            url: "/images/campaign-card-1-d.png",
            alt: "Campaign Card 1",
          },
          mobile: {
            url: "/images/campaign-card-1-m.png",
            alt: "Campaign Card 1",
          },
        },
        cta: {
          href: "#",
          text: "Call to action →",
        },
      },
      {
        name: "Campaign name",
        image: {
          desktop: {
            url: "/images/campaign-card-2.png",
            alt: "Campaign Card 2",
          },
          mobile: {
            url: "/images/campaign-card-2.png",
            alt: "Campaign Card 2",
          },
        },
        cta: {
          href: "#",
          text: "Call to action →",
        },
      },
    ],
  },
};
