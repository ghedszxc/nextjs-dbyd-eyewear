import CampaignBanner from "@/widgets/CampaignBanner";
import CampaignCollection from "@/widgets/CampaignCollection";
import CardSlider from "@/widgets/CardSlider";
import HeroSection from "@/widgets/HeroSection";
import Navigation from "@/widgets/Navigation";
import ThreeColumnSection from "@/widgets/ThreeColumnSection";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";

const Page = () => {
  return (
    <>
      <HeroSection
        titleDesktop="Made for every moments."
        titleMobile1="Hello."
        titleMobile2="Nice to see you."
        body={{
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
                    text: "Unofficial is an invitation for self expression.",
                    // @ts-ignore
                    type: "text",
                  },
                ],
              },
            ],
          },
        }}
        visual={{
          desktop: {
            url: "/images/hero-section-image-d.png",
            alt: "Visual Image Type 1",
            type: "image",
          },
          mobile: {
            url: "/images/hero-section-image-m.png",
            alt: "Visual Image Type 1",
            type: "image",
          },
        }}
        link={{
          type: "anchor",
          url: "#",
          text: "Call to action",
        }}
        isVideo={false}
      />
      <ThreeColumnSection
        cards={[
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
        ]}
        iconLeft={{
          url: "/icons/arrow-left.svg",
          alt: "Arrow Left Icon",
        }}
        iconRight={{
          url: "/icons/arrow-right.svg",
          alt: "Arrow Right Icon",
        }}
      />
      <CardSlider
        title="OUR MATERIALS"
        subtitle="We’re all for quality. We think substance is just as important as style. We work with the latest innovations and quality materials to provide the best frames. "
        items={[
          {
            image: {
              url: "/images/materials-image-test.png",
              alt: "material image 1",
              type: "image",
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
              },
            },
          },
          {
            image: {
              url: "/images/materials-image-test.png",
              alt: "material image 2",
              type: "image",
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
              },
            },
          },
          {
            image: {
              url: "/images/materials-image-test.png",
              alt: "material image 3",
              type: "image",
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
              },
            },
          },
          {
            image: {
              url: "/images/materials-image-test.png",
              alt: "material image 4",
              type: "image",
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
              },
            },
          },
          {
            image: {
              url: "/images/materials-image-test.png",
              alt: "material image 5",
              type: "image",
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
              },
            },
          },
        ]}
      />
      <CampaignBanner
        title="Latest Campaigns"
        name="Campaign name"
        body={{
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
          },
        }}
        image={{
          desktop: {
            url: "/images/campaign-banner-d.png",
            alt: "Campaign Banner Desktop",
          },
          mobile: {
            url: "/images/campaign-banner-m.png",
            alt: "Campaign Banner Mobile",
          },
        }}
        cta={{
          href: "#",
          text: "Call to actions →",
        }}
      />
      <CampaignCollection
        campaigns={[
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
            },
            cta: {
              href: "#",
              text: "Call to action →",
            },
          },
        ]}
      />
    </>
  );
};

export default Page;
