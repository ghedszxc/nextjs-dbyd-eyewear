const stores: RegionGroup[] = [
  {
    region: "Europe",
    countries: [
      {
        country: "Germany",
        stores: [
          { id: "eu-de-1", name: "MediaMarkt", url: "#" },
          { id: "eu-de-2", name: "Saturn", url: "#" },
        ],
      },
      {
        country: "France",
        stores: [
          { id: "eu-fr-1", name: "Fnac", url: "#" },
          { id: "eu-fr-2", name: "Darty", url: "#" },
        ],
      },
    ],
  },
  {
    region: "Asia",
    countries: [
      {
        country: "Singapore (SG)",
        stores: [
          { id: "as-sg-1", name: "Lazada Singapore", url: "#" },
          { id: "as-sg-2", name: "Shopee Singapore", url: "#" },
        ],
      },
      {
        country: "Philippines (PH)",
        stores: [
          { id: "as-ph-1", name: "Lazada Philippines", url: "#" },
          { id: "as-ph-2", name: "Shopee Philippines", url: "#" },
        ],
      },
      {
        country: "Japan",
        stores: [
          { id: "as-jp-1", name: "Yodobashi Camera", url: "#" },
          { id: "as-jp-2", name: "Bic Camera", url: "#" },
        ],
      },
    ],
  },
  {
    region: "Americas",
    countries: [
      {
        country: "United States",
        stores: [
          { id: "am-us-1", name: "Amazon US", url: "#" },
          { id: "am-us-2", name: "Best Buy", url: "#" },
        ],
      },
      {
        country: "Canada",
        stores: [
          { id: "am-ca-1", name: "Amazon Canada", url: "#" },
          { id: "am-ca-2", name: "Best Buy Canada", url: "#" },
        ],
      },
      {
        country: "Brazil",
        stores: [
          { id: "am-br-1", name: "Magazine Luiza", url: "#" },
          { id: "am-br-2", name: "Americanas", url: "#" },
        ],
      },
    ],
  },
  {
    region: "Africa",
    countries: [
      {
        country: "South Africa",
        stores: [
          { id: "af-za-1", name: "Takealot", url: "#" },
          { id: "af-za-2", name: "Makro South Africa", url: "#" },
        ],
      },
      {
        country: "Nigeria",
        stores: [
          { id: "af-ng-1", name: "Jumia Nigeria", url: "#" },
          { id: "af-ng-2", name: "Konga", url: "#" },
        ],
      },
      { country: "Kenya", stores: [{ id: "af-ke-1", name: "Jumia Kenya", url: "#" }] },
    ],
  },
];

export default stores;
