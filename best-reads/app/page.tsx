'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/app/types/book';
import { BookStorage } from '@/app/services/bookStorage';
import { GoogleBooksAPI } from '@/app/services/googleBooksAPI';
import BookCard from '@/app/components/BookCard';


export default function HomePage() {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [toReadBooks, setToReadBooks] = useState<Book[]>([]);

  const storage = new BookStorage();
  const booksAPI = new GoogleBooksAPI();

  useEffect(() => {
    loadRecommendations();
  }, []);

  // Hulpfunctie: Check of een boek al bestaat in de collectie
  const isDuplicateBook = (book: Book, existingBooks: Book[]): boolean => {
    return existingBooks.some(existing => {
      // Check 1: Exacte ID match
      if (book.id === existing.id) return true;

      // Check 2: ISBN match (meest betrouwbaar)
      if (book.isbn && existing.isbn && book.isbn === existing.isbn) {
        return true;
      }

      // Check 3: Titel + Auteur combinatie (case-insensitive)
      const sameTitle = book.title.toLowerCase().trim() ===
        existing.title.toLowerCase().trim();
      const hasCommonAuthor = book.authors.some(author =>
        existing.authors.some(existingAuthor =>
          author.toLowerCase().trim() === existingAuthor.toLowerCase().trim()
        )
      );

      if (sameTitle && hasCommonAuthor) return true;

      // Check 4: Zeer vergelijkbare titels met dezelfde auteur
      const similarity = calculateTitleSimilarity(book.title, existing.title);
      if (similarity > 0.85 && hasCommonAuthor) return true;

      return false;
    });
  };

  // Hulpfunctie: Bereken gelijkenis tussen twee titels
  const calculateTitleSimilarity = (title1: string, title2: string): number => {
    const t1 = title1.toLowerCase().trim();
    const t2 = title2.toLowerCase().trim();

    if (t1 === t2) return 1;

    // Verwijder veel voorkomende woorden die verschillen kunnen veroorzaken
    const cleanTitle = (title: string) => {
      return title
        .replace(/\b(the|a|an|and|or|of|in|on|at|to|for)\b/gi, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const clean1 = cleanTitle(t1);
    const clean2 = cleanTitle(t2);

    if (clean1 === clean2) return 0.95;

    // Check of de ene titel de andere bevat
    if (clean1.includes(clean2) || clean2.includes(clean1)) {
      return 0.9;
    }

    // Simpele character overlap check
    const longer = clean1.length > clean2.length ? clean1 : clean2;
    const shorter = clean1.length > clean2.length ? clean2 : clean1;

    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer[i] === shorter[i]) matches++;
    }

    return matches / longer.length;
  };

  const loadRecommendations = async () => {
    setLoading(true);

    // Haal alle boeken op
    const haveReadBooks = storage.getHaveReadBooks();
    const toReadBooks = storage.getToReadBooks();
    const allExistingBooks = [...haveReadBooks, ...toReadBooks];

    // Als er geen gelezen boeken zijn, toon populaire Engelse boeken
    if (haveReadBooks.length === 0) {
      const popular = await booksAPI.searchBooks('bestseller fiction', 12, 'en');
      setRecommendations(popular);
      setLoading(false);
      return;
    }

    // STAP 1: Analyseer leesgeschiedenis - tel frequenties
    const categoryCount = new Map<string, number>();
    const authorCount = new Map<string, number>();

    haveReadBooks.forEach(book => {
      // Tel categorieën
      book.categories.forEach(cat => {
        const cleanCat = cat.trim();
        categoryCount.set(cleanCat, (categoryCount.get(cleanCat) || 0) + 1);
      });

      // Tel auteurs
      book.authors.forEach(author => {
        const cleanAuthor = author.trim();
        authorCount.set(cleanAuthor, (authorCount.get(cleanAuthor) || 0) + 1);
      });
    });

    // Selecteer top categorieën en auteurs
    const topCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1]) // Sorteer op frequentie
      .slice(0, 3) // Neem top 3
      .map(([cat]) => cat);

    const topAuthors = Array.from(authorCount.entries())
      .sort((a, b) => b[1] - a[1]) // Sorteer op frequentie
      .slice(0, 2) // Neem top 2
      .map(([author]) => author);

    // Zoek recommendations op basis van analyse
    const recommendedBooks: Book[] = [];

    // Zoek op basis van favoriete categorieën (alleen Engels!)
    for (const category of topCategories) {
      try {
        const categoryBooks = await booksAPI.searchBooks(
          `subject:${category}`,
          8,
          'en'
        );
        recommendedBooks.push(...categoryBooks);
      } catch (error) {
        console.error(`Error while searching category ${category}:`, error);
      }
    }

    // Zoek op basis van favoriete auteurs 
    for (const author of topAuthors) {
      try {
        const authorBooks = await booksAPI.searchBooks(
          `inauthor:"${author}"`,
          6,
          'en'
        );
        recommendedBooks.push(...authorBooks);
      } catch (error) {
        console.error(`Error while searching author ${author}:`, error);
      }
    }

    // STAP 4: Filter duplicaten en boeken die je al hebt
    const uniqueBooks = recommendedBooks.filter((book, index, self) => {
      const firstOccurrence = self.findIndex(b => {
        // Simpele check binnen dezelfde lijst
        if (b.id === book.id) return true;
        if (b.isbn && book.isbn && b.isbn === book.isbn) return true;

        const sameTitle = b.title.toLowerCase().trim() ===
          book.title.toLowerCase().trim();
        const sameAuthor = b.authors[0]?.toLowerCase() ===
          book.authors[0]?.toLowerCase();

        return sameTitle && sameAuthor;
      });

      // Als dit niet de eerste keer is dat we dit boek zien, skip het
      if (firstOccurrence !== index) return false;

      // Check of het boek al in je collectie zit
      const alreadyOwned = isDuplicateBook(book, allExistingBooks);

      return !alreadyOwned;
    });

    // STAP 5: Shuffle voor variatie en limiteer
    const shuffled = uniqueBooks
      .sort(() => Math.random() - 0.5)
      .slice(0, 12);

    setRecommendations(shuffled);
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

        <button
          onClick={loadRecommendations}
          className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>

      </div>
    </div>
  );
}
