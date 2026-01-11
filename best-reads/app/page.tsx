'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/app/types/book';
import { BookStorage } from '@/app/services/bookStorage';
import { GoogleBooksAPI } from '@/app/services/googleBooksAPI';


export default function HomePage() {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ toRead: 0, haveRead: 0, total: 0 });

  const storage = new BookStorage();
  const booksAPI = new GoogleBooksAPI();

  useEffect(() => {
    loadRecommendations();
    loadStats();
  }, []);

  const loadStats = () => {
    const bookStats = storage.getTotalBooks();
    setStats(bookStats);
  };

  const loadRecommendations = async () => {
    setLoading(true);

    // Haal gelezen boeken op
    const haveReadBooks = storage.getHaveReadBooks();

    if (haveReadBooks.length === 0) {
      // Als er geen gelezen boeken zijn, toon populaire boeken
      const popular = await booksAPI.searchBooks('bestseller fiction', 12);
      setRecommendations(popular);
      setLoading(false);
      return;
    }

    // Verzamel alle categorieën en auteurs van gelezen boeken
    const categories = new Set<string>();
    const authors = new Set<string>();

    haveReadBooks.forEach(book => {
      book.categories.forEach(cat => categories.add(cat));
      book.authors.forEach(author => authors.add(author));
    });

    // Zoek recommendations op basis van categorieën en auteurs
    const recommendedBooks: Book[] = [];

    // Zoek op favoriete categorie
    if (categories.size > 0) {
      const mainCategory = Array.from(categories)[0];
      const categoryBooks = await booksAPI.searchBooks(`subject:${mainCategory}`, 6);
      recommendedBooks.push(...categoryBooks);
    }

    // Zoek op favoriete auteur
    if (authors.size > 0) {
      const mainAuthor = Array.from(authors)[0];
      const authorBooks = await booksAPI.searchBooks(`inauthor:${mainAuthor}`, 6);
      recommendedBooks.push(...authorBooks);
    }

    // Filter duplicaten en boeken die je al hebt
    const uniqueBooks = recommendedBooks.filter((book, index, self) => {
      const isDuplicate = self.findIndex(b => b.id === book.id) !== index;
      const alreadyHave = storage.isBookInHaveRead(book.id) || storage.isBookInToRead(book.id);
      return !isDuplicate && !alreadyHave;
    });

    setRecommendations(uniqueBooks.slice(0, 12));
    setLoading(false);
  };

  const handleAddToRead = (book: Book) => {
    if (storage.isBookInToRead(book.id)) {
      alert('Dit boek staat al in je To Read lijst!');
      return;
    }

    storage.addToReadBook(book);
    alert(`${book.title} toegevoegd aan To Read!`);

    // Refresh recommendations (filter toegevoegd boek eruit)
    setRecommendations(prev => prev.filter(b => b.id !== book.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Recommendations sectie */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {stats.haveRead > 0 ? 'Aanbevolen voor jou' : 'Populaire boeken'}
          </h2>
          <button
            onClick={loadRecommendations}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Laden...' : 'Ververs'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-4">Aanbevelingen laden...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              Geen aanbevelingen gevonden
            </p>
            <p className="text-gray-500 text-sm">
              Voeg wat boeken toe aan je Have Read lijst om gepersonaliseerde aanbevelingen te krijgen!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {recommendations.map(book => (
              <div key={book.id} className="group">
                <div className="border rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300">
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">Geen cover</span>
                    </div>
                  )}

                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 h-10">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                      {book.authors.join(', ')}
                    </p>

                    {book.averageRating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-xs font-medium">
                          {book.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({book.ratingsCount})
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => handleAddToRead(book)}
                      className="w-full mt-2 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                    >
                      + To Read
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}