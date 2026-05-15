import { prisma } from "@/lib/prisma";

// Order Input-Typ für Funktion
export type CreateOrderInput = {
  items: Array<{
    productId: string;
    variantId: string | null;
    quantity: number;
    priceSnapshot: string; // Decimal als String, z.B. "289.00"
  }>;
  userId?: string | null;
  guestEmail?: string | null;
};

// Funktion zum Erstellen einer Pending Order
export async function createPendingOrder(input: CreateOrderInput) {
  if (input.items.length === 0) {
    throw new Error("Cart ist leer, kann keine Order erstellen.");
  }

  if (!input.userId && !input.guestEmail) {
    throw new Error("Order braucht entweder userId oder guestEmail.");
  }

  // Gesamtsumme aus allen Items berechnen.
  let total = 0;
  for (const item of input.items) {
    const linePrice = Number(item.priceSnapshot) * item.quantity;
    total += linePrice;
  }

  const order = await prisma.order.create({
    data: {
      userId: input.userId ?? null,
      guestEmail: input.guestEmail ?? null,
      total: total.toFixed(2), // als String für Decimal-Spalte
      status: "PENDING",
      items: {
        create: input.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.priceSnapshot,
        })),
      },
    },
    include: {
      items: true,
    },
  });
}