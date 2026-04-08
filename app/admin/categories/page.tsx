"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function CategoriesList() {
  const [categories, setCategories] = useState<
    CategoriesIndexResponse["categories"]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        //Next.jsのAPIに切り替え。ローカルなのでheaders(認証)は不要。→headersでtoken検証追加
        const res = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const { categories } = await res.json();
        setCategories(categories);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-4">カテゴリーを読み込み中です...</p>
      </div>
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
        {categories?.map((category) => (
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
