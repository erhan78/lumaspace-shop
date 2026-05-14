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
