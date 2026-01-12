import { Book } from '@/app/types/book';

export class BookStorage {
    private TOREAD_KEY = 'toread-books';
    private HAVEREAD_KEY = 'haveread-books';

    // Check of we in de browser zijn (voor SSR compatibility)
    private isBrowser(): boolean {
        return typeof window !== 'undefined';
    }

    getToReadBooks(): Book[] {
        if (!this.isBrowser()) return [];

        try {
            const stored = localStorage.getItem(this.TOREAD_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('There has been a problem loading your books:', error);
            return [];
        }
    }

    addToReadBook(book: Book): void {
        if (!this.isBrowser()) return;

        try {
            const books = this.getToReadBooks();

            // Check of boek al bestaat
            if (books.some(b => b.id === book.id)) {
                console.warn('Book is already in list');
                return;
            }

            books.push(book);
            localStorage.setItem(this.TOREAD_KEY, JSON.stringify(books));
        } catch (error) {
            console.error('Error while adding book:', error);
        }
    }

    removeToReadBook(bookId: string): void {
        if (!this.isBrowser()) return;

        try {
            const books = this.getToReadBooks();
            const filtered = books.filter(b => b.id !== bookId);
            localStorage.setItem(this.TOREAD_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error('Error while removing book:', error);
        }
    }

    // === HAVE READ BOOKS ===

    getHaveReadBooks(): Book[] {
        if (!this.isBrowser()) return [];

        try {
            const stored = localStorage.getItem(this.HAVEREAD_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('There has been a problem loading your books:', error);
            return [];
        }
    }

    addHaveReadBook(book: Book): void {
        if (!this.isBrowser()) return;

        try {
            const books = this.getHaveReadBooks();

            // Check of boek al bestaat
            if (books.some(b => b.id === book.id)) {
                console.warn('Book is already in the have-read list');
                return;
            }

            books.push(book);
            localStorage.setItem(this.HAVEREAD_KEY, JSON.stringify(books));
        } catch (error) {
            console.error('Error while adding book:', error);
        }
    }

    removeHaveReadBook(bookId: string): void {
        if (!this.isBrowser()) return;

        try {
            const books = this.getHaveReadBooks();
            const filtered = books.filter(b => b.id !== bookId);
            localStorage.setItem(this.HAVEREAD_KEY, JSON.stringify(filtered));
        } catch (error) {
            console.error('Error while removing have-read book:', error);
        }
    }

    // === UTILITY METHODS ===

    // Verplaats boek van to-read naar have-read
    moveToHaveRead(bookId: string): void {
        if (!this.isBrowser()) return;

        const toReadBooks = this.getToReadBooks();
        const book = toReadBooks.find(b => b.id === bookId);

        if (book) {
            this.addHaveReadBook(book);
            this.removeToReadBook(bookId);
        }
    }

    // Verplaats boek van have-read naar to-read
    moveToToRead(bookId: string): void {
        if (!this.isBrowser()) return;

        const haveReadBooks = this.getHaveReadBooks();
        const book = haveReadBooks.find(b => b.id === bookId);

        if (book) {
            this.addToReadBook(book);
            this.removeHaveReadBook(bookId);
        }
    }

    // Check of boek al in een lijst staat
    isBookInToRead(bookId: string): boolean {
        return this.getToReadBooks().some(b => b.id === bookId);
    }

    isBookInHaveRead(bookId: string): boolean {
        return this.getHaveReadBooks().some(b => b.id === bookId);
    }

    // Verwijder alles (voor testing/reset)
    clearAll(): void {
        if (!this.isBrowser()) return;

        localStorage.removeItem(this.TOREAD_KEY);
        localStorage.removeItem(this.HAVEREAD_KEY);
    }

    // Get totaal aantal boeken
    getTotalBooks(): { toRead: number; haveRead: number; total: number } {
        const toRead = this.getToReadBooks().length;
        const haveRead = this.getHaveReadBooks().length;

        return {
            toRead,
            haveRead,
            total: toRead + haveRead
        };
    }
}

// Singleton instantie (optioneel)
export const bookStorage = new BookStorage();