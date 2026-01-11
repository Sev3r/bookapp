export interface Book {
    id: string;
    title: string;
    authors: string[];
    description: string;
    pageCount: number;
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    thumbnail: string;
    coverImage: string;
    publishedDate: string;
    publisher: string;
    isbn: string | null;
    language: string;
}