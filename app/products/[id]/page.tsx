import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addToCartAction } from "@/app/actions/cart";

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });

  if (!product || !product.active) notFound();

  return (
    <main>
      <a href="/">← Zurück</a>

      <div>
        <img src={product.imageUrl} alt={product.name} />
      </div>

      <p>{product.category}</p>
      <h1>{product.name}</h1>
      <p>{eur.format(Number(product.price))}</p>
      <p>{product.description}</p>

      <form action={addToCartAction}>
        <input type="hidden" name="productId" value={product.id} />
        <label htmlFor="variantId">Variante</label>
        <select id="variantId" name="variantId" required>
          {product.variants.length === 0 && (
            <option value="">Keine Varianten</option>
          )}
          {product.variants.map((v) => (
            <option
              key={v.id}
              value={v.id}
              disabled={v.stock === 0}
            >
              {v.label} {v.stock === 0 ? "(ausverkauft)" : `(${v.stock} verfügbar)`}
            </option>
          ))}
        </select>

        <label htmlFor="quantity">Menge</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          defaultValue={1}
        />

        <button type="submit" disabled={product.variants.every((v) => v.stock === 0)}>
          In den Warenkorb
        </button>
      </form>
    </main>
  );
}
