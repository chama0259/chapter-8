import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64 min-h-screen bg-gray-50 border-r border-gray-200">
        <nav className="flex flex-col">
          <Link
            href="/admin/posts"
            className="w-full px-6 py-4 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 font-medium border-l-4 border-transparent hover:border-blue-700"
          >
            記事一覧
          </Link>
          <Link
            href="/admin/categories"
            className="w-full px-6 py-4 text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 font-medium border-l-4 border-transparent hover:border-blue-700"
          >
            カテゴリー一覧
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-white p-10 min-w-0"> {children}</main>
    </div>
  );
}
