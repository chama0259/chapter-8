"use client";

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
import { useFetch } from "@/app/_hooks/useFetch";

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
  //カテゴリー選択操作のフラグ
  const [hasUserChangedCategories, setHasUserChangedCategories] =
    useState(false);

  //SWR
  const {
    data: postData,
    error: postError,
    isLoading: isPostLoading,
  } = useFetch<PostShowResponse>(id && token ? `/api/admin/posts/${id}` : null);
  const {
    data: catData,
    error: catError,
    isLoading: isCatLoading,
  } = useFetch<CategoriesIndexResponse>(token ? "/api/admin/categories" : null);

  useEffect(() => {
    //既に初期化済みの場合は何もしない
    if (isInitialized.current) return;
    //データ揃ってから初期化処理行う。
    if (!postData?.post || !catData?.categories) return;

    const { post } = postData;
    reset({
      title: post.title,
      content: post.content,
      thumbnailImageKey: post.thumbnailImageKey,
    });

    //「初期化完了」と旗立てる
    isInitialized.current = true;
  }, [postData, catData, reset]);

  if (postError || catError)
    return (
      <div className="text-center py-10"> データの読み込みに失敗しました。</div>
    );
  if (isPostLoading || isCatLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-4">データを読み込み中です...</p>
      </div>
    );
  if (!postData || !catData)
    return (
      <div className="text-center py-10">データが見つかりませんでした。</div>
    );

  //カテゴリーの選択・解除
  const initialSelectedCategories = postData.post.postCategories.map(
    (pc) => pc.category,
  );
  const selectedCategoriesForView = hasUserChangedCategories
    ? selectedCategories
    : initialSelectedCategories;
  const selectedCategoriesForSubmit = selectedCategoriesForView;

  const toggleCategory = (cat: Category) => {
    setHasUserChangedCategories(true);
    const isSelected = selectedCategoriesForView.some((s) => s.id === cat.id);
    if (isSelected) {
      setSelectedCategories(
        selectedCategoriesForView.filter((s) => s.id !== cat.id),
      );
    } else {
      setSelectedCategories([...selectedCategoriesForView, cat]);
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
        categories: selectedCategoriesForSubmit,
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

  // 早期リターン済みなので optional chain 不要//何でここなの？？
  const allCategories = catData.categories;

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
        selectedCategories={selectedCategoriesForView}
        toggleCategory={toggleCategory}
        onSubmit={handleSubmit(onSubmit)}
        onDelete={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default EditPostForm;
