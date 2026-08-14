export interface ICampaignCard {
  image?: {
    desktop?: {
      url?: string;
      alt?: string;
    };
    mobile?: {
      url?: string;
      alt?: string;
    };
  };
  name?: string;
  cta?: {
    text?: string;
    href?: string;
  };
  icon?: { url: string; alt: string };
}

export interface ICampaignCollection {
  campaigns?: ICampaignCard[];
}
