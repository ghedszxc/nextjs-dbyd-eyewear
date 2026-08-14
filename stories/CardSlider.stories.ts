import type { Meta, StoryObj } from "@storybook/react";
import { ICardSlider } from "@/models/widgets/ICardSlider";
import CardSlider from "@/widgets/CardSlider";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";

const meta = {
  title: "Widgets/CardSlider",
  component: CardSlider,
  tags: ["autodocs"],
} satisfies Meta<ICardSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "OUR MATERIALS",
    subtitle: "We’re all for quality. We think substance is just as important as style. We work with the latest innovations and quality materials to provide the best frames. ",
    items: [
      {
        image: {
          url: "/images/materials-image-test.png",
          alt: "material image 1",
          type: "image"
        },
        title: "Beta Titanium",
        description: {
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                content: [
                  {
                    text: "We’re all for quality. We think substance is just as important as style. We work with the latest innovations and quality materials to provide the best frames.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          }
        }
      }, 
      {
        image: {
          url: "/images/materials-image-test.png",
          alt: "material image 2",
          type: "image"
        },
        title: "Wood pulp and cotton fibres",
        description: {
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                content: [
                  {
                    text: "We’re all for quality. We think substance is just as important as style. We work with the latest innovations and quality materials to provide the best frames. ",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          }
        }
      }, 
      {
        image: {
          url: "/images/materials-image-test.png",
          alt: "material image 3",
          type: "image"
        },
        title: "At-risk plastic",
        description: {
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                content: [
                  {
                    text: "We’re all for quality. We think substance is just as important as style. We work with the latest innovations and quality materials to provide the best frames.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          }
        }
      }, 
      {
        image: {
          url: "/images/materials-image-test.png",
          alt: "material image 4",
          type: "image"
        },
        title: "Recycled Metal",
        description: {
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                content: [
                  {
                    text: "We’re all for quality. We think substance is just as important as style. We work with the latest innovations and quality materials to provide the best frames.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          }
        }
      }, 
      {
        image: {
          url: "/images/materials-image-test.png",
          alt: "material image 5",
          type: "image"
        },
        title: "Material",
        description: {
          doc: {
            type: "doc" as StoryblokRichTextNodeTypes,
            content: [
              {
                type: "paragraph" as StoryblokRichTextNodeTypes,
                content: [
                  {
                    text: "We’re all for quality. We think substance is just as important as style. We work with the latest innovations and quality materials to provide the best frames.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          }
        }
      }
    ]
  },
};
