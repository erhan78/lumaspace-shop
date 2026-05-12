import Link from "next/link";
import { getCartCount } from "@/lib/cart";

// Header wird auf jeder Seite angezeigt.
export default async function Header() {
  const cartCount = await getCartCount();

  return (
    <header>
      {/* Logo / Startseite */}
      <Link href="/">Lumaspace</Link>

      <nav>
        <Link href="/">Shop</Link>

        {/* Warenkorb mit Anzahl in Klammern, wenn was drin ist */}
        <Link href="/cart">
          Warenkorb
          {cartCount > 0 && <span> ({cartCount})</span>}
        </Link>
      </nav>
    </header>
  );
}
