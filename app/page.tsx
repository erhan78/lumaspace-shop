import { prisma } from "@/lib/prisma";

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export default async function Home() {
  // Alle aktiven Produkte mit Varianten abrufen
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      variants: { select: { stock: true } },
    },
  });

  return (
    <main>
      <h1>Lumaspace</h1>

      {products.length === 0 ? (
        <p>Keine Produkte. Lauf <code>npx prisma db seed</code>.
         </p>
        ) : (
        <ul className="grid gap-8 xl:grid-cols-4">
          {products.map((p) => {
            const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
            const soldOut = totalStock === 0;
            return (
              <li key={p.id}>

                <div>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                  />
                </div>
                <div>
                  <p>
                    {p.category}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-light">
                    {p.name}
                  </h2>
                  <p>
                    {eur.format(Number(p.price))}
                  </p>
                  {soldOut && (
                    <p>
                      Ausverkauft
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
