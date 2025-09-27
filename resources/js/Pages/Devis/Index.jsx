// resources/js/Pages/Devis/Index.jsx - Liste des devis

import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function DevisIndex({ devis, filters, stats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            "/devis",
            { search, status: statusFilter },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        router.get(
            "/devis",
            { search, status: newStatus },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const getStatusBadge = (status) => {
        const badges = {
            brouillon: {
                color: "bg-gray-100 text-gray-700",
                text: "Brouillon",
                icon: "📝",
            },
            envoye: {
                color: "bg-blue-100 text-blue-700",
                text: "Envoyé",
                icon: "📤",
            },
            signe: {
                color: "bg-green-100 text-green-700",
                text: "Signé",
                icon: "✅",
            },
            refuse: {
                color: "bg-red-100 text-red-700",
                text: "Refusé",
                icon: "❌",
            },
            expire: {
                color: "bg-orange-100 text-orange-700",
                text: "Expiré",
                icon: "⏰",
            },
        };
        const badge = badges[status] || badges["brouillon"];

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
            >
                <span className="mr-1">{badge.icon}</span>
                {badge.text}
            </span>
        );
    };

    const getClientIcon = (client) => {
        if (!client) return "👤";
        return client.type === "particulier" ? "🏠" : "🏢";
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Devis
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gérez vos devis et propositions commerciales
                        </p>
                    </div>
                    <Link
                        href="/devis/create"
                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <span className="mr-2">📋</span>
                        Nouveau devis
                    </Link>
                </div>
            }
        >
            <Head title="Devis - BuildFlow" />

            <div className="space-y-6">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">📋</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Total devis
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">📝</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.brouillon}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Brouillons
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">📤</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.envoye}
                                </p>
                                <p className="text-sm text-gray-600">Envoyés</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">✅</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.signe}
                                </p>
                                <p className="text-sm text-gray-600">Signés</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">💰</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatPrice(stats.total_ca)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    CA signé
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
                                    placeholder="Rechercher un devis, client, chantier..."
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

                        {/* Filtres par statut */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => handleFilterChange("")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === ""
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                Tous
                            </button>
                            <button
                                onClick={() => handleFilterChange("brouillon")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === "brouillon"
                                        ? "bg-gray-200 text-gray-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                📝 Brouillons
                            </button>
                            <button
                                onClick={() => handleFilterChange("envoye")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === "envoye"
                                        ? "bg-blue-200 text-blue-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                📤 Envoyés
                            </button>
                            <button
                                onClick={() => handleFilterChange("signe")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === "signe"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                ✅ Signés
                            </button>
                        </div>
                    </div>
                </div>

                {/* Liste des devis */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {devis.data && devis.data.length > 0 ? (
                        <>
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {devis.total} devis trouvé
                                    {devis.total > 1 ? "s" : ""}
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {devis.data.map((devisItem) => (
                                    <div
                                        key={devisItem.id}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                                    <span className="text-xl">
                                                        📋
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            #{devisItem.numero}
                                                        </h3>
                                                        {getStatusBadge(
                                                            devisItem.status
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-blue-600">
                                                            {
                                                                devisItem.chantier_name
                                                            }
                                                        </div>
                                                        {devisItem.client && (
                                                            <div className="flex items-center text-sm text-gray-600">
                                                                <span className="mr-1">
                                                                    {getClientIcon(
                                                                        devisItem.client
                                                                    )}
                                                                </span>
                                                                <span className="font-medium">
                                                                    {
                                                                        devisItem
                                                                            .client
                                                                            .name
                                                                    }
                                                                </span>
                                                                {devisItem
                                                                    .client
                                                                    .type && (
                                                                    <span
                                                                        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                            devisItem
                                                                                .client
                                                                                .type ===
                                                                            "particulier"
                                                                                ? "bg-blue-100 text-blue-700"
                                                                                : "bg-purple-100 text-purple-700"
                                                                        }`}
                                                                    >
                                                                        {devisItem
                                                                            .client
                                                                            .type ===
                                                                        "particulier"
                                                                            ? "Particulier"
                                                                            : "Professionnel"}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="text-sm text-gray-600">
                                                            Créé le{" "}
                                                            {new Date(
                                                                devisItem.created_at
                                                            ).toLocaleDateString(
                                                                "fr-FR"
                                                            )}
                                                            {devisItem.date_intervention && (
                                                                <span className="ml-3">
                                                                    📅
                                                                    Intervention
                                                                    :{" "}
                                                                    {new Date(
                                                                        devisItem.date_intervention
                                                                    ).toLocaleDateString(
                                                                        "fr-FR"
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                {/* Montant */}
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {formatPrice(
                                                            devisItem.total_ttc
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        TTC
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/devis/${devisItem.id}`}
                                                        className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                                                    >
                                                        <span className="mr-1">
                                                            👁️
                                                        </span>
                                                        Voir
                                                    </Link>

                                                    {devisItem.status ===
                                                        "brouillon" && (
                                                        <Link
                                                            href={`/devis/${devisItem.id}/edit`}
                                                            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                                        >
                                                            <span className="mr-1">
                                                                ✏️
                                                            </span>
                                                            Modifier
                                                        </Link>
                                                    )}

                                                    {devisItem.status ===
                                                        "brouillon" && (
                                                        <Link
                                                            href={`/devis/${devisItem.id}/send`}
                                                            className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                                                        >
                                                            <span className="mr-1">
                                                                📤
                                                            </span>
                                                            Envoyer
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {devis.links && devis.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-100">
                                    <nav className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {devis.links.map((link, index) =>
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
                                            Affichage de {devis.from || 0} à{" "}
                                            {devis.to || 0} sur {devis.total}{" "}
                                            résultats
                                        </div>
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📋</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                {search || statusFilter
                                    ? "Aucun devis trouvé"
                                    : "Aucun devis"}
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                {search || statusFilter
                                    ? "Essayez de modifier vos critères de recherche"
                                    : "Commencez par créer votre premier devis"}
                            </p>
                            {!search && !statusFilter && (
                                <Link
                                    href="/devis/create"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <span className="mr-2">📋</span>
                                    Créer mon premier devis
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
