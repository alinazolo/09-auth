
'use client'

import Modal from "@/components/Modal/Modal";
import { useRouter } from "next/navigation";
import css from "./NotePreview.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api/api";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/Error/ErrorMessage";

export default function NotePreviewClient() {
    const router = useRouter();
    const close = () => router.back();
    
    const { id } = useParams<{ id: string }>();
    
    const { data: note, isLoading, error, isSuccess } = useQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });

    return (
        <>
            <Modal onClose={close}>
                <div className={css.container}>
                    {isLoading && <Loader />}
                    {error && <ErrorMessage error={error} />}
    {isSuccess && 
	<div className={css.item}>
	  <div className={css.header}>
	    <h2>{note.title}</h2>
	  </div>
      <p className={css.tag}>{note?.tag}</p>
	  <p className={css.content}>{note?.content}</p>
	  <p className={css.date}>{note.createdAt}</p>
                </div>
            }
</div>
            </Modal>
        </>
    )
}
