"use client";

import type { Category } from "@/app/api/admin/posts/[id]/route";

type Props = {
  mode: "new" | "edit";
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (value: string) => void;
  allCategories: Category[];
  selectedCategories: Category[];
  toggleCategory: (cat: Category) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  onDelete?: () => void;
  isLoading: boolean;
};

export const PostForm = (props: Props) => {
  const {
    mode,
    title,
    setTitle,
    content,
    setContent,
    thumbnailUrl,
    setThumbnailUrl,
    allCategories,
    selectedCategories,
    toggleCategory,
    onSubmit,
    onDelete,
    isLoading,
  } = props;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-10 mb-20">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="w-32 ">
          タイトル
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            id="title"
            name="title"
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="w-32">
          内容
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            id="content"
            name="content"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="thumbnailUrl" className="w-32">
          サムネイルURL
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <input
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            disabled={isLoading}
            id="thumbnailUrl"
            name="thumbnailUrl"
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="">カテゴリー</label>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => {
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
