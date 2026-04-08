import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/app/_libs/supabase";

//GET用型定義
export type PostIndexResponse = {
  posts: {
    id: number;
    title: string;
    content: string;
    thumbnailImageKey: string;
    createdAt: Date;
    updatedAt: Date;
    postCategories: {
      category: {
        id: number;
        name: string;
      };
    }[];
  }[];
};

//投稿作成時に送られてくるリクエストのbodyの型
export type CreatePostRequestBody = {
  title: string;
  content: string;
  categories: { id: number }[];
  thumbnailImageKey: string;
};

//投稿作成APIのレスポンスの型（投稿作成後にフロント側に教えるもの）
export type CreatePostResponse = {
  id: number;
};

export const GET = async (request: NextRequest) => {
  //GET関数からrequestを受け取り、その中にAuthorizationヘッダーを取り出す。また、tokenが文字列ではない場合を防ぐ
  const token = request.headers.get("Authorization") ?? "";

  //supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  //送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す。
  if (error)
    return NextResponse.json({ message: error.message }, { status: 401 }); //401：認証されていないがより正確か。

  //token正しければ以降実行
  try {
    const posts = await prisma.post.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

//
export const POST = async (request: Request) => {
  //tokenチェック
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);
  if (error)
    return NextResponse.json({ message: error.message }, { status: 401 });

  try {
    //リクエストのbodyを取得
    const body: CreatePostRequestBody = await request.json();

    //bodyの中からtitle,content,categories,thumbnailImageKeyを取り出す
    const { title, content, categories, thumbnailImageKey } = body;

    //投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    });

    //記事とカテゴリーの中間テーブルのレコードをDBに生成
    //本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文１つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      });
    }

    //レスポンスを返す
    return NextResponse.json<CreatePostResponse>({ id: data.id });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
};
