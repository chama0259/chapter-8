"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { CategoryForm } from "@/app/admin/categories/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const EditCategory = () => {
  const { id } = useParams();
  const router = useRouter();

  // const [category, setCategory] = useState();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const fetchCategory = async () => {
      setIsLoading(true);

      try {
        //編集するカテゴリーを取得
        const res = await fetch(`/api/admin/categories/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const { category } = await res.json();
        setName(category.name);
      } catch (e) {
        console.error("データ取得エラー", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, [id, token]);

  const handleDelete = async () => {
    if (!token) return;
    if (!confirm("本当にこのカテゴリーを削除しますか？")) return;
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.SyntheticEvent) => {
    if (!token) return;
    //HTML<form>のsubmit時のページリロード機能を防ぐ
    e.preventDefault();

    setIsLoading(true);

    try {
      const body: UpdateCategoryRequestBody = {
        name,
      };
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        alert("更新しました");
        router.push("/admin/categories");
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
      <h2 className="font-bold text-xl">カテゴリー編集</h2>
      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditCategory;
