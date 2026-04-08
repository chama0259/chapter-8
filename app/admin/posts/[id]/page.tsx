"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type {
  PostShowResponse,
  Category,
  UpdatePostRequestBody,
} from "@/app/api/admin/posts/[id]/route";
import { PostForm } from "@/app/admin/posts/_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const EditPostForm = () => {
  const { id } = useParams();
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

    const fetchData = async () => {
      setIsLoading(true);
      try {
        //全カテゴリーを取得・リクエストのheadersにtokenを付与しサーバー側で検証する
        const catRes = await fetch("/api/admin/categories", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const catData = await catRes.json();
        setAllCategories(catData.categories);

        //編集する記事のデータを取得・リクエストのheaderにtokenを付与しサーバー側で検証する
        const postRes = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const { post }: { post: PostShowResponse["post"] } =
          await postRes.json();

        //取得した値をStateに入れることでinputの中身が埋まる
        setTitle(post.title);
        setContent(post.content);
        setThumbnailImageKey(post.thumbnailImageKey);

        const currentCats = post.postCategories.map((pc) => pc.category);
        setSelectedCategories(currentCats);
      } catch (e) {
        console.error("データ取得エラー", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  //カテゴリーの選択・解除
  const toggleCategory = (cat: Category) => {
    const isSelected = selectedCategories.some((s) => s.id === cat.id);
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter((s) => s.id !== cat.id));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    if (!confirm("本当にこの記事を削除しますか？")) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (res.ok) {
        alert("削除しました");
        router.push("/admin/posts");
      } else {
        alert("削除に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);

    try {
      const body: UpdatePostRequestBody = {
        title,
        content,
        thumbnailImageKey,
        categories: selectedCategories,
      };
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert("更新しました");
        router.push("/admin/posts");
      } else {
        alert("更新に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-xl">記事編集</h2>
      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        allCategories={allCategories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditPostForm;
