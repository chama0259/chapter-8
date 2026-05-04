"use client";

import { useForm, SubmitHandler } from "react-hook-form";

type ContactRequest = {
  name: string;
  email: string;
  message: string;
};

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactRequest>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ContactRequest> = async (data) => {
    try {
      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        alert("送信しました");
        reset();
      } else {
        alert("送信に失敗しました");
      }
    } catch {
      alert("通信エラーが発生しました");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-2xl mx-auto mt-20 mb-20"
    >
      <h2 className="font-bold text-xl">問い合わせフォーム</h2>
      <div className="flex items-center gap-10">
        <label htmlFor="name" className="w-32">
          お名前
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <input
            {...register("name", {
              required: "お名前は必須です",
              maxLength: {
                value: 30,
                message: "お名前は30文字以内で入力してください。",
              },
            })}
            disabled={isSubmitting}
            id="name"
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
        </div>
      </div>
      <div className="flex items-center gap-10">
        <label htmlFor="email" className="w-32">
          メールアドレス
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <input
            {...register("email", {
              required: "メールアドレスは必須です",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "メールアドレスの形式が正しくありません",
              },
            })}
            disabled={isSubmitting}
            id="email"
            type="email"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>
      </div>
      <div className="flex items-center gap-10">
        <label htmlFor="message" className="w-32">
          本文
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <textarea
            {...register("message", {
              required: "本文は必須です",
              maxLength: {
                value: 500,
                message: "本文は500文字以内で入力してください",
              },
            })}
            disabled={isSubmitting}
            id="message"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-red-500 text-sm mt-1">{errors.message?.message}</p>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          disabled={isSubmitting}
          type="submit"
          className="px-5 py-2.5 bg-black text-white font-bold rounded-lg hover:bg-gray-800"
        >
          {isSubmitting ? "送信中..." : "送信"}
        </button>
        <button
          onClick={() => reset()}
          disabled={isSubmitting}
          type="reset"
          className="px-5 py-2.5 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300"
        >
          クリア
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
