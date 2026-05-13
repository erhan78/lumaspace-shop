import "server-only";
import Stripe from "stripe";

// Stripe-Client Singleton.
// Wird nur serverseitig importiert (siehe "server-only" Import oben).
// Der Secret Key darf nie ins Frontend!

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY fehlt in .env");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
