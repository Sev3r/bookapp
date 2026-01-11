// app/components/SearchCount.tsx

'use client';

import { useState } from 'react';
import { GoogleBooksAPI } from '@/app/services/googleBooksAPI';
import { Book } from '@/app/types/book';
import BookDetailModal from './BookDetailModal';

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
        <>
            {/* Search bar */}
            <div className="w-full max-w-2xl mx-auto p-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Zoek boeken op titel, auteur, ISBN..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 font-semibold"
                    >
                        {loading ? 'Zoeken...' : 'Zoeken'}
                    </button>
                </form>
            </div>

            {/* Search results overlay */}
            {showResults && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-start justify-center pt-20 overflow-y-auto"
                    onClick={handleCloseOverlay}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl w-full max-w-6xl mx-4 mb-20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Zoekresultaten</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {books.length} {books.length === 1 ? 'boek' : 'boeken'} gevonden voor &quot;{query}&quot;
                                </p>
                            </div>
                            <button
                                onClick={handleCloseOverlay}
                                className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Results */}
                        <div className="p-6">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    <p className="text-gray-600 mt-4">Zoeken...</p>
                                </div>
                            ) : books.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-600 text-lg">Geen boeken gevonden</p>
                                    <p className="text-gray-500 text-sm mt-2">Probeer een andere zoekterm</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {books.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => handleBookClick(book)}
                                            className="cursor-pointer group"
                                        >
                                            <div className="border rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                                                {book.thumbnail ? (
                                                    <img
                                                        src={book.thumbnail}
                                                        alt={book.title}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400 text-sm">Geen cover</span>
                                                    </div>
                                                )}

                                                <div className="p-3">
                                                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 h-10 group-hover:text-blue-600">
                                                        {book.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 line-clamp-1">
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

                        {/* Footer tip */}
                        <div className="border-t px-6 py-4 bg-gray-50 rounded-b-lg">
                            <p className="text-sm text-gray-600 text-center">
                                💡 Klik op een boek om meer details te zien en toe te voegen aan je lijst
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Book detail modal */}
            {selectedBook && (
                <BookDetailModal
                    book={selectedBook}
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    onBookAdded={() => {
                        // Optioneel: refresh iets of toon notificatie
                    }}
                />
            )}
        </>
    );
}