import { Badge } from "@/components/ui/badge";
import { calculateDiscountPercent } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductBadges({ product, className }: { product: Product; className?: string }) {
  const discount = product.salePrice ? calculateDiscountPercent(product.price, product.salePrice) : 0;

  return (
    <div className={className}>
      {discount > 0 && <Badge variant="danger">-{discount}%</Badge>}
      {product.isNewArrival && <Badge variant="success">New</Badge>}
      {product.isBestSeller && !product.isNewArrival && <Badge variant="dark">Best Seller</Badge>}
      {product.stockStatus === "low-stock" && <Badge variant="warning">Low Stock</Badge>}
    </div>
  );
}
