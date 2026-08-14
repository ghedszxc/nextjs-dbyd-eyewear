import { FetchStatus, TransformedProducts } from "@/types/plp";
import { CampaignBanner } from "@/adapter/PLP/adapter";
import ProductSlot from "./ProductSlot";
import CampaignBannerCard from "./CampaignBanner";
import TileBanner from "./TileBanner";

type LayoutBlock =
  | { type: "products"; items: TransformedProducts }
  | { type: "fullRow"; banner: CampaignBanner }
  | { type: "singleTile"; banner: CampaignBanner; products: TransformedProducts }
  | { type: "halfWidthTile"; banner: CampaignBanner; product?: TransformedProducts };    

const BlocksGrid = ({
  blocks,
  status,
  isMobile,
  slotCount,
  className,
}: {
  blocks: LayoutBlock[];
  status: FetchStatus;
  isMobile: boolean;
  slotCount: number;
  className?: string;
}) => {
  const productCellClass = isMobile ? "col-span-1" : "col-span-1 lg:col-span-2";
  const bannerCellClass = isMobile ? "col-span-2 -mx-2" : "col-span-2 lg:col-span-6";
  const tileCellClass = isMobile ? "col-span-1 -mx-2" : "col-span-1 lg:col-span-2";

  // Loading state: products haven't arrived yet, so buildPLPLayout produced no product rows.
  // Render skeleton slots like ProductsGrid does; banners take over once data is ready.
  if (status === "loading") {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-6 ${className ?? ""}`}>
        {Array.from({ length: slotCount }).map((_, i) => (
          <div key={`skel-${i}`} className={productCellClass}>
            <ProductSlot index={i} transformedProducts={[]} status={status} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-6 ${className ?? ""}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "products":
            return block.items.map((p, i) => (
              <div key={`${idx}-p-${i}`} className={productCellClass}>
                <ProductSlot index={i} transformedProducts={block.items} status={status} />
              </div>
            ));

          case "fullRow":
            return (
              <div key={`${idx}-full`} className={bannerCellClass}>
                <CampaignBannerCard banner={block.banner} />
              </div>
            );

          case "singleTile": {
            const tilePosition = block.banner.side === "right" ? "right" : block.banner.side === "center" ? "center" : "left";
            
            if (tilePosition === "center" && !isMobile) {
              // Center: product + tile + product
              return (
                <div key={`${idx}-st`} className="contents">
                  {block.products[0] && (
                    <div className={productCellClass}>
                      <ProductSlot index={0} transformedProducts={block.products} status={status} />
                    </div>
                  )}
                  <div className={tileCellClass}>
                    <TileBanner banner={block.banner} variant="single" />
                  </div>
                  {block.products[1] && (
                    <div className={productCellClass}>
                      <ProductSlot index={1} transformedProducts={block.products} status={status} />
                    </div>
                  )}
                </div>
              );
            }

            if (tilePosition === "left" || tilePosition === "right" && !isMobile) {
              // Left/Right positioning
              const tileFirst = tilePosition !== "right";
              <div key={`${idx}-st`} className="contents">
                {tileFirst && (
                  <div className={tileCellClass}>
                    <TileBanner banner={block.banner} variant="single" />
                  </div>
                )}
                {block.products.map((p, i) => (
                  <div key={`${idx}-st-p-${i}`} className={productCellClass}>
                    <ProductSlot index={i} transformedProducts={block.products} status={status} />
                  </div>
                ))}
                {!tileFirst && (
                  <div className={tileCellClass}>
                    <TileBanner banner={block.banner} variant="single" />
                  </div>
                )}
              </div>
            }
 
            return (
              <div key={`${idx}-st`} className="col-span-2 -mx-2 lg:col-span-6">
                <TileBanner banner={block.banner} variant="single" />
              </div>
            );
          }

          case "halfWidthTile": {
            const tilePosition = block.banner.side === "right" ? "right" : "left";
            const tileFirst = block.banner.side !== "right";

            if (tilePosition === "right" || tilePosition === "left" && !isMobile) {
              <div key={`${idx}-ht`} className="contents">
                {tileFirst && (
                  <div className={isMobile ? "col-span-2 -mx-2" : "col-span-3"}>
                    <TileBanner banner={block.banner} variant="half-width" />
                  </div>
                )}
                {block.product && (
                  <div className="col-span-3">
                    <ProductSlot index={0} transformedProducts={[block.product]} status={status} />
                  </div>
                )}
                {!tileFirst && (
                  <div className={isMobile ? "col-span-2 -mx-2" : "col-span-3"}>
                    <TileBanner banner={block.banner} variant="half-width" />
                  </div>
                )}
              </div>
            }

            return (
              <div key={`${idx}-ht`} className={bannerCellClass}>
                <TileBanner banner={block.banner} variant="half-width" />
              </div>
            );
          }
        }
      })}
    </div>
  );
};

export default BlocksGrid;
