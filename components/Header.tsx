import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/">Lumaspace</Link>
      <nav>
        <Link href="/">Shop</Link>
        <Link href="/cart">Warenkorb</Link>
      </nav>
    </header>
  );
}
