"use client";
import Link from "next/link";

export default function Navigation() {
    return (
        <nav className="sticky bottom-0 z-50 bg-amber-100 border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="items-center justify-center h-16 grid grid-cols-3">

                    <Link href="/ToRead" className="flex items-center justify-begin">
                        <img src="/screenshots/toread.png" alt="To Read" className="h-10 w-auto" />
                    </Link>

                    <Link href="/" className="flex items-center justify-center">
                        <img src="/icons/logo.png" alt="Logo" className="h-10 w-auto" />
                    </Link>


                    <Link href="/HaveRead" className="flex items-center justify-end">
                        <img src="/screenshots/haveread.png" alt="Have Read" className="h-10 w-auto" />
                    </Link>


                </div>
            </div>
        </nav>
    );
}