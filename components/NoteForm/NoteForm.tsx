"use client";

import css from "./NoteForm.module.css";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/api";
import {useNoteStore} from "@/lib/store/noteStore"
import { CreateNoteData } from "@/types/note";
import toast, { Toaster } from "react-hot-toast";



interface NoteFormProps {
  formAction?: string;
}       

export default function NoteForm({ formAction }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    toast.success("Your task was created");
  clearDraft();

  setTimeout(() => {
    router.back();
    router.refresh();
  }, 700);
}
  });

const fieldId = useId();
  
  const onCancel = () => {
    router.back();
  }

  const onChangeField = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setDraft({ ...draft, [name]: value } as CreateNoteData);
    },
    [draft, setDraft]
  );
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    if (draft.title.trim().length < 3) return;
    mutate(draft);
  };


  return (
    <> <Toaster position="top-right" />
  <form className={css.form} onSubmit={onSubmit} >
  <div className={css.formGroup}>
    <label htmlFor={`${fieldId}-title`}>Title</label>
        <input id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
        required
          minLength={3}
          maxLength={50}
          value={draft.title}
          onChange={onChangeField}/>
    {isError && 
         <span className={css.error}>Failed to create title</span>
        }
  </div>

  <div className={css.formGroup}>
    <label htmlFor={`${fieldId}-content`}>Content</label>
    <textarea
      id={`${fieldId}-content`}
      name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          value={draft.content}
          onChange={onChangeField}
    />
    {isError && 
          <span className={css.error}>Failed to create note</span>
        }
  </div>

  <div className={css.formGroup}>
    <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          required
          value={draft.tag}
          onChange={onChangeField}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
        </select>
        {isError && 
          <span className={css.error}>Failed to create note</span>
        }
  </div>

  <div className={css.actions}>
        <button type="button" className={css.cancelButton}
          onClick={onCancel}>
      Cancel
    </button>
    <button
      type="submit"
          className={css.submitButton}
          formAction={formAction ?? undefined}
          disabled={isPending}
    >
      Create note
    </button>
  </div>
      </form>
      </>
)
      }
    