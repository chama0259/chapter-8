"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/app/admin/categories/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import type { CategoryInputs } from "@/app/admin/categories/_components/CategoryForm";

const NewCategory = () => {
  const router = useRouter();
  const { token } = useSupabaseSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInputs>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<CategoryInputs> = async (data) => {
    if (!token) return;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("作成しました");
        router.push("/admin/categories");
      } else {
        alert("作成に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-xl">カテゴリー作成</h2>
      <CategoryForm
        mode="new"
        register={register}
        errors={errors}
        isLoading={isSubmitting}
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default NewCategory;
