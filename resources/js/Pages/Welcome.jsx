import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Welcome({ auth, canLogin, canRegister }) {
    const [currentFeature, setCurrentFeature] = useState(0);

    const features = [
        {
            title: "Devis intelligents",
            description:
                "Créez des devis professionnels en quelques clics avec notre catalogue de prestations pré-configuré.",
            icon: "📋",
            color: "from-blue-500 to-indigo-600",
        },
        {
            title: "Facturation simplifiée",
            description:
                "Transformez vos devis en factures instantanément. Suivi des paiements et relances automatiques.",
            icon: "💰",
            color: "from-green-500 to-emerald-600",
        },
        {
            title: "Signature électronique",
            description:
                "Faites signer vos devis à distance avec une valeur légale. Plus besoin de se déplacer !",
            icon: "✍️",
            color: "from-purple-500 to-violet-600",
        },
        {
            title: "Gestion des chantiers",
            description:
                "Planifiez, organisez et suivez tous vos chantiers depuis une interface unique et intuitive.",
            icon: "🏗️",
            color: "from-orange-500 to-red-600",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="BuildFlow - La solution complète pour vos chantiers" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        B
                                    </span>
                                </div>
                                <span className="text-2xl font-bold text-gray-900">
                                    BuildFlow
                                </span>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a
                                href="#features"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                Fonctionnalités
                            </a>
                            <a
                                href="#pricing"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                Tarifs
                            </a>
                            <a
                                href="#contact"
                                className="text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                Contact
                            </a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    {canLogin && (
                                        <Link
                                            href="/login"
                                            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                                        >
                                            Connexion
                                        </Link>
                                    )}
                                    {canRegister && (
                                        <Link
                                            href="/register"
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                                        >
                                            Essai gratuit
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Content */}
                        <div>
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                                🚀 Nouveau : Signature électronique intégrée
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Gérez vos{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    chantiers
                                </span>{" "}
                                comme un pro
                            </h1>

                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                BuildFlow révolutionne la gestion de vos projets
                                BTP. Devis, factures, planning et suivi clients
                                : tout en un seul endroit, simple et efficace.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Commencer gratuitement
                                    <svg
                                        className="ml-2 w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                </Link>

                                <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all">
                                    <svg
                                        className="mr-2 w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Voir la démo
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        500+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Entreprises utilisatrices
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        50k+
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Devis générés
                                    </div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        98%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Satisfaction client
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Feature Showcase */}
                        <div className="relative">
                            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                                <div
                                    className={`w-16 h-16 bg-gradient-to-r ${features[currentFeature].color} rounded-xl flex items-center justify-center text-2xl mb-6 transition-all duration-500`}
                                >
                                    {features[currentFeature].icon}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {features[currentFeature].title}
                                </h3>

                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {features[currentFeature].description}
                                </p>

                                {/* Feature indicators */}
                                <div className="flex space-x-2">
                                    {features.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentFeature(index)
                                            }
                                            className={`w-3 h-3 rounded-full transition-all ${
                                                index === currentFeature
                                                    ? "bg-blue-600"
                                                    : "bg-gray-300 hover:bg-gray-400"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-60 blur-xl"></div>
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl opacity-40 blur-xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Tout ce dont vous avez besoin
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Une suite d'outils pensée spécialement pour les
                            professionnels du BTP, de l'artisan à la grande
                            entreprise.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group hover:scale-105 transition-transform duration-300"
                            >
                                <div className="bg-gray-50 rounded-2xl p-8 text-center h-full hover:bg-white hover:shadow-lg transition-all">
                                    <div
                                        className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-6`}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Prêt à transformer votre gestion de chantiers ?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Rejoignez des centaines d'entreprises qui ont déjà fait
                        le choix de BuildFlow
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
                    >
                        Commencer mon essai gratuit
                        <svg
                            className="ml-2 w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">
                                        B
                                    </span>
                                </div>
                                <span className="text-xl font-bold">
                                    BuildFlow
                                </span>
                            </div>
                            <p className="text-gray-400">
                                La solution complète pour la gestion de vos
                                chantiers et projets BTP.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Produit</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Fonctionnalités
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Tarifs
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        API
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Contact
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Entreprise</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        À propos
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition-colors"
                                    >
                                        Carrières
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 BuildFlow. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
