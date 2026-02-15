"use client";
import React, { useState } from "react";

type ContactRequest = {
  name: string;
  email: string;
  message: string;
};

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({
      name: "",
      email: "",
      message: "",
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      message: "",
    };

    let hasError = false;

    if (!name) {
      newErrors.name = "お名前は必須です";
      hasError = true;
    } else if (name.length > 30) {
      newErrors.name = "お名前は30文字以内で入力してください。";
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "メールアドレスは必須です。";
      hasError = true;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "メールアドレスの形式が正しくありません。";
      hasError = true;
    }

    if (!message) {
      newErrors.message = "本文は必須です。";
      hasError = true;
    } else if (message.length > 500) {
      newErrors.message = "本文は500文字以内で入力してください。";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError === true) return;

    setIsSubmitting(true);

    const requestBody: ContactRequest = {
      name,
      email,
      message,
    };

    try {
      const response = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 max-w-2xl mx-auto mt-20 mb-20"
    >
      <h2 className="font-bold text-xl">問い合わせフォーム</h2>
      <div className="flex items-center gap-10">
        <label htmlFor="name" className="w-32">
          お名前
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            id="name"
            name="name"
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-10">
        <label htmlFor="email" className="w-32">
          メールアドレス
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            id="email"
            name="email"
            type="text"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-10">
        <label htmlFor="message" className="w-32">
          本文
        </label>
        <div className="flex-1 flex flex-col gap-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSubmitting}
            id="message"
            name="message"
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
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
          onClick={reset}
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
