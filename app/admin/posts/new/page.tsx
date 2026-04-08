"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/app/api/admin/posts/[id]/route";
import { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import { PostForm } from "@/app/admin/posts/_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const NewPostForm = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const fetchAllCategories = async () => {
      setIsLoading(true);

      try {
        //全カテゴリーを取得
        const catRes = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const catData = await catRes.json();
        setAllCategories(catData.categories);
      } catch (e) {
        console.error("データ取得エラー", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCategories();
  }, [token]);

  //カテゴリーの選択・解除
  const toggleCategory = (cat: Category) => {
    const isSelected = selectedCategories.some((s) => s.id === cat.id);
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter((s) => s.id !== cat.id));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);

    try {
      const body: CreatePostRequestBody = {
        title,
        content,
        thumbnailImageKey,
        categories: selectedCategories,
      };

      const response = await fetch(`/api/admin/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("作成しました");
        router.push("/admin/posts");
      } else {
        alert("作成に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-xl">記事作成</h2>
      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        allCategories={allCategories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        onSubmit={handleCreate}
        isLoading={isLoading}
      />
    </div>
  );
};

export default NewPostForm;
