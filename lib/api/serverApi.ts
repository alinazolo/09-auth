import { nextServer } from "./api";
import type { AxiosResponse } from "axios";
import { Note, FetchNotesResponse, NoteTag }from "@/types/note";
import type { User } from "@/types/user";
import { cookies } from "next/headers";

export const getServerMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();

    const response = await nextServer.get<User>("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return response.data;
  } catch {
    return null;
  }
};

export const checkServerSession = async (): Promise<AxiosResponse<User> | null> => {
  try {
    const cookieStore = await cookies();

    const response = await nextServer.get<User>("/auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return response;
  } catch {
    return null;
  }
};

type FetchNotesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
};

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();

  const response = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage ?? 12,
      sortBy: "created",
      search: params.search,
      tag: params.tag,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export const fetchSingleNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export async function fetchTags(): Promise<string[]> {
  const { notes } = await fetchNotes({});

  const tags = new Set(
    notes
      .map((note) => note.tag)
      .filter((tag): tag is string => Boolean(tag))
  );

  return Array.from(tags);
}

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function refreshSession(
  refreshToken: string,
): Promise<RefreshResponse | null> {
  try {
    const cookieStore = await cookies();

    const response = await nextServer.post<RefreshResponse>(
      "/auth/refresh",
      { refreshToken },
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

    const data = response.data;

    if (!data.accessToken || !data.refreshToken) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}