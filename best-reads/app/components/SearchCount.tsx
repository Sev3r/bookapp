'use client';

import { useState } from 'react';
import { GoogleBooksAPI } from '@/app/services/googleBooksAPI';
import { Book } from '@/app/types/book';
import BookDetailModal from './BookDetailModal';
import { TotalPagesRead } from './PagesRead';

export default function SearchCount() {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [showModal, setShowModal] = useState(false);

    const booksAPI = new GoogleBooksAPI();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setShowResults(true);

        const results = await booksAPI.searchBooks(query, 20);
        setBooks(results);
        setLoading(false);
    };

    const handleBookClick = (book: Book) => {
        setSelectedBook(book);
        setShowModal(true);
    };

    const handleCloseOverlay = () => {
        setShowResults(false);
        setBooks([]);
        setQuery('');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBook(null);
    };

    return (
        <div className="bg-amber-100 sticky top-0 left-0 right-0">
            {/* Search bar */}
            <div className="w-full max-w-4xl h-20 mx-auto p-4 grid grid-cols-2 gap-4">
                <form onSubmit={handleSearch} className="flex h-12 bg-emerald-700 p-2 rounded-lg shadow">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="My best read..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-0 transition disabled:bg-gray-400 font-semibold"
                    >
                        {loading ? 'Searching...' : (
                            <img src="/search-icon.png" className="h-6 w-6 hover:scale-115" />
                        )}
                    </button>
                </form>

                <div className="flex justify-center md:justify-end">
                    <TotalPagesRead />
                </div>
            </div>


            {/* Search results overlay */}
            {showResults && (
                <div
                    className="fixed inset-0 bg-black z-40 flex items-start justify-center pt-20 overflow-y-auto"
                    onClick={handleCloseOverlay}
                >
                    <div
                        className="bg-emerald-700 rounded-lg shadow-2xl w-full max-w-6xl mx-4 mb-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className=" top-0 bg-emerald-700 border-b px-6 py-4 flex justify-between items-center rounded-t-lg z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Search results</h2>
                                <p className="text-sm text-gray-800 mt-1">
                                    {books.length} {books.length === 1 ? 'book' : 'books'} found for &quot;{query}&quot;
                                </p>
                            </div>
                            <button
                                onClick={handleCloseOverlay}
                                className="text-gray-800 hover:text-gray-700 text-3xl font-bold leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Results */}
                        <div className="p-6">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2"></div>
                                    <p className="text-gray-600 mt-4">Searching...</p>
                                </div>
                            ) : books.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 text-lg">No books found</p>
                                    <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {books.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => handleBookClick(book)}
                                            className="cursor-pointer group"
                                        >
                                            <div className="border rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 bg-amber-100">
                                                {book.thumbnail ? (
                                                    <img
                                                        src={book.thumbnail}
                                                        alt={book.title}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400 text-sm">No cover</span>
                                                    </div>
                                                )}

                                                <div className="p-3">
                                                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 h-10">
                                                        {book.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-700 line-clamp-1">
                                                        {book.authors.join(', ')}
                                                    </p>

                                                    {book.averageRating > 0 && (
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <span className="text-yellow-500 text-xs">⭐</span>
                                                            <span className="text-xs font-medium">
                                                                {book.averageRating.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {selectedBook && (
                <BookDetailModal
                    book={selectedBook}
                    isOpen={showModal}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}