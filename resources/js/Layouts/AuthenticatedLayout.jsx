import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Dropdown from "@/Components/Dropdown";

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, url } = usePage().props;
    const user = auth.user;

    // Helper pour vérifier la route actuelle
    const isCurrentRoute = (path) => {
        if (!window || !window.location) return false;

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
            available: true,
        },
        {
            name: "Clients",
            href: "/clients",
            icon: "👥",
            current: isCurrentRoute("/clients"),
            available: true,
        },
        {
            name: "Devis",
            href: "/devis",
            icon: "📋",
            current: isCurrentRoute("/devis"),
            available: true,
        },
        {
            name: "Factures",
            href: "/factures",
            icon: "💰",
            current: isCurrentRoute("/factures"),
            available: false,
        },
        {
            name: "Prestations",
            href: "/prestations",
            icon: "🔧",
            current: isCurrentRoute("/prestations"),
            available: false,
        },
        {
            name: "Analytics",
            href: "/analytics",
            icon: "📈",
            current: isCurrentRoute("/analytics"),
            available: false,
        },
        {
            name: "Configuration",
            href: "/settings",
            icon: "⚙️",
            current: isCurrentRoute("/settings"),
            available: false,
        },
    ];

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Composant pour gérer les liens selon disponibilité
    const NavigationLink = ({ item, className, onClick, isMobile = false }) => {
        if (!item.available) {
            return (
                <div
                    className={`${className} opacity-60 cursor-not-allowed relative group`}
                    title="Fonctionnalité bientôt disponible"
                >
                    <span className="text-lg mr-3">{item.icon}</span>
                    {item.name}
                    <span className="ml-auto text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-medium">
                        Bientôt
                    </span>
                    {!isMobile && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                            Fonctionnalité en développement
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                href={item.href}
                className={className}
                onClick={onClick}
                preserveScroll
            >
                <span className="text-lg mr-3">{item.icon}</span>
                {item.name}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header fixe */}
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo et nom */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        B
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold text-gray-900">
                                        BuildFlow
                                    </span>
                                    <div className="text-xs text-gray-500 -mt-1">
                                        Gestion de chantiers
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions desktop */}
                        <div className="hidden md:flex items-center gap-6">
                            {/* Quick Actions */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/devis/create"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    <span className="mr-2">📋</span>
                                    Nouveau devis
                                </Link>
                            </div>

                            {/* Notifications */}
                            <div className="relative">
                                <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                                    <span className="text-lg">🔔</span>
                                </button>
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                    3
                                </span>
                            </div>

                            {/* User menu */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div className="flex items-center space-x-3 cursor-pointer group">
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Administrateur
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:from-blue-700 group-hover:to-indigo-700 transition-all">
                                            {user.name
                                                ? user.name
                                                      .charAt(0)
                                                      .toUpperCase()
                                                : "U"}
                                        </div>
                                    </div>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>
                                        👤 Mon profil
                                    </Dropdown.Link>
                                    <Dropdown.Link href="/settings">
                                        ⚙️ Paramètres
                                    </Dropdown.Link>
                                    <hr className="my-1" />
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        🚪 Déconnexion
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                        >
                            {showMobileMenu ? "✕" : "☰"}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {showMobileMenu && (
                    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
                        <div className="px-6 py-4 space-y-2">
                            {navigation.map((item) => (
                                <NavigationLink
                                    key={item.name}
                                    item={item}
                                    isMobile={true}
                                    className={`flex items-center p-3 rounded-lg transition-all ${
                                        item.current
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                    onClick={() => setShowMobileMenu(false)}
                                />
                            ))}

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <Link
                                    href={route("profile.edit")}
                                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <span className="text-lg mr-3">👤</span>
                                    Mon profil
                                </Link>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                                >
                                    <span className="text-lg mr-3">🚪</span>
                                    Déconnexion
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Sidebar + Main layout */}
            <div className="pt-20 flex">
                {/* Sidebar Desktop */}
                <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 h-screen sticky top-20 overflow-y-auto">
                    <div className="p-6">
                        <nav className="space-y-2">
                            {navigation.map((item) => (
                                <NavigationLink
                                    key={item.name}
                                    item={item}
                                    className={`flex items-center p-3 rounded-xl transition-all font-medium ${
                                        item.current
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                />
                            ))}
                        </nav>

                        {/* Quick Stats dans la sidebar */}
                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                Aperçu rapide
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">
                                        Devis en cours
                                    </span>
                                    <span className="text-sm font-bold text-blue-600">
                                        12
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">
                                        CA du mois
                                    </span>
                                    <span className="text-sm font-bold text-green-600">
                                        €45,200
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-600">
                                        Factures impayées
                                    </span>
                                    <span className="text-sm font-bold text-orange-600">
                                        3
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 min-h-screen">
                    {/* Flash Messages */}
                    {flash && flash.success && (
                        <div className="mx-6 mt-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">✅</span>
                                <span className="font-medium">
                                    {flash.success}
                                </span>
                            </div>
                        </div>
                    )}
                    {flash && flash.error && (
                        <div className="mx-6 mt-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">❌</span>
                                <span className="font-medium">
                                    {flash.error}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Page Header */}
                    {header && (
                        <div className="bg-white border-b border-gray-200 px-6 py-6">
                            {header}
                        </div>
                    )}

                    {/* Page Content */}
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
