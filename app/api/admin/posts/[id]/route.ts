import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/app/_libs/supabase";

export type Category = {
  id: number;
  name: string;
};

export type PostShowResponse = {
  post: {
    id: number;
    title: string;
    content: string;
    thumbnailImageKey: string;
    createdAt: Date;
    updatedAt: Date;
    postCategories: {
      category: Category;
    }[];
  };
};

//記事の更新時に送られてくるリクエストのbodyの型
export type UpdatePostRequestBody = {
  title: string;
  content: string;
  categories: { id: number }[];
  thumbnailImageKey: string;
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id } = await params;
  //tokenチェック
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "記事が見つかりません" },
        { status: 404 },
      );
    }

    return NextResponse.json<PostShowResponse>({ post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

//PUTリクエストの際に呼ばれる
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  //paramsからid取り出す
  const { id } = await params;
  //tokenチェック
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 401 });

  //リクエストのbody取り出す
  const {
    title,
    content,
    categories,
    thumbnailImageKey,
  }: UpdatePostRequestBody = await request.json();

  try {
    //idを指定して、Postを更新
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    });

    //一旦、記事とカテゴリーの中間テーブルのレコードを全て削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    //記事とカテゴリーの中間テーブルのレコードをDBに生成
    //sqliteなのでcreateMany使えないのでfor文で１レコードずつ作成
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: post.id,
          categoryId: category.id,
        },
      });
    }

    //レスポンスを返す
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};

//DELETEリクエストの際に呼ばれる
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  //paramsのidを取り出す
  const { id } = await params;
  //tokenチェック
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 401 });

  try {
    //idを指定してPostを削除
    await prisma.post.delete({
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
