import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";
import { Metadata } from "next";
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";

type Props = {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = slug[0]
  return {
    title: `${tag} Notes | NoteHub`,
    description: `Browse and manage your ${tag.toLowerCase()} notes in NoteHub. 
    Stay organized and productive with categorized tasks.`,
    openGraph: {
      title: `${tag} Notes | NoteHub`,
      description: `Browse and manage your ${tag.toLowerCase()} notes in NoteHub. 
    Stay organized and productive with categorized tasks.`,
      url: `https://08-zustand-blond-two.vercel.app/notes/filter/${tag}`,
      images: [
        {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 600,
        height: 600,
        alt: "note hub image",
      },
      ]
    }
  }
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Notes({ params }: PageProps) {
  const { slug } = await params;
   const currentTag = (slug?.[0] ?? "all") as
    | NoteTag | "all";
  const normalizedTag = currentTag === "all" ? undefined : currentTag;
  
const queryClient = new QueryClient();
  
    await queryClient.prefetchQuery({
      queryKey: ["notes", "", 1, 12, normalizedTag],
      queryFn: () =>
        fetchNotes({
      search: "",
      page: 1,
      perPage: 12,
      tag: normalizedTag,
        }),
    });

return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag as NoteTag | "all"} />
    </HydrationBoundary>
  </>
)
}
