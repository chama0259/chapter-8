"use client";

import useSWR from "swr";
import { useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from "@/app/admin/categories/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import type { CategoryInputs } from "@/app/admin/categories/_components/CategoryForm";
import { CategoryShowResponse } from "@/app/api/admin/categories/[id]/route";
import { fetcher } from "@/app/_libs/fetcher";

const EditCategory = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInputs>({
    defaultValues: {
      name: "",
    },
  });

  const isInitialized = useRef(false);
  //SWR
  const { data, error, isLoading } = useSWR<CategoryShowResponse>(
    id && token ? [`/api/admin/categories/${id}`, token] : null,
    fetcher,
  );

  useEffect(() => {
    //データがない、または既に自初期化済みの場合は何もしない
    if (!data?.category?.name || isInitialized.current) return;

    //1.カテゴリー編集画面の基本情報をセット
    const timer = setTimeout(() => {
      reset({ name: data.category.name });
      //2.「初期化完了」と旗立てる
      isInitialized.current = true;
    }, 0);
    return () => clearTimeout(timer); //クリーンアップ
  }, [data, reset]);

  if (error) {
    return (
      <div className="text-center py-10"> データの読み込みに失敗しました。</div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="ml-4">データを読み込み中です...</p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<CategoryInputs> = async (data) => {
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("更新しました");
        router.push("/admin/categories");
      } else {
        alert("更新に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    if (!confirm("本当にこのカテゴリーを削除しますか？")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (res.ok) {
        alert("削除しました");
        router.push("/admin/categories");
      } else {
        alert("削除に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-xl">カテゴリー編集</h2>
      <CategoryForm
        mode="edit"
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        onDelete={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default EditCategory;
