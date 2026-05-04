"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteGuard } from "@/app/_hooks/useRouteGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();

  const pathname = usePathname();

  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  const commonStyles =
    "w-full px-6 py-4 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 font-medium border-l-4 border-transparent hover:border-blue-700";

  return (
    <div className="flex">
      {/* サイドバー */}
      <aside className="w-64 min-h-screen bg-gray-50 border-r border-gray-200">
        <nav className="flex flex-col">
          <Link
            href="/admin/posts"
            className={`${commonStyles} ${isSelected("/admin/posts") && "bg-blue-100"}`}
          >
            記事一覧
          </Link>
          <Link
            href="/admin/categories"
            className={`${commonStyles} ${isSelected("/admin/categories") && "bg-blue-100"}`}
          >
            カテゴリー一覧
          </Link>
        </nav>
      </aside>
      {/* メインエリア */}
      <main className="flex-1 bg-white p-10 min-w-0"> {children}</main>
    </div>
  );
}
