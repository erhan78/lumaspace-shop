import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { getCartCount } from "@/lib/cart";

// Header wird auf jeder Seite angezeigt.
export default async function Header() {
  const cartCount = await getCartCount();

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      {/* Logo / Startseite */}
      <Link href="/" className="text-lg font-medium">
        Lumaspace
      </Link>

      <nav className="flex items-center gap-4">
        <Link href="/">Shop</Link>

        {/* Warenkorb mit Anzahl in Klammern, wenn was drin ist */}
        <Link href="/cart">
          Warenkorb
          {cartCount > 0 && <span> ({cartCount})</span>}
        </Link>

        {/* Wenn nicht eingeloggt: Sign-In / Sign-Up Buttons */}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button type="button">Anmelden</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button type="button">Registrieren</button>
          </SignUpButton>
        </Show>

        {/* Wenn eingeloggt: Avatar mit Dropdown (Profile, Logout) */}
        <Show when="signed-in">
          <UserButton />
        </Show>
      </nav>
    </header>
  );
}
