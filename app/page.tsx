"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/app/_utils/formatDate";
import type { Post } from "@/_types/post";

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts",
      );
      const data = await response.json();
      setPosts(data.posts);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) {
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
        {posts.map((post) => (
          <Link href={`/post/${post.id}`} key={post.id}>
            <article className="flex flex-row gap-6 p-4 transition-colors border-b border-gray-100">
              <div className="relative flex-shrink-0 w-64 h-40">
                <Image
                  src={post.thumbnailUrl}
                  alt={`${post.title}の画像`}
                  fill
                  priority
                />
              </div>
              <div className="flex flex-col gap-2 flex-grow">
                <div className="flex items-center gap-3">
                  <time dateTime={post.createdAt} className="text-gray-400">
                    {formatDate(post.createdAt)}
                  </time>
                  <div className="flex gap-2">
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full"
                      >
                        {category}
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
