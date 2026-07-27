import api from './api';
import type { Book, BookFormData } from '../types';

export interface BookSearchParams {
  title?: string;
  author?: string;
  year?: number;
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

function toPayload(data: BookFormData) {
  return {
    title: data.title.trim(),
    author: data.author.trim(),
    year: Number(data.year),
    description: data.description.trim() || null,
    coverUrl: data.coverUrl.trim() || null,
  };
}

export const bookService = {
  async search(params: BookSearchParams = {}): Promise<PageResponse<Book>> {
    const response = await api.get<PageResponse<Book>>('/api/books/search', { params });
    return response.data;
  },

  async findById(id: string): Promise<Book> {
    const response = await api.get<Book>(`/api/books/${id}`);
    return response.data;
  },

  async create(data: BookFormData): Promise<Book> {
    const response = await api.post<Book>('/api/books', toPayload(data));
    return response.data;
  },

  async update(id: string, data: BookFormData): Promise<Book> {
    const response = await api.put<Book>(`/api/books/${id}`, toPayload(data));
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/books/${id}`);
  },
};
