'use client'
import { fetchNotes } from "@/lib/api";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from './page.module.css';
import { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from '@/components/NoteList/NoteList';
import Loading from '@/app/loading';
import Error from '@/app/notes/filter/[...slug]/error';
import type { NoteTag } from "@/types/note";
import Link from "next/link";


interface NotesClientProps {
  tag: NoteTag | "all";
}

export default function NotesClient({ tag }: NotesClientProps) {
    const normalizedTag = tag === "all" ? undefined : tag;
    
const [query, setQuery] = useState('');
const [currentPage, setCurrentPage] = useState(1);
 const [perPage] = useState(12);
 const debouncedSetQuery = useDebouncedCallback(
  (value: string) => {
setQuery(value);
setCurrentPage(1);
    },
    300,
 );
  
  
    const { data, isLoading, error, isSuccess } = useQuery({
        queryKey: ["notes", query, currentPage, perPage, normalizedTag],
        queryFn: () => fetchNotes(
            { search: query, page: currentPage, perPage, tag: normalizedTag }), 
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });
    

    return (
        <>
            <div className={css.app}>
                <header className={css.toolbar}> <SearchBox text={query} onSearch={debouncedSetQuery} />
            {isSuccess && (
    <Pagination page={currentPage} totalPages={data.totalPages} onPageChange={setCurrentPage}/>
                    )}
                    <Link className={css.button} href="/notes/action/create">Create note +</Link>
</header>
  {isLoading && <Loading/>}
  {error && <Error error={error} />}
  {data && isSuccess && data.notes.length > 0 && <NoteList notes={data.notes}/>}
             </div>
        </>
    )
}