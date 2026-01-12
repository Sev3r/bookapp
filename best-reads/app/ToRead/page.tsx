'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/app/types/book';
import { BookStorage } from '@/app/services/bookStorage';
import BookCard from '@/app/components/BookCard';

export default function ToReadPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const storage = new BookStorage();

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = () => {
        const loadedBooks = storage.getToReadBooks();
        setBooks(loadedBooks);
        setLoading(false);
    };

    const handleRemove = (bookId: string) => {
        storage.removeToReadBook(bookId);
        loadBooks();
    };

    if (loading) return <p>Laden...</p>;

    return (
        <div className="p-4 min-h-screen bg-emerald-700">
            <h1 className="text-2xl font-bold mb-4 text-center">To Read</h1>

            {books.length === 0 ? (
                <p className="text-gray-500">There are no books in your list</p>
            ) : (
                <div className="books-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {books.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}