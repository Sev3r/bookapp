import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "To Read",
    description:
        "Books you plan to read in the future",
};

export default function ToReadPage() {
    return (
        <>
            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-brown">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wider">
                                To Read
                            </h1>
                        </div>
                    </div>
                </section>

                {/* Navigation to other pages */}
                <section className="py-12 px-4 bg-coral text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-lg mb-4">Want to explore more?</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/HaveRead"
                                className="px-6 py-3 bg-white text-coral rounded-lg font-semibold hover:scale-105 transition-transform"
                            >
                                Have Read
                            </Link>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-brown text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                            >
                                Recommended
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}