export interface IBrandsTab {
  title?: string;
  subTitle?: string;
  items: IBrandTab[];
}

export interface IBrandTab {
  title?: string;
  subTitle?: string;
  leftItem: IBrandTabContent;
  rightItem: IBrandTabContent;
}

export interface IBrandTabContent {
  title?: string;
  subTitle?: string;
  picture?: string;
  color?: string;
  cta?: any;
}
