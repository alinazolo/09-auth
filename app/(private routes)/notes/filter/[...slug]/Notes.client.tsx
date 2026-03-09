'use client'
import { fetchNotes } from "@/lib/api/clientApi";
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from './page.module.css';
import { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from '@/components/NoteList/NoteList';
import Loading from '@/app/loading';
import Error from '@/app/(private routes)/notes/filter/[...slug]/error';
import type { NoteTag } from "@/types/note";
import Link from "next/link";


interface NotesClientProps {
  tag: NoteTag | "all";
}

export default function NotesClient({ tag }: NotesClientProps) {
    const normalizedTag = tag === "all" ? undefined : tag;
    const [query, setQuery] = useState('');
    const [inputValue, setInputValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 12;
    
    const debouncedSetQuery = useDebouncedCallback((value: string) => {
        setQuery(value);
        setCurrentPage(1);
    }, 300);
 
    const handleSearch = (value: string) => {
        setInputValue(value);
        debouncedSetQuery(value)
    };
  
  
    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["notes", query, currentPage, perPage, normalizedTag],
        queryFn: () => fetchNotes(
            { search: query, page: currentPage, perPage, tag: normalizedTag }), 
        placeholderData: keepPreviousData,
        refetchOnMount: false,
    });
    

    return (
        <>
            <div className={css.app}>
                <header className={css.toolbar}> <SearchBox text={inputValue} onSearch={handleSearch} />
            {data && (
  <Pagination
    page={currentPage}
    totalPages={data.totalPages}
    onPageChange={setCurrentPage}
  />
)}
                    <Link className={css.button} href="/notes/action/create">Create note +</Link>
</header>
  {isLoading && <Loading/>}
  {isError && <Error/>}
  {data && isSuccess && data?.notes?.length > 0 && <NoteList notes={data.notes}/>}
             </div>
        </>
    )
}