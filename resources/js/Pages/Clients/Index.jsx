// resources/js/Pages/Clients/Index.jsx - Version modernisée particuliers/professionnels

import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function ClientsIndex({ clients, filters, stats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [typeFilter, setTypeFilter] = useState(filters.type || "");

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/clients",
            { search, type: typeFilter },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleFilterChange = (newType) => {
        setTypeFilter(newType);
        router.get(
            "/clients",
            { search, type: newType },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const getClientIcon = (type) => {
        return type === "particulier" ? "🏠" : "🏢";
    };

    const getClientBadge = (type) => {
        if (type === "particulier") {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🏠 Particulier
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                🏢 Professionnel
            </span>
        );
    };

    const getPaymentTermsBadge = (days) => {
        const color =
            days <= 15
                ? "bg-green-100 text-green-800"
                : days <= 30
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800";

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}
            >
                {days}j
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Clients
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gérez vos clients particuliers et professionnels
                        </p>
                    </div>
                    <Link
                        href="/clients/create"
                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <span className="mr-2">👤</span>
                        Nouveau client
                    </Link>
                </div>
            }
        >
            <Head title="Clients - BuildFlow" />

            <div className="space-y-6">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">👥</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total_clients}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Total clients
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">🏠</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.particuliers}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Particuliers
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">🏢</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.professionnels}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Professionnels
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres et recherche */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Recherche */}
                        <form
                            onSubmit={handleSearch}
                            className="flex-1 max-w-md"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher un client..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </form>

                        {/* Filtres par type */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleFilterChange("")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    typeFilter === ""
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Tous
                            </button>
                            <button
                                onClick={() =>
                                    handleFilterChange("particulier")
                                }
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    typeFilter === "particulier"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                🏠 Particuliers
                            </button>
                            <button
                                onClick={() =>
                                    handleFilterChange("professionnel")
                                }
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    typeFilter === "professionnel"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                🏢 Professionnels
                            </button>
                        </div>
                    </div>
                </div>

                {/* Liste des clients */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {clients.data && clients.data.length > 0 ? (
                        <>
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {clients.total} client
                                    {clients.total > 1 ? "s" : ""} trouvé
                                    {clients.total > 1 ? "s" : ""}
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {clients.data.map((client) => (
                                    <div
                                        key={client.id}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                                                    <span className="text-xl">
                                                        {getClientIcon(
                                                            client.type
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {client.name}
                                                        </h3>
                                                        {getClientBadge(
                                                            client.type
                                                        )}
                                                        {client.payment_terms &&
                                                            getPaymentTermsBadge(
                                                                client.payment_terms
                                                            )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {client.type ===
                                                            "professionnel" &&
                                                            client.contact_person && (
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-medium">
                                                                        Contact:
                                                                    </span>{" "}
                                                                    {
                                                                        client.contact_person
                                                                    }
                                                                </p>
                                                            )}
                                                        {client.city && (
                                                            <p className="text-sm text-gray-600 flex items-center">
                                                                <span className="mr-1">
                                                                    📍
                                                                </span>
                                                                {
                                                                    client.postal_code
                                                                }{" "}
                                                                {client.city}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            {client.phone && (
                                                                <span className="flex items-center">
                                                                    <span className="mr-1">
                                                                        📞
                                                                    </span>
                                                                    {
                                                                        client.phone
                                                                    }
                                                                </span>
                                                            )}
                                                            {client.email && (
                                                                <span className="flex items-center">
                                                                    <span className="mr-1">
                                                                        ✉️
                                                                    </span>
                                                                    {
                                                                        client.email
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                {/* Statistiques du client */}
                                                <div className="text-right space-y-1">
                                                    <div className="text-sm text-gray-600">
                                                        {
                                                            client.stats
                                                                .total_devis
                                                        }{" "}
                                                        devis
                                                    </div>
                                                    <div className="text-lg font-bold text-green-600">
                                                        {formatPrice(
                                                            client.stats
                                                                .total_ca
                                                        )}
                                                    </div>
                                                    {client.stats
                                                        .devis_attente > 0 && (
                                                        <div className="text-xs text-orange-600">
                                                            {
                                                                client.stats
                                                                    .devis_attente
                                                            }{" "}
                                                            en attente
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/clients/${client.id}`}
                                                        className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                                                    >
                                                        <span className="mr-1">
                                                            👁️
                                                        </span>
                                                        Voir
                                                    </Link>
                                                    <Link
                                                        href={`/clients/${client.id}/devis`}
                                                        className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                                                    >
                                                        <span className="mr-1">
                                                            📋
                                                        </span>
                                                        Devis
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {clients.links && clients.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-100">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {clients.links.map((link, index) =>
                                                link.url ? (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                            link.active
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-2 text-gray-400 text-sm"
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Affichage de {clients.from || 0} à{" "}
                                            {clients.to || 0} sur{" "}
                                            {clients.total} résultats
                                        </div>
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">👥</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                {search || typeFilter
                                    ? "Aucun client trouvé"
                                    : "Aucun client"}
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                {search || typeFilter
                                    ? "Essayez de modifier vos critères de recherche"
                                    : "Commencez par ajouter votre premier client"}
                            </p>
                            {!search && !typeFilter && (
                                <Link
                                    href="/clients/create"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <span className="mr-2">👤</span>
                                    Ajouter mon premier client
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
