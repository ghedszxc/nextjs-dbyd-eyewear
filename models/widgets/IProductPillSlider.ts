export interface IProductPillSliderItem {
  label: string;
  name: string;
  price: string;
  image: {
    url: string;
    alt: string;
  };
  thumbnail: {
    url: string;
    alt: string;
  };
  icon?: {
    url: string;
    alt: string;
  };
  targetUrl: string;
  ctaText: string;
  ctaLogo?: string;
  ctaColor?: string;
}

export interface IProductPillSlider {
  title: string;
  pills: IProductPillSliderItem[];
  visibleButtonCount?: number;
}
