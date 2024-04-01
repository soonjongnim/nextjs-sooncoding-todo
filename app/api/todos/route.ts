import { NextRequest, NextResponse } from "next/server";
import dummyTodos from '@/data/dummy.json'
import { addTodo, fetchTodos } from '@/data/firestore'

// 전체 조회
export async function GET(request: NextRequest) {

    const fetchedTodos = await fetchTodos();
    const response = {
        message: 'todos 몽땅 가져오기',
        data: fetchedTodos
    }

   return NextResponse.json(response, { status: 200 })
}

// 할일 추가하기
export async function POST(request: NextRequest) {

    const { title } = await request.json();
    
    if (title === undefined) return NextResponse.json("할일(title)을 작성해주세요.", { status: 422 });

    const addedTodo = await addTodo({ title });

    const response = {
        message: '할일 추가 성공!',
        data: addedTodo
    }
   
    return Response.json(response, { status: 201 });
  }