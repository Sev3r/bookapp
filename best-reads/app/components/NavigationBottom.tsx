"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { href: "/HaveRead", label: "Have Read" },
        { href: "/ToRead", label: "To Read" },
    ];

    return (
        <nav className="sticky bottom-0 z-50 bg-amber-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-16 grid grid-cols-3">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <img
                            src="/icons/logo.png"
                            alt="Logo"
                            className="h-10 w-auto"
                        />
                    </Link>

                    <div className="hidden md:flex items-center space-x-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-2 py-2 rounded-lg transition-all text-emerald-700 font-semibold ${pathname === item.href
                                    ? "text-emerald-900 font-bold"
                                    : "hover:text-emerald-900"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>


                </div>
            </div>
        </nav>
    );
}