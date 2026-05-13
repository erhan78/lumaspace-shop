//https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "Aurora Pendant",
    description: "Handgefertigte Hängeleuchte aus mundgeblasenem Glas.",
    price: "289.00",
    imageUrl: "https://placehold.co/800x800?text=Aurora+Pendant",
    category: "Beleuchtung",
    variants: [
      { label: "Klein", stock: 12 },
      { label: "Groß", stock: 6 },
    ],
  },
  {
    name: "Nimbus Floor Lamp",
    description: "Stehleuchte mit dimmbarem LED und Walnussfuß.",
    price: "459.00",
    imageUrl: "https://placehold.co/800x800?text=Nimbus+Floor",
    category: "Beleuchtung",
    variants: [
      { label: "Walnuss", stock: 8 },
      { label: "Eiche", stock: 4 },
    ],
  },
  {
    name: "Orbit Side Table",
    description: "Beistelltisch aus Travertin, schlichtes Design.",
    price: "349.00",
    imageUrl: "https://placehold.co/800x800?text=Orbit+Table",
    category: "Möbel",
    variants: [
      { label: "Travertin Beige", stock: 5 },
      { label: "Travertin Grau", stock: 3 },
    ],
  },
  {
    name: "Lumen Wall Sconce",
    description: "Wandleuchte mit warmem indirektem Licht.",
    price: "179.00",
    imageUrl: "https://placehold.co/800x800?text=Lumen+Sconce",
    category: "Beleuchtung",
    variants: [{ label: "Messing", stock: 20 }],
  },
  {
    name: "Drift Throw Blanket",
    description: "Wolldecke aus Merino, 130x180cm.",
    price: "129.00",
    imageUrl: "https://placehold.co/800x800?text=Drift+Throw",
    category: "Accessoires",
    variants: [
      { label: "Sand", stock: 15 },
      { label: "Stein", stock: 10 },
      { label: "Nacht", stock: 7 },
    ],
  },
];

async function main() {
  //Datenbank leeren vor seed
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.productVariant.deleteMany(),
    prisma.product.deleteMany(),
  ]);
  // Produkte aus products werden hinzugefügt
  // npx prisma db seed 
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        variants: { create: product.variants },
      },
    });
    console.log(`Produkt erstellt: ${createdProduct.name}`);
  }

  console.log(`Datenbank erfolgreich mit ${products.length} Produkten gefüllt.`);}


  main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });