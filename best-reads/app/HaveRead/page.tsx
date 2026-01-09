import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Have Read",
    description:
        "Books you've read up until now",
};

export default function HaveReadPage() {
    return (
        <>
            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-brown">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wider">
                                Have Read
                            </h1>
                        </div>
                    </div>
                </section>

                {/* Navigation to other pages */}
                <section className="py-12 px-4 bg-brown text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-lg mb-4">Want to explore more?</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/ToRead"
                                className="px-6 py-3 bg-white text-brown rounded-lg font-semibold hover:scale-105 transition-transform"
                            >
                                To Read
                            </Link>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-coral text-white rounded-lg font-semibold hover:scale-105 transition-transform"
                            >
                                My Recommended
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}