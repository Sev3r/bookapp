'use client';

import { Book } from '@/app/types/book';
import { BookStorage } from '@/app/services/bookStorage';
import { useState } from 'react';

interface BookDetailModalProps {
    book: Book;
    isOpen: boolean;
    onClose: () => void;
    onBookAdded?: () => void;
}

export default function BookDetailModal({ book, isOpen, onClose, onBookAdded }: BookDetailModalProps) {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const storage = new BookStorage();

    if (!isOpen) return null;

    const handleAddToRead = () => {
        if (storage.isBookInToRead(book.id)) {
            alert('This book is already in your To Read list!');
            return;
        }

        storage.addToReadBook(book);
        setSuccessMessage('✓ Added to To Read!');
        setShowSuccessMessage(true);

        setTimeout(() => {
            setShowSuccessMessage(false);
            onClose();
            onBookAdded?.();
        }, 1500);
    };

    const handleAddHaveRead = () => {
        if (storage.isBookInHaveRead(book.id)) {
            alert('This book is already in your Have Read list!');
            return;
        }

        storage.addHaveReadBook(book);
        setSuccessMessage('✓ Added to Have Read!');
        setShowSuccessMessage(true);

        setTimeout(() => {
            setShowSuccessMessage(false);
            onClose();
            onBookAdded?.();
        }, 1500);
    };

    const isInToRead = storage.isBookInToRead(book.id);
    const isInHaveRead = storage.isBookInHaveRead(book.id);

    return (
        <div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-amber-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header met close button */}
                <div className="sticky top-0 bg-amber-100 border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Book Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-800 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Cover afbeelding */}
                        <div className="flex-shrink-0">
                            {book.coverImage || book.thumbnail ? (
                                <img
                                    src={book.coverImage || book.thumbnail}
                                    alt={book.title}
                                    className="w-48 h-72 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
                                />
                            ) : (
                                <div className="w-48 h-72 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400">No cover</span>
                                </div>
                            )}
                        </div>

                        {/* Book info */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {book.title}
                            </h3>

                            <p className="text-lg text-gray-600 mb-4">
                                by {book.authors.join(', ')}
                            </p>

                            {/* Rating */}
                            {book.averageRating > 0 && (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < Math.round(book.averageRating) ? 'text-yellow-500' : 'text-gray-300'}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {book.averageRating.toFixed(1)} ({book.ratingsCount} reviews)
                                    </span>
                                </div>
                            )}

                            {/* Details grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                {book.pageCount > 0 && (
                                    <div>
                                        <span className="font-semibold">Page&apos;s:</span> {book.pageCount}
                                    </div>
                                )}
                                {book.publishedDate && (
                                    <div>
                                        <span className="font-semibold">Published:</span> {book.publishedDate}
                                    </div>
                                )}
                                {book.publisher && (
                                    <div>
                                        <span className="font-semibold">Publisher:</span> {book.publisher}
                                    </div>
                                )}
                                {book.isbn && (
                                    <div>
                                        <span className="font-semibold">ISBN:</span> {book.isbn}
                                    </div>
                                )}
                            </div>

                            {/* Categories */}
                            {book.categories.length > 0 && (
                                <div className="mb-4">
                                    <span className="font-semibold text-sm">Categories:</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {book.categories.map((cat, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-emerald-200 text-grey-800 rounded-full text-xs"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {book.description && (
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Description</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {book.description.length > 500
                                            ? `${book.description.substring(0, 500)}...`
                                            : book.description
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleAddToRead}
                            disabled={isInToRead}
                            className={`flex-1 py-3 rounded-lg font-semibold transition ${isInToRead
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-800 text-white hover:bg-green-700'
                                }`}
                        >
                            {isInToRead ? '✓ Already in To Read' : '+ Add to To Read'}
                        </button>

                        <button
                            onClick={handleAddHaveRead}
                            disabled={isInHaveRead}
                            className={`flex-1 py-3 rounded-lg font-semibold transition ${isInHaveRead
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-800 text-white hover:bg-green-700'
                                }`}
                        >
                            {isInHaveRead ? '✓ Already in Have Read' : '+ Add to Have Read'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}