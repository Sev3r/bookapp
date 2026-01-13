'use client';

import { Book } from '@/app/types/book';
import React from 'react';
import BookDetailModal from './BookDetailModal';


interface BookCardProps {
    book: Book;
    onAdd?: (book: Book) => void;
}

export default function BookCard({ book, onAdd }: BookCardProps) {
    const [showModal, setShowModal] = React.useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <div className="bg-amber-100 items-center text-center rounded-[10px]" onClick={handleOpenModal}>
                {book.thumbnail ? (
                    <img src={book.thumbnail} alt={book.title} className="w-full h-48 object-cover" />
                ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No cover</span>
                    </div>
                )}
                <h3>{book.title}</h3>
                <p>{book.authors.join(', ')}</p>

            </div>

            <BookDetailModal
                book={book}
                isOpen={showModal}
                onClose={handleCloseModal}
            />

        </>
    );
}
