export type NavItem = {
  label: string;
  href?: string;
  children?: {
    header: string;
    image?: string;
    description?: string;
    href?: string;
    children?: { label: string; href: string; totalItems?: string; }[];
  }[];
};

export const navLinks: NavItem[] = [
  {
    label: "Products",
    href: "/products",
    children: [
      {
        header: "Explore by category",
        children: [
          { label: "Sunglasses", href: "/products/sunglasses" },
          { label: "Eyeglasses", href: "/products/eyeglasses" },
        ],
      },
      {
        header: "Explore by collection",
        children: [
          { label: "Made for Every Moment", href: "/products/made-for-every-moment" },
          { label: "Moments of Glow", href: "/products/moments-of-glow" },
          { label: "Characters in Bloom", href: "/products/characters-in-bloom" },
          { label: "Clean Lines", href: "/products/clean-lines" },
          
        ],
      },
    ],
  },
  {
    label: "Collections",
    href: "/collections",
    children: [
      // {
      //   header: "Characters in Bloom",
      //   image: "/images/collection-image-1.png",
      //   description: "An eyewear collection that celebrates the beauty of unfolding personalities.",
      //   href: "/",
      // },
      {
        header: "Made for Every Moment",
        image: "/images/made-for-every-moment.png",
        description: "Embrace eyewear that honors the world around us and reflects your true self at every turn.",
        href: "/collections/made-for-every-moment",
      },
    ],
  },
  {
    label: "About",
    href: "/",
  },
];
