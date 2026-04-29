"use client";

import Link from "next/link";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useFetch } from "@/app/_hooks/useFetch";

export default function CategoriesList() {
  const { token } = useSupabaseSession();

  const { data, error, isLoading } = useFetch<CategoriesIndexResponse>(
    token ? "/api/admin/categories" : null,
  );

  if (error) {
    return (
      <div className="text-center py-10"> データの読み込みに失敗しました。</div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-4">カテゴリーを読み込み中です...</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="text-center py-10">データが見つかりませんでした。</div>
    );
  }

  const categories = data.categories;

  if (categories.length === 0) {
    return (
      <main className="w-full px-6 ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">カテゴリー一覧</h2>
          <Link href={`/admin/categories/new`}>
            <button
              type="button"
              className="  px-5 py-2.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-gray-300 "
            >
              新規作成
            </button>
          </Link>
        </div>
        <p className="text-gray-500 text-center py-10">
          カテゴリーが登録されていません。
        </p>
      </main>
    );
  }

  return (
    <main className="w-full px-6 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">カテゴリー一覧</h2>
        <Link href={`/admin/categories/new`}>
          <button
            type="button"
            className="  px-5 py-2.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-gray-300 "
          >
            新規作成
          </button>
        </Link>
      </div>
      <div className="flex flex-col">
        {categories.map((category) => (
          <Link href={`/admin/categories/${category.id}`} key={category.id}>
            <div className="flex flex-col gap-2 p-6 border-b border-gray-100 transition-all hover:bg-gray-50 cursor-pointer w-full">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
