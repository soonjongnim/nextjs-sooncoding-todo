"use client"

import React, { useState } from "react";
import { 
    Input, Button, Table, Popover, PopoverTrigger, PopoverContent, 
    TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Spinner, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from "@nextui-org/react";
import { VerticalDotsIcon } from "./icons";
import {} from "@nextui-org/react";
import { Todo, CustomModalType, focusedTodoType } from "@/types";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomModal from "./custom-modal";

const TodosTable = ({ todos }: { todos: Todo[] }) => {
    const router = useRouter();

    // 할일 추가 기능 여부
    const [todoAddEnable, setTodoAddEnable] = useState<boolean>(false);
    // Popover 활성화 여부
    const [popoverEnable, setPopoverEnable] = useState<boolean>(false);
    // 로딩 활성화 여부
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // 띄우는 모달 상태
    const [currentModalData, setCurrentModalData] = useState<focusedTodoType>({
        focusedTodo: null,
        modalType: 'detail' as CustomModalType
    })

    // 입력된 할일
    const [newTodoInput, setNewTodoInput] = useState<string>('');

    const addATodoHandler = async () => {
        if (!todoAddEnable) { 
            setPopoverEnable(true);
            console.log('글자를 입력하세요.'); 
            return; 
        };

        setTodoAddEnable(false);
        setIsLoading(true);

        await new Promise(f => setTimeout(f, 600));
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`, {
            method: 'post',
            body: JSON.stringify({
                title: newTodoInput
            }),
            cache: 'no-store'
        });
        setNewTodoInput('');
        router.refresh();
        setIsLoading(false);
        notifySuccessEvent('할일이 성공적으로 추가되었습니다!');
        console.log(`할일 추가완료: ${newTodoInput}`);
    }

    const editATodoHandler = async (
            id: string, 
            editedTitle: string, 
            editedIsDone: boolean
        ) => {
        if (editedTitle.length < 1) { 
            console.log('글자를 입력하세요.'); 
            return; 
        };

        setIsLoading(true);

        await new Promise(f => setTimeout(f, 600));
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
            method: 'post',
            body: JSON.stringify({
                title: editedTitle,
                is_done: editedIsDone
            }),
            cache: 'no-store'
        });
        router.refresh();
        setIsLoading(false);
        notifySuccessEvent('할일이 수정되었습니다!');
        console.log(`할일 수정완료: ${editedTitle}`);
    }

    const deleteATodoHandler = async (
        id: string
    ) => {

    setIsLoading(true);

    await new Promise(f => setTimeout(f, 600));
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos/${id}`, {
        method: 'delete',
        cache: 'no-store'
    });
    router.refresh();
    setIsLoading(false);
    notifySuccessEvent('할일이 삭제되었습니다!');
    console.log(`할일 삭제완료: ${id}`);
}
    
    const applyIsDoneUI = (isDone: boolean) =>
        (isDone ? "line-through text-gray-900/50 dark:text-white/40" : "")

    const TodoRow = (aTodo: Todo) => {
        return <TableRow key={aTodo.id}>
                    <TableCell className={applyIsDoneUI(aTodo.is_done)}>{aTodo.id.slice(0, 4)}</TableCell>
                    <TableCell className={applyIsDoneUI(aTodo.is_done)}>{aTodo.title}</TableCell>
                    <TableCell>{aTodo.is_done ? "✅" : "📌"}</TableCell>
                    <TableCell className={applyIsDoneUI(aTodo.is_done)}>{`${aTodo.created_at}`}</TableCell>
                    <TableCell>
                        <div className="relative flex justify-end items-center gap-2">
                            <Dropdown className="bg-background border-1 border-default-200">
                                <DropdownTrigger>
                                    <Button isIconOnly radius="full" size="sm" variant="light">
                                        <VerticalDotsIcon className="text-default-400" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu onAction={(key) => {
                                    console.log(`aTodo.id: ${aTodo.id} / key: ${key}`);
                                    setCurrentModalData({focusedTodo: aTodo, modalType: key as CustomModalType})
                                    onOpen();
                                }}>
                                    <DropdownItem key="detail">상세보기</DropdownItem>
                                    <DropdownItem key="edit">수정</DropdownItem>
                                    <DropdownItem key="delete">삭제</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </TableCell>
                </TableRow>
    }

    const notifySuccessEvent = (msg: string) => toast.success(msg);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const ModalComponent = () => {
        return <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    (currentModalData.focusedTodo && <CustomModal 
                        focusedTodo={currentModalData.focusedTodo}
                        modalType={currentModalData.modalType}
                        onClose={onClose}
                        onEdit={async (id, title, isDone) => {
                            console.log(id, title, isDone);
                            await editATodoHandler(id, title, isDone);
                            onClose();
                        }}
                        onDelete={async (id) => {
                            console.log('id: ', id);
                            await deleteATodoHandler(id);
                            onClose();
                        }}
                    />)
                    
                )}
            </ModalContent>
        </Modal>
    }

    return (
        <div className="flex flex-col space-y-2">
            {ModalComponent()}
            <ToastContainer
                position="top-right"
                autoClose={1800}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Input type="text" label="새로운 할일" 
                    value={newTodoInput}
                    onValueChange={(changedInput) => {
                        setNewTodoInput(changedInput);
                        setTodoAddEnable(changedInput.length > 0);
                        setPopoverEnable(false);
                    }}
                />
                <Popover placement="top-start" isOpen={popoverEnable ? true : false} showArrow={true}>
                    <PopoverTrigger>
                    <Button color={todoAddEnable ? 'warning' : 'default'} className="h-14" onPress={async () => {
                        await addATodoHandler();
                    }}>추가</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                    <div className="px-1 py-2">
                        <div className="text-small font-bold">👩</div>
                        <div className="text-tiny">할일을 입력해주세요!</div>
                    </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="h-6">{isLoading && <Spinner size="sm" color="warning" />}</div>
            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn>아이디</TableColumn>
                    <TableColumn>할일내용</TableColumn>
                    <TableColumn>완료여부</TableColumn>
                    <TableColumn>생성일</TableColumn>
                    <TableColumn>액션</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"보여줄 데이터가 없습니다."}>
                    {todos && todos.map((aTodo: Todo) => (
                        TodoRow(aTodo)
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}


export default TodosTable;