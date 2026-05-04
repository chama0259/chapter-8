"use client";

import { useState } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import type { Category } from "@/app/api/admin/posts/[id]/route";
import type { CreatePostRequestBody } from "@/app/api/admin/posts/route";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { PostForm } from "@/app/admin/posts/_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import type { PostsInputs } from "@/app/admin/posts/_components/PostForm";
import { useFetch } from "@/app/_hooks/useFetch";

const NewPostForm = () => {
  const router = useRouter();
  const { token } = useSupabaseSession();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostsInputs>({
    defaultValues: {
      title: "",
      content: "",
      thumbnailImageKey: "",
    },
  });

  const thumbnailImageKey = useWatch({ control, name: "thumbnailImageKey" });
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const { data, error, isLoading } = useFetch<CategoriesIndexResponse>(
    "/api/admin/categories",
  );

  // 3段階チェック: error -> loading -> no data
  if (error)
    return (
      <div className="text-center py-10"> データの読み込みに失敗しました。</div>
    );
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

  const allCategories = data.categories;

  //カテゴリーの選択・解除
  const toggleCategory = (cat: Category) => {
    const isSelected = selectedCategories.some((s) => s.id === cat.id);
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter((s) => s.id !== cat.id));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const onSubmit: SubmitHandler<PostsInputs> = async (data) => {
    if (!token) return;

    try {
      const body: CreatePostRequestBody = {
        ...data,
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
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-xl">記事作成</h2>
      <PostForm
        mode="new"
        register={register}
        setValue={setValue}
        thumbnailImageKey={thumbnailImageKey}
        errors={errors}
        allCategories={allCategories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default NewPostForm;
