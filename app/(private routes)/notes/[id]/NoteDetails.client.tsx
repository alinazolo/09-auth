'use client'
import css from "./NoteDetails.module.css";
import { fetchNoteById } from "@/lib/api/api";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Loading from "./loading";

export default function NoteDetailsClient() {
    const { id } = useParams<{ id: string }>();
    
    const { data: note, isLoading, error, isSuccess } = useQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });
    
    return (
        <div className={css.container}>
            {isLoading && <Loading />}
             {error && <p>Something went wrong.</p>}
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
    )
}