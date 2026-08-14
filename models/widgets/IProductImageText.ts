export interface Link {
  type: string;
  url: string;
  text: string;
}
export interface IProductImageTextCollection {
  banners: IProductImageText[]
  direction?: string
}
export interface IProductImageText {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: any;
  links?: Link[];
  isVideo?: boolean;
}