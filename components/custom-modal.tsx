"use client"

import React, { useEffect, useState } from "react";
import { 
    Input, Button, Table, Popover, PopoverTrigger, PopoverContent, 
    TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Spinner, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, 
    Checkbox, Link, Switch, CircularProgress
} from "@nextui-org/react";
import { VerticalDotsIcon } from "./icons";
import {} from "@nextui-org/react";
import { Todo, CustomModalType, focusedTodoType } from "@/types";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomModal = (
        { focusedTodo, modalType, onClose, onEdit, onDelete }: 
        { focusedTodo: Todo, 
          modalType: CustomModalType,
          onClose: () => void,
          onEdit: (id: string, title: string, isDone: boolean) => void
          onDelete: (id: string) => void
        }
    ) => {

    // 로딩 활성화 여부
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // 수정된 선택
    const [isDone, setIsDone] = useState<boolean>(focusedTodo.is_done);
    // 수정된 할일 입력
    const [editedTodoInput, setEditedTodoInput] = useState<string>(focusedTodo.title);

    // useEffect(() => {
    //     // 시작할때 넣어주는 방법
    //     setIsDone(focusedTodo.is_done);
    //     setEditedTodoInput(focusedTodo.title);
    // }, [])

    const DetailModal = () => {
        return <>
            <ModalHeader className="flex flex-col gap-1">할일 상세</ModalHeader>
            <ModalBody>
                <p><span className="font-bold">id : </span>{focusedTodo.id}</p>
                <p><span className="font-bold">할일 내용 : </span>{focusedTodo.title}</p>
                <div className="flex py-2 space-x-4">
                    <span className="font-bold">완료여부 : </span>
                    {focusedTodo.is_done ? '완료' : '미완료'}
                </div>
                <div className="flex py-1 space-x-4">
                    <span className="font-bold">작성일 : </span>
                    <p>{`${focusedTodo.created_at}`}</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="default" onPress={onClose}>
                    닫기
                </Button>
            </ModalFooter>
        </>
    }

    const EditModal = () => {
        return <>
            <ModalHeader className="flex flex-col gap-1">할일 수정</ModalHeader>
            <ModalBody>
                <p><span className="font-bold">id : </span>{focusedTodo.id}</p>
                <Input
                    autoFocus
                    label="할일 내용"
                    placeholder="할일을 입력해주세요"
                    variant="bordered"
                    isRequired
                    defaultValue={focusedTodo.title}
                    value={editedTodoInput}
                    onValueChange={setEditedTodoInput}
                />
                <div className="flex py-2 space-x-4">
                    <span className="font-bold">완료여부 : </span>
                    <Switch 
                        color="warning"
                        defaultSelected={focusedTodo.is_done}
                        isSelected={isDone}
                        onValueChange={setIsDone}
                        aria-label="Automatic updates"
                    />
                    {isDone ? '완료' : '미완료'}
                </div>
                <div className="flex py-1 space-x-4">
                    <span className="font-bold">작성일 : </span>
                    <p>{`${focusedTodo.created_at}`}</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="warning" variant="flat" onPress={() => {
                    setIsLoading(true);
                    onEdit(focusedTodo.id, editedTodoInput, isDone);
                }}>
                    {(isLoading) ? <CircularProgress size="sm" color="warning" aria-label="Loading..."/> : '수정'}
                </Button>
                <Button color="default" onPress={onClose}>
                    닫기
                </Button>
            </ModalFooter>
        </>
    }

    const DeleteModal = () => {
        return <>
            <ModalHeader className="flex flex-col gap-1">할일을 삭제하시겠습니까?</ModalHeader>
            <ModalBody>
                <p><span className="font-bold">id : </span>{focusedTodo.id}</p>
                <p><span className="font-bold">할일 내용 : </span>{focusedTodo.title}</p>
                <div className="flex py-2 space-x-4">
                    <span className="font-bold">완료여부 : </span>
                    {focusedTodo.is_done ? '완료' : '미완료'}
                </div>
                <div className="flex py-1 space-x-4">
                    <span className="font-bold">작성일 : </span>
                    <p>{`${focusedTodo.created_at}`}</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" variant="flat" onPress={() => {
                    setIsLoading(true);
                    onDelete(focusedTodo.id);
                }}>
                    {(isLoading) ? <CircularProgress size="sm" color="danger" aria-label="Loading..."/> : '삭제'}
                </Button>
                <Button color="default" onPress={onClose}>
                    닫기
                </Button>
            </ModalFooter>
        </>
    }

    const getModal = (type: CustomModalType) => {
        switch (type) {
            case 'detail':
                return DetailModal();
            case 'edit':
                return EditModal();
            case 'delete':
                return DeleteModal();
            default: break;
        }
    }

    return (
        <>
            {getModal(modalType)}
        </>
    )
}

export default CustomModal;