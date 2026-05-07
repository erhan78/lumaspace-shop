import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { active: true } }),
    
    prisma.product.findMany({
      where: { active: true },
      distinct: ["category"],
      select: { category: true },
    }),
  ]);

  return (
    <main className="min-h-screen bg-bg text-ink p-12">
      <h1 className="font-display text-6xl font-light">Lumaspace</h1>

      <div className="mt-8 text-ink-3">
        <p>Anzahl Produkte: {products.length}</p>
        <p>Anzahl Kategorien: {categories.length}</p>
        {products[0] && (
          <p className="mt-2">Erstes Produkt: {products[0].name}</p>
        )}
        {categories[0] && <p>Erste Kategorie: {categories[0].category}</p>}
      </div>
    </main>
  );
}
