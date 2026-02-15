"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/app/_utils/formatDate";
import type { Post } from "@/_types/post";

export default function PostDetail() {
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`,
      );

      if (!response.ok) {
        setError("データの取得に失敗しました");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setPost(data.post);
      setIsLoading(false);
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-4">記事を読み込み中です...</p>
      </div>
    );
  }
  if (error) return <div>{error}</div>;
  if (!post) return <div>記事が見つかりませんでした</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <article className="flex flex-col gap-4">
        <div className="relative w-full h-[400px]">
          <Image
            src={post.thumbnailUrl}
            alt={`${post.title}の画像`}
            fill
            priority
          />
        </div>
        <div className="flex items-center gap-3 mt-2">
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
        <h2 className="text-2xl font-semibold">{post.title}</h2>

        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </article>
      <div className="mt-12 pt-6">
        <Link href="/" className="text-blue-600 font-semibold hover:underline">
          記事一覧へ戻る
        </Link>
      </div>
    </main>
  );
}
