"use client";

import useSWR from "swr";
import Link from "next/link";
import { formatDate } from "@/app/_utils/formatDate";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { fetcher } from "@/app/_libs/fetcher";
import { PostsIndexResponse } from "@/app/api/admin/posts/route";

export default function PostList() {
  const { token } = useSupabaseSession();

  //**SWR**
  const { data, error, isLoading } = useSWR<PostsIndexResponse>(
    token ? ["/api/admin/posts", token] : null,
    fetcher,
  );
  //①デフォルト値の設定
  const posts = data?.posts || [];
  //②エラー判定
  if (error) {
    return (
      <div className="text-center py-10"> データの読み込みに失敗しました。</div>
    );
  }
  //③Loading判定
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-4">記事を読み込み中です...</p>
      </div>
    );
  }

  return (
    <main className="w-full px-6 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">記事一覧</h2>
        <Link href={`/admin/posts/new`}>
          <button
            type="button"
            className="  px-5 py-2.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-gray-300 "
          >
            新規作成
          </button>
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        {/* デフォルト値設定で空配列保証されたので？不要 */}
        {posts.map((post) => (
          <Link href={`/admin/posts/${post.id}`} key={post.id}>
            <article className="flex flex-row gap-6 p-4 border-b border-gray-100 transition-all hover:bg-gray-100 cursor-pointer">
              <div className="flex flex-col gap-2 flex-grow">
                <div className="flex items-center gap-3">
                  <time
                    // new Date() したものを .toISOString() で文字列に戻す。機械用の生データに戻す。
                    dateTime={new Date(post.createdAt).toISOString()}
                    className="text-gray-400"
                  >
                    {formatDate(post.createdAt)}
                  </time>
                  <div className="flex gap-2">
                    {post.postCategories.map((item) => (
                      <span
                        key={item.category.id}
                        className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full"
                      >
                        {item.category.name}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>

                <div
                  className="text-gray-600 text-sm line-clamp-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
