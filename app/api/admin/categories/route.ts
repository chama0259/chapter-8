import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";

//カテゴリー一覧APIのレスポンスの型
export type CategoriesIndexResponse = {
  categories: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

//カテゴリー作成時のリクエストbodyの型
export type CreateCategoryRequestBody = {
  name: string;
};

//カテゴリー作成APIのレスポンスの型
export type CreateCategoryResponse = {
  id: number;
};

export const GET = async () => {
  try {
    //カテゴリーの一覧をDBから取得
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc", //作成日時の降順に取得
      },
    });
    //レスポンスを返す
    return NextResponse.json<CategoriesIndexResponse>(
      { categories },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};

export const POST = async (request: Request) => {
  try {
    //リクエストで受け取ったものを取り出す
    const { name }: CreateCategoryRequestBody = await request.json();

    //作成するカテゴリーをDBに生成
    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    //レスポンスを返す
    return NextResponse.json<CreateCategoryResponse>({ id: data.id });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};
