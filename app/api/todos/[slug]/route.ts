import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { fetchATodo, deleteATodo, editATodo } from "@/data/firestore"

// 할일 단일 조회
// [slug]폴더 이름과 params의 slug명칭이 동일해야 함.
export async function GET(request: NextRequest, 
    { params }: { params: { slug: string } }) {

    const fetchedTodo = await fetchATodo(params.slug);
    if (fetchedTodo === null) return new Response("조회할 해당아이디가 없습니다.", { status: 500 });
    // const searchParams = useSearchParams();
    // const searchParams = request.nextUrl.searchParams

    // const query = searchParams.get('query')

   const response = {
    message: '할일 단일 가져오기 성공!',
    data: fetchedTodo
   }

   return NextResponse.json(response, { status: 200 })
}

// 할일 단일 삭제
export async function DELETE(request: NextRequest, 
    { params }: { params: { slug: string } }) {

    const fetchedTodo = await fetchATodo(params.slug);

    if (fetchedTodo === null) return new Response("삭제할 해당아이디가 없습니다.", { status: 204 });
    
    await deleteATodo(params.slug);

    const response = {
        message: '할일 단일 삭제 성공!',
    }

    return NextResponse.json(response, { status: 200 })
}

// 할일 단일 수정
export async function POST(request: NextRequest, 
    { params }: { params: { slug: string } }) {

    const fetchedTodo = await fetchATodo(params.slug);
    if (fetchedTodo === null) return new Response("수정할 해당아이디가 없습니다.", { status: 500 });

    const { title, is_done } = await request.json()

    await editATodo(params.slug, { title, is_done });

    const editedTodo = {
        id: params.slug,
        title,
        is_done,
        created_at: fetchedTodo.created_at
    }

   const response = {
    message: '할일 단일 수정 성공!',
    data: editedTodo
   }

   return NextResponse.json(response, { status: 200 })
}