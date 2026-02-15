import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-[#222222] p-6 font-bold text-white">
      <Link href="/">Blog</Link>
      <Link href="/contact">お問い合わせ</Link>
    </header>
  );
};

export default Header;
