"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type {
  PostShowResponse,
  Category,
  UpdatePostRequestBody,
} from "@/app/api/admin/posts/[id]/route";
import { PostForm } from "@/app/admin/posts/_components/PostForm";

const EditPostForm = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //全カテゴリーを取得
        const catRes = await fetch("/api/admin/categories");
        const catData = await catRes.json();
        setAllCategories(catData.categories);

        //編集する記事のデータを取得
        const postRes = await fetch(`/api/admin/posts/${id}`);
        const { post }: { post: PostShowResponse["post"] } =
          await postRes.json();

        //取得した値をStateに入れることでinputの中身が埋まる
        setTitle(post.title);
        setContent(post.content);
        setThumbnailUrl(post.thumbnailUrl);

        const currentCats = post.postCategories.map((pc) => pc.category);
        setSelectedCategories(currentCats);
      } catch (e) {
        console.error("データ取得エラー", e);
      }
    };
    fetchData();
  }, [id]);

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
    if (!confirm("本当にこの記事を削除しますか？")) return;

    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("削除しました");
      router.push("/admin/posts");
    } else {
      alert("削除に失敗しました");
    }
  };

  const handleUpdate = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setIsUpdating(true);

    try {
      const body: UpdatePostRequestBody = {
        title,
        content,
        thumbnailUrl,
        categories: selectedCategories,
      };
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      setIsUpdating(false);
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
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        allCategories={allCategories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default EditPostForm;
