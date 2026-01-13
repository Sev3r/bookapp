'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/app/types/book';
import { BookStorage } from '@/app/services/bookStorage';
import { GoogleBooksAPI } from '@/app/services/googleBooksAPI';
import BookCard from '@/app/components/BookCard';


export default function HomePage() {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const storage = new BookStorage();
  const booksAPI = new GoogleBooksAPI();

  useEffect(() => {
    loadRecommendations();
  }, []);

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
      const categoryBooks = await booksAPI.searchBooks(`subject:${mainCategory}`, 10);
      recommendedBooks.push(...categoryBooks);
    }

    // Zoek op favoriete auteur
    if (authors.size > 0) {
      const mainAuthor = Array.from(authors)[0];
      const authorBooks = await booksAPI.searchBooks(`inauthor:${mainAuthor}`, 10);
      recommendedBooks.push(...authorBooks);
    }

    // Filter duplicaten en boeken die je al hebt
    const uniqueBooks = recommendedBooks.filter((book, index, self) => {
      const isDuplicate = self.findIndex(b => b.id === book.id) !== index;
      const alreadyHave = storage.isBookInHaveRead(book.id) || storage.isBookInToRead(book.id);
      return !isDuplicate && !alreadyHave;
    });

    setRecommendations(uniqueBooks.slice(0, 20));
    setLoading(false);
  };



  return (
    <div className="min-h-screen p-6 bg-emerald-700">

      {/* Recommendations sectie */}
      <div className="rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Recommended
          </h2>
          <button
            onClick={loadRecommendations}
            className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-4">Loading recommendations...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              No recommendations available
            </p>
            <p className="text-gray-500 text-sm">
              Add some books to your Have Read list in order to get recommendations!
            </p>
          </div>
        ) : (
          <div className="books-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
