import { create } from 'zustand';
import { persist } from "zustand/middleware";
import type { CreateNoteData } from "@/types/note";


interface TaskStore {
    draft: CreateNoteData;
    setDraft: (note: CreateNoteData) => void;
    clearDraft: () => void;
}

const initialDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<TaskStore>()(
    persist(
        (set) => ({
            draft: initialDraft,
            setDraft: (note: CreateNoteData) => set({ draft: note }),
            clearDraft: () => set({ draft: initialDraft }),
        }),
        { name: "draft", partialize: (state) => ({ draft: state.draft }) },
    ),
);
