import { getVariantGroup } from "@/lib/utils";
import { FetchStatus, TransformedProducts } from "@/types/plp";
import { ProductCard } from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ProductPlaceholderCard from "./ProductPlaceholderCard";

type ProductSlotProps = {
  index: number;
  transformedProducts: TransformedProducts;
  status: FetchStatus;
  lastInRow?: boolean;
};

const ProductSlot = ({ index, transformedProducts, status }: ProductSlotProps) => {
  if (status === "loading" || status === "idle") return <ProductCardSkeleton />;

  const group = getVariantGroup(transformedProducts, index);
  if (!group) return null; // No product for this slot

  return <ProductCard products={group} />;
};

export default ProductSlot;
