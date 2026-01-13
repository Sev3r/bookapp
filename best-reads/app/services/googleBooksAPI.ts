export interface Book {
    id: string;
    title: string;
    authors: string[];
    description: string;
    pageCount: number;
    categories: string[];
    averageRating: number;
    ratingsCount: number;
    thumbnail: string;
    coverImage: string;
    publishedDate: string;
    publisher: string;
    isbn: string | null;
    language: string;
}

interface VolumeInfo {
    title?: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
        medium?: string;
        large?: string;
    };
    publishedDate?: string;
    publisher?: string;
    industryIdentifiers?: Array<{
        type: string;
        identifier: string;
    }>;
    language?: string;
}

interface GoogleBooksItem {
    id: string;
    volumeInfo?: VolumeInfo;
}

interface GoogleBooksResponse {
    items?: GoogleBooksItem[];
}

export class GoogleBooksAPI {
    private baseURL: string;
    private apiKey: string;

    constructor(apiKey: string = '') {
        this.baseURL = 'https://www.googleapis.com/books/v1/volumes';
        this.apiKey = apiKey;
    }

    // Zoek boeken op titel, auteur of zoekterm
    async searchBooks(query: string, maxResults: number = 10, langRestrict: string = 'en'): Promise<Book[]> {
        try {
            const params = new URLSearchParams({
                q: query,
                maxResults: maxResults.toString(),
                langRestrict: langRestrict
            });

            if (this.apiKey) {
                params.append('key', this.apiKey);
            }

            const url = `${this.baseURL}?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: GoogleBooksResponse = await response.json();
            return this.formatBooks(data.items || []);
        } catch (error) {
            console.error('Zoekfout:', error);
            return [];
        }
    }

    // Haal boek op via ISBN
    async getBookByISBN(isbn: string): Promise<Book | null> {
        try {
            const params = new URLSearchParams({
                q: `isbn:${isbn}`,
            });

            if (this.apiKey) {
                params.append('key', this.apiKey);
            }

            const url = `${this.baseURL}?${params.toString()}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: GoogleBooksResponse = await response.json();

            if (data.items && data.items.length > 0) {
                return this.formatBook(data.items[0]);
            }

            return null;
        } catch (error) {
            console.error('ISBN zoekfout:', error);
            return null;
        }
    }

    // Haal specifiek boek op via Google Books ID
    async getBookById(volumeId: string): Promise<Book | null> {
        try {
            const url = this.apiKey
                ? `${this.baseURL}/${volumeId}?key=${this.apiKey}`
                : `${this.baseURL}/${volumeId}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: GoogleBooksItem = await response.json();
            return this.formatBook(data);
        } catch (error) {
            console.error('Boek ophalen fout:', error);
            return null;
        }
    }

    // Zoek vergelijkbare boeken op basis van categorie
    async getSimilarBooks(book: Book, maxResults: number = 10): Promise<Book[]> {
        if (!book.categories || book.categories.length === 0) {
            // Als er geen categorieën zijn, zoek op auteur
            if (book.authors && book.authors.length > 0) {
                return await this.searchBooks(`inauthor:${book.authors[0]}`, maxResults);
            }
            return [];
        }

        const category = book.categories[0];
        const query = `subject:${category}`;

        return await this.searchBooks(query, maxResults);
    }

    // Formatteer één boek naar bruikbaar object
    private formatBook(item: GoogleBooksItem): Book {
        const info = item.volumeInfo || {};

        return {
            id: item.id,
            title: info.title || 'Onbekende titel',
            authors: info.authors || ['Onbekende auteur'],
            description: info.description || 'Geen beschrijving beschikbaar',
            pageCount: info.pageCount || 0,
            categories: info.categories || [],
            averageRating: info.averageRating || 0,
            ratingsCount: info.ratingsCount || 0,
            thumbnail: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '',
            coverImage:
                info.imageLinks?.large ||
                info.imageLinks?.medium ||
                info.imageLinks?.thumbnail ||
                '',
            publishedDate: info.publishedDate || '',
            publisher: info.publisher || '',
            isbn: this.extractISBN(info.industryIdentifiers),
            language: info.language || 'unknown',
        };
    }

    // Formatteer meerdere boeken
    private formatBooks(items: GoogleBooksItem[]): Book[] {
        return items.map((item) => this.formatBook(item));
    }

    // Haal ISBN uit industryIdentifiers
    private extractISBN(
        identifiers?: Array<{ type: string; identifier: string }>
    ): string | null {
        if (!identifiers) return null;

        const isbn13 = identifiers.find((id) => id.type === 'ISBN_13');
        const isbn10 = identifiers.find((id) => id.type === 'ISBN_10');

        return isbn13?.identifier || isbn10?.identifier || null;
    }
}

// Singleton instantie (optioneel)
export const booksAPI = new GoogleBooksAPI();