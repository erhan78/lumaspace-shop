import { getCart } from "@/lib/cart";
import Link from "next/link";
import { removeFromCartAction, updateCartQuantityAction } from "@/app/actions/cart";

const eur = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export default async function CartPage() {
  const items = await getCart();

  //Berechnet Gesamtpreis aller Cart-Items.
  let total = 0;
  for (const item of items) {
    const price = Number(item.product.price);
    const quantity = item.quantity;

    total += price * quantity;
  }

  return (
  <main>
    <a href="/">← Zurück</a>
    
    <h1>Warenkorb</h1>

    {/*Wenn warenkorb leer ist.*/}
    {items.length === 0 && (
        <p>
          Dein Warenkorb ist leer.{" "}
          <Link href="/">Produkte ansehen</Link>.
        </p>
      )}

    {/*Wenn warenkorb items hat, dann zeige sie an.*/}
    {items.length > 0 && (
        <>
          <ul>
            {items.map((item) => {
              const product = item.product;

              return (
                <li key={item.id}>
                  {/* Produktbild */}
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    width={80}
                  />

                  {/* Produktinformationen */}
                  <div>
                    <p>{product.name}</p>
                    {item.variant && <p>{item.variant.label}</p>}
                    <p>{eur.format(Number(product.price))}</p>
                  </div>

                  {/* Menge ändern */}
                  <form action={updateCartQuantityAction}>
                    <input
                      type="hidden"
                      name="itemId"
                      value={item.id}
                    />
                    <input
                      type="number"
                      name="quantity"
                      min={0}
                      defaultValue={item.quantity}
                    />

                    <button type="submit">Menge aktualisieren</button>
                  </form>

                  {/* Produkt entfernen */}
                  <form action={removeFromCartAction}>
                    <input
                      type="hidden"
                      name="itemId"
                      value={item.id}
                    />

                    <button type="submit">Entfernen</button>
                  </form>
                </li>
              );
            })}
          </ul>

        </>   
      )}
  </main>);
}
