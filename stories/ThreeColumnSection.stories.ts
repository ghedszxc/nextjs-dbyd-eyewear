import type { Meta, StoryObj } from "@storybook/react";

import ThreeColumnSection from "@/widgets/ThreeColumnSection";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { IThreeColumnSection } from "@/models/widgets/IThreeColumnSection";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Widgets/ThreeColumnSection",
  component: ThreeColumnSection,
  tags: ["autodocs"],
} satisfies Meta<IThreeColumnSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    cards: [
      {
        number: "01",
        title: "Brand pillar",
        body: {
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                attrs: {
                  dir: "ltr",
                },
                content: [
                  {
                    text: "Our frames are designed to fit all face shapes, lifestyles and aesthetics. We bet they'll be a natural fit. We make products that are sleek and designed with sustainability in mind.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          },
        },
        image: {
          url: "/images/three-column-image-1.png",
          alt: "Three Column Image 1",
          type: "image",
        },
      },
      {
        number: "02",
        title: "Brand pillar",
        body: {
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                attrs: {
                  dir: "ltr",
                },
                content: [
                  {
                    text: "Our frames are designed to fit all face shapes, lifestyles and aesthetics. We bet they'll be a natural fit. We make products that are sleek and designed with sustainability in mind.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          },
        },
        image: {
          url: "/images/three-column-image-2.png",
          alt: "Three Column Image 2",
          type: "image",
        },
      },
      {
        number: "03",
        title: "Brand pillar",
        body: {
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                attrs: {
                  dir: "ltr",
                },
                content: [
                  {
                    text: "Our frames are designed to fit all face shapes, lifestyles and aesthetics. We bet they'll be a natural fit. We make products that are sleek and designed with sustainability in mind.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          },
        },
        image: {
          url: "/images/three-column-image-3.png",
          alt: "Three Column Image 3",
          type: "image",
        },
      },
    ],
    iconLeft: {
      url: "/icons/arrow-left.svg",
      alt: "Arrow Left Icon",
    },
    iconRight: {
      url: "/icons/arrow-right.svg",
      alt: "Arrow Right Icon",
    },
  },
};
