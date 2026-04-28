"use client";

import useSWR from "swr";
import { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import type {
  PostShowResponse,
  Category,
  UpdatePostRequestBody,
} from "@/app/api/admin/posts/[id]/route";
import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import { PostForm } from "@/app/admin/posts/_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import type { PostsInputs } from "@/app/admin/posts/_components/PostForm";
import { fetcher } from "@/app/_libs/fetcher";

const EditPostForm = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();

  //RHF
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostsInputs>();

  const thumbnailImageKey = useWatch({ control, name: "thumbnailImageKey" });
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const isInitialized = useRef(false);

  //SWR-1・・・全カテゴリー取得用
  const {
    data: catData,
    error: catError,
    isLoading: isCatLoading,
  } = useSWR<CategoriesIndexResponse>(
    token ? ["/api/admin/categories", token] : null,
    fetcher,
  );
  //SWR-2・・・編集対象の記事取得用
  const {
    data: postData,
    error: postError,
    isLoading: isPostLoading,
  } = useSWR<PostShowResponse>(
    id && token ? [`/api/admin/posts/${id}`, token] : null,
    fetcher,
  );

  useEffect(() => {
    //データがない、または既に初期化済みの場合は何もしない
    if (!postData?.post || isInitialized.current) return;

    const { post } = postData;
    //1.フォームの基本情報をリセット
    const timer = setTimeout(() => {
      reset({
        title: post.title,
        content: post.content,
        thumbnailImageKey: post.thumbnailImageKey,
      });
      //2.選択済みカテゴリーの状態を更新
      const currentCats = post.postCategories.map((pc) => pc.category);
      setSelectedCategories(currentCats);

      //「初期化完了」と旗立てる
      isInitialized.current = true;
    }, 0);

    return () => clearTimeout(timer); //クリーンアップ
  }, [postData, reset]);

  //①デフォルト値の設定
  const allCategories = catData?.categories || [];
  const isLoading = isCatLoading || isPostLoading;
  const error = catError || postError;
  //②エラー判定・
  if (error) {
    return (
      <div className="text-center py-10"> データの読み込みに失敗しました。</div>
    );
  }
  //③Loading判定・
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-4">データを読み込み中です...</p>
      </div>
    );
  }

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
    }
  };

  const onSubmit: SubmitHandler<PostsInputs> = async (data) => {
    if (!token) return;

    try {
      const body: UpdatePostRequestBody = {
        ...data,
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
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-xl">記事編集</h2>
      <PostForm
        mode="edit"
        register={register}
        setValue={setValue}
        thumbnailImageKey={thumbnailImageKey}
        errors={errors}
        allCategories={allCategories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        onSubmit={handleSubmit(onSubmit)}
        onDelete={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default EditPostForm;
