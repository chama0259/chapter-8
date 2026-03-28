"use client";

type Props = {
  mode: "new" | "edit";
  name: string;
  setName: (value: string) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  onDelete?: () => void;
  isUpdating: boolean;
};

export const CategoryForm = (props: Props) => {
  const { mode, name, setName, onSubmit, onDelete, isUpdating } = props;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-10 mb-20">
      <label htmlFor="category-name" className="w-32 ">
        カテゴリー名
      </label>
      <div className="flex-1 flex flex-col gap-1">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUpdating}
          id="category-name"
          name="category-name"
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="flex justify-start gap-4 mt-4">
        <button
          disabled={isUpdating}
          type="submit"
          className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-gray-800"
        >
          {mode === "edit" ? "更新" : "作成"}
        </button>
        {mode === "edit" && onDelete && (
          <button
            onClick={onDelete}
            disabled={isUpdating}
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
