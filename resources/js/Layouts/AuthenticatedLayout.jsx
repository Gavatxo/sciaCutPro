import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Dropdown from "@/Components/Dropdown";

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, url } = usePage().props;
    const user = auth.user;

    // Helper pour vérifier la route actuelle
    const isCurrentRoute = (path) => {
        const currentPath = window.location.pathname;
        if (path === "/dashboard") {
            return currentPath === "/dashboard";
        }
        return currentPath.startsWith(path);
    };

    const navigation = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: "📊",
            current: isCurrentRoute("/dashboard"),
        },
        {
            name: "Clients",
            href: "/clients",
            icon: "👥",
            current: isCurrentRoute("/clients"),
        },
        {
            name: "Devis",
            href: "/devis",
            icon: "📋",
            current: isCurrentRoute("/devis"),
        },
        {
            name: "Factures",
            href: "#",
            icon: "🧾",
            current: false,
        },
        {
            name: "Catalogue",
            href: "#",
            icon: "📝",
            current: false,
        },
        {
            name: "Statistiques",
            href: "#",
            icon: "📈",
            current: false,
        },
        {
            name: "Configuration",
            href: "#",
            icon: "⚙️",
            current: false,
        },
    ];

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
            <div className="container max-w-7xl mx-auto">
                {/* Header */}
                <header className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-4xl mr-3">⚡</span>
                            <span className="text-3xl font-bold text-gray-800">
                                SciaCut Pro
                            </span>
                        </div>

                        {/* Desktop User Menu */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-gray-700">{user.name}</span>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition-all">
                                        {user.name
                                            ? user.name.charAt(0).toUpperCase()
                                            : "U"}
                                    </div>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href="/profile">
                                        👤 Profil
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                    >
                                        🚪 Déconnexion
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() =>
                                    setShowMobileMenu(!showMobileMenu)
                                }
                                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash && flash.success && (
                    <div className="bg-green-500 text-white p-4 rounded-lg mb-6 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span>✅</span>
                            {flash.success}
                        </div>
                    </div>
                )}
                {flash && flash.error && (
                    <div className="bg-red-500 text-white p-4 rounded-lg mb-6 shadow-lg">
                        <div className="flex items-center gap-2">
                            <span>❌</span>
                            {flash.error}
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden bg-white rounded-2xl p-5 mb-6 shadow-lg">
                        <div className="space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center p-3 rounded-lg transition-all ${
                                        item.current
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white transform translate-x-1"
                                            : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:transform hover:translate-x-1"
                                    }`}
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <span className="mr-3 text-lg">
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
                    {/* Desktop Sidebar */}
                    <nav className="hidden lg:block bg-white rounded-2xl p-5 h-fit shadow-lg">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center p-3 mb-2 rounded-lg transition-all ${
                                    item.current
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white transform translate-x-1"
                                        : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:transform hover:translate-x-1"
                                }`}
                            >
                                <span className="mr-3 text-lg">
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Main Content */}
                    <main className="bg-white rounded-2xl shadow-lg">
                        {header && (
                            <header className="px-8 py-6 border-b-2 border-gray-100">
                                {header}
                            </header>
                        )}
                        <div className="p-8">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
