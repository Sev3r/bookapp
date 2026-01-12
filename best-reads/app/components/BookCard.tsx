'use client';

import { Book } from '@/app/types/book';

interface BookCardProps {
    book: Book;
    onAdd?: (book: Book) => void;
}

export default function BookCard({ book, onAdd }: BookCardProps) {
    return (
        <div className="bg-amber-100 items-center text-center rounded-[10px]">
            <img src={book.thumbnail} alt={book.title} className="mx-auto" />
            <h3>{book.title}</h3>
            <p>{book.authors.join(', ')}</p>
            <p>⭐ {book.averageRating}/5 ({book.ratingsCount})</p>
            <p>{book.pageCount} pagina's</p>
            {onAdd && (
                <button onClick={() => onAdd(book)}>
                    Add
                </button>
            )}
        </div>
    );
}