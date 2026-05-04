"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";

export type CategoryInputs = {
  name: string;
};

type Props = {
  mode: "new" | "edit";
  //RHFとprops併用するときは↓のように専用の型必要そうか。これまではuseFormインポートしたファイルでTSが理解してくれていたが
  register: UseFormRegister<CategoryInputs>; //register専用の型
  errors: FieldErrors<CategoryInputs>; //errorsの専用の型
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>; //handleSubmit後の型
  onDelete?: () => void;
  isLoading: boolean;
};

export const CategoryForm = (props: Props) => {
  const { mode, register, errors, onSubmit, onDelete, isLoading } = props;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-10 mb-20">
      <label htmlFor="category-name" className="w-32 ">
        カテゴリー名
      </label>
      <div className="flex-1 flex flex-col gap-1">
        <input
          {...register("name", {
            required: "カテゴリー名は必須です",
          })}
          disabled={isLoading}
          id="category-name"
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
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
