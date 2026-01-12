import { useState, useEffect } from 'react';

export function PagesRead() {
    const [totalPages, setTotalPages] = useState(0);
    const [readBooksCount, setReadBooksCount] = useState(0);

    useEffect(() => {
        const readBooksJson = localStorage.getItem('haveread-books');
        if (readBooksJson) {
            const readBooks = JSON.parse(readBooksJson);
            setReadBooksCount(readBooks.length);

            const total = readBooks.reduce((sum: number, book: any) => {
                return sum + book.pageCount;
            }, 0);

            setTotalPages(total);
        }
    }, []);

    return { totalPages, readBooksCount };
}


export function TotalPagesRead() {
    const { totalPages, readBooksCount } = PagesRead();

    if (readBooksCount === 0) return null;

    return (
        <div className="text-black px-4 py-2">
            <div className="flex items-center gap-3">
                <div>
                    <div className="text-l opacity-100">Total Pages Read:</div>
                    <div className="text-1xl font-bold">{totalPages.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}