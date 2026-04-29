"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/app/_utils/formatDate";
import type { PostShowResponse } from "@/app/api/posts/[id]/route";
import { supabase } from "@/app/_libs/supabase";
import { useFetch } from "@/app/_hooks/useFetch";

export default function PostDetail() {
  const { id } = useParams();
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(
    null,
  );

  const { data, error, isLoading } = useFetch<PostShowResponse>(
    id ? `/api/posts/${id}` : null,
  );

  useEffect(() => {
    if (!data?.post?.thumbnailImageKey) {
      return;
    }

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(data.post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };
    fetcher();
  }, [data?.post?.thumbnailImageKey]);

  //②エラー判定
  if (error) {
    return <div className="text-center py-10">データの読み込みに失敗しました。</div>;
  }
  //③isLoading判定
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-4">記事を読み込み中です...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">記事が見つかりませんでした。</div>
    );
  }

  const post = data.post;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <article className="flex flex-col gap-4">
        {thumbnailImageUrl && (
          <div className="relative w-full h-[400px]">
            <Image src={thumbnailImageUrl} alt={"thumbnail"} fill priority />
          </div>
        )}
        <div className="flex items-center gap-3 mt-2">
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
