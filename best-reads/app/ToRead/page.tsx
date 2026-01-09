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

            </main>
        </>
    );
}