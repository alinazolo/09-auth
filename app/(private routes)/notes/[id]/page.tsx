import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/api";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const note = await fetchNoteById(id)
    return {
        title: `Note: ${note.title}`,
        description: note?.content.slice(0, 30),
        openGraph: {
            title: `Note: ${note.title}`,
            description: note?.content.slice(0, 30),
            url: `https://08-zustand-blond-two.vercel.app/notes/${note.id}`,
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

interface NoteDetailsProps {
    params: Promise<{ id: string }>;
}

export default async function NoteDetails({ params }: NoteDetailsProps) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
    });
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient></NoteDetailsClient>
</HydrationBoundary>
    )
}