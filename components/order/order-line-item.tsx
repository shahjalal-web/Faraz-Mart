import Link from "next/link";
import type { OrderItem } from "@/types/order";
import { iconForCategory } from "@/lib/visual";
import { formatPrice } from "@/lib/utils";
import { MediaTile } from "@/components/ui/media-tile";

export function OrderLineItem({ item }: { item: OrderItem }) {
  const Icon = iconForCategory(item.categoryId);

  return (
    <div className="flex items-center gap-4 py-4">
      <Link href={`/product/${item.slug}`} className="shrink-0">
        <MediaTile seed={item.thumbnail} icon={Icon} className="size-16 rounded-button" iconClassName="size-6" />
      </Link>
      <div className="flex flex-1 flex-col gap-0.5">
        <Link href={`/product/${item.slug}`} className="text-sm font-semibold text-foreground hover:text-primary">
          {item.name}
        </Link>
        {(item.color || item.size) && (
          <p className="text-xs text-muted-foreground">
            {item.color && <span>Color: {item.color}</span>}
            {item.color && item.size && <span> · </span>}
            {item.size && <span>Size: {item.size}</span>}
          </p>
        )}
        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
    </div>
  );
}
