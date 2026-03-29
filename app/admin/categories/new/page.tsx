"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import { CategoryForm } from "@/app/admin/categories/_components/CategoryForm";

const NewCategory = () => {
  const router = useRouter();

  const [name, setName] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const body: CreateCategoryRequestBody = {
        name,
      };

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("作成しました");
        router.push("/admin/categories");
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
      <h2 className="font-bold text-xl">カテゴリー作成</h2>
      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        isLoading={isLoading}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default NewCategory;
