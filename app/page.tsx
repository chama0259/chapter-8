"use client";

import useSWR from "swr";
import Link from "next/link";
import { formatDate } from "@/app/_utils/formatDate";
import { fetcher } from "./_libs/fetcher";
import { PostsIndexResponse } from "@/app/api/posts/route";

export default function PostList() {
  //SWR　（第一引数配列にするのはtokenなどの変数が必要な時だけ）
  const { data, error, isLoading } = useSWR<PostsIndexResponse>(
    "/api/posts",
    fetcher,
  );

  //①デフォルト値設定
  const posts = data?.posts || [];
  //②エラー判定
  if (error) {
    return (
      <div className="text-center py-10"> データの読み込みに失敗しました。</div>
    );
  }
  //Loading判定
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-4">記事を読み込み中です...</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8 ml-4">記事一覧</h1>
      <div className="flex flex-col gap-6">
        {posts?.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id}>
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
