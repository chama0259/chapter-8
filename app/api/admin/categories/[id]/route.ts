import { prisma } from "@/app/_libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/_libs/supabase";

//カテゴリー詳細APIのレスポンスの型
export type CategoryShowResponse = {
  category: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

//カテゴリー更新時のリクエストbodyの型
export type UpdateCategoryRequestBody = {
  name: string;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  //paramsからid取り出す
  const { id } = await params;
  //tokenのチェック
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 401 });

  try {
    //idをもとにCategoriesをDBに取得
    const category = await prisma.category.findUnique({
      where: {
        //Urlからparamsから取得したidは文字列なので忘れない
        id: parseInt(id),
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "記事が見つかりません" },
        { status: 404 },
      );
    }

    //レスポンスを返す
    return NextResponse.json<CategoryShowResponse>(
      { category },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  //idをparamsから取得
  const { id } = await params;
  //tokenのチェック
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 401 });

  //リクエストのbody取り出す
  const { name }: UpdateCategoryRequestBody = await request.json();

  try {
    //idを指定してカテゴリーテーブル更新
    await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });

    //レスポンスを返す
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  //idをparamsから取得
  const { id } = await params;
  //tokenのチェック
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 401 });

  try {
    //idを指定してcategoryを削除
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    //レスポンスを返す
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};
