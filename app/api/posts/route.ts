//記事一覧取得API
//データベース(SQLite)への窓口
import { prisma } from "@/app/_libs/prisma";
//ブラウザ（クライアント）に対してデータを「どのような形式で返すか」を制御するツール
import { NextResponse } from "next/server";

//投稿一覧APIのレスポンス型
export type PostsIndexResponse = {
  posts: {
    id: number;
    title: string;
    content: string;
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

//GETという命令にすることで、GETリクエストの時にこの関数がよばれる
export const GET = async () => {
  try {
    //POSTの一覧をDBから取得
    const posts = await prisma.post.findMany({
      //紐づくデータをセットで
      include: {
        //カテゴリーも含めて取得（まず、中間テーブルのPostCategory）
        postCategories: {
          include: {
            //カテゴリーテーブル
            category: {
              //必要なカテゴリーテーブルののidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      //作成日時の降順で取得
      orderBy: {
        createdAt: "desc",
      },
    });

    //レスポンスを返す
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
