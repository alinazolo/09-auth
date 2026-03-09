import { nextServer } from "./api";
import { User } from "@/types/user";
import type { CreateNoteData, Note, FetchNotesResponse } from "@/types/note";
import type { LoginRequest, RegisterRequest, UpdateUserRequest } from "@/types/auth"

export async function fetchSingleNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
}

type FetchNotesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
};


export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage ?? 12,
      sortBy: "created",
      search: params.search,
      tag: params.tag,
    },
  });

  return response.data;
}

export async function createNote(payload: CreateNoteData): Promise<Note> {
  const response = await nextServer.post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(noteId: Note["id"]): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${noteId}`);
  return response.data;
}

export const register = async (payload: RegisterRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/register", payload);
  return response.data;
};

export const login = async (payload: LoginRequest): Promise<User> => {
  const response = await nextServer.post<User>("/auth/login", payload);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const response = await nextServer.patch<User>("/users/me", payload);
  return response.data;
};

export const getMe = async (): Promise<User | null> => {
  try {
    const response = await nextServer.get<User>("/users/me");
    return response.data;
  } catch {
    return null;
  }
};

export const checkSession = async (): Promise<boolean> => {
  try {
    await nextServer.get("/auth/session");
    return true;
  } catch {
    return false;
  }
};