"use client";

import { ChangeEvent, useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { supabase } from "@/app/_libs/supabase";
import { v4 as uuidv4 } from "uuid"; //固有IDを生成するライブラリ
import type { Category } from "@/app/api/admin/posts/[id]/route";
import Image from "next/image";

export type PostsInputs = {
  title: string;
  content: string;
  thumbnailImageKey: string;
};

type Props = {
  mode: "new" | "edit";
  register: UseFormRegister<PostsInputs>;
  setValue: UseFormSetValue<PostsInputs>;
  thumbnailImageKey: string;
  errors: FieldErrors<PostsInputs>;
  allCategories: Category[];
  selectedCategories: Category[];
  toggleCategory: (cat: Category) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onDelete?: () => void;
  isLoading: boolean;
};

export const PostForm = (props: Props) => {
  const {
    mode,
    register,
    setValue,
    thumbnailImageKey,
    errors,
    allCategories,
    selectedCategories,
    toggleCategory,
    onSubmit,
    onDelete,
    isLoading,
  } = props;

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  );

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      //画像が選択されていないのでreturn
      return;
    }

    const file = event.target.files[0]; //選択された画像を取得

    const filePath = `private/${uuidv4()}`; //ファイルパスを指定

    //supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    //アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    //data.pathに、画像固有のKeyが入っているので、thumbnailImageKeyに格納する
    setValue("thumbnailImageKey", data.path);
  };

  useEffect(() => {
    if (!thumbnailImageKey) return;

    //アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };
    fetcher();
  }, [thumbnailImageKey]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-10 mb-20">
      {/* RHF は thumbnailImageKey を送信データに含めてくれる */}
      <input type="hidden" {...register("thumbnailImageKey")} />
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="w-32 ">
          タイトル
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <input
            {...register("title", {
              required: "タイトルは必須です",
            })}
            disabled={isLoading}
            id="title"
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-red-500 text-xs mt-1">{errors.title?.message}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="w-32">
          内容
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <textarea
            {...register("content", {
              required: "本文は必須です",
            })}
            disabled={isLoading}
            id="content"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-red-500 text-xs mt-1">{errors.content?.message}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="thumbnailImage" className="w-32">
          サムネイル画像
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <input
            onChange={handleImageChange}
            disabled={isLoading}
            id="thumbnailImage"
            type="file"
            accept="image/*"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {thumbnailImageUrl && (
            <div className="mt-2">
              <Image
                src={thumbnailImageUrl}
                alt="thumbnail"
                width={400}
                height={400}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="">カテゴリー</label>
        <div className="flex flex-wrap gap-2">
          {allCategories?.map((cat) => {
            const isSelected = selectedCategories.some((s) => s.id === cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-start gap-4 mt-4">
        <button
          disabled={isLoading}
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-gray-800"
        >
          {mode === "edit" ? "更新" : "作成"}
        </button>

        {mode === "edit" && onDelete && (
          <button
            onClick={onDelete}
            disabled={isLoading}
            type="button"
            className="px-5 py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-gray-300 "
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
};
