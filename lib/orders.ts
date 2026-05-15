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
}