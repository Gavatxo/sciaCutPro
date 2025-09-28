import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function ClientDevis({ client, devis, filters, stats }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("fr-FR");
    };

    const getStatusBadge = (status) => {
        const styles = {
            brouillon: "bg-gray-100 text-gray-800",
            envoye: "bg-blue-100 text-blue-800",
            signe: "bg-green-100 text-green-800",
            refuse: "bg-red-100 text-red-800",
            expire: "bg-orange-100 text-orange-800",
        };

        const labels = {
            brouillon: "Brouillon",
            envoye: "Envoyé",
            signe: "Signé",
            refuse: "Refusé",
            expire: "Expiré",
        };

        return (
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
            >
                {labels[status]}
            </span>
        );
    };

    const getClientIcon = (type) => {
        return type === "particulier" ? "🏠" : "🏢";
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const search = formData.get("search");
        const status = formData.get("status");

        router.get(
            `/clients/${client.id}/devis`,
            { search, status },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">
                                {getClientIcon(client.type)}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Devis de {client.name}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Gérez tous les devis de ce client
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/devis/create?client_id=${client.id}`}
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <span className="mr-2">📋</span>
                            Nouveau devis
                        </Link>
                        <Link
                            href={`/clients/${client.id}`}
                            className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                        >
                            <span className="mr-2">👤</span>
                            Fiche client
                        </Link>
                        <Link
                            href="/clients"
                            className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                        >
                            <span className="mr-2">←</span>
                            Retour
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Devis de ${client.name} - BuildFlow`} />

            <div className="space-y-8">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">📋</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.total}
                                </p>
                                <p className="text-sm text-gray-600">Total</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">✏️</span>
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
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">💰</span>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900">
                                    {formatPrice(stats.total_ca)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    CA généré
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres et recherche */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row gap-4"
                    >
                        <div className="flex-1">
                            <input
                                type="text"
                                name="search"
                                placeholder="Rechercher par numéro ou nom de chantier..."
                                defaultValue={filters.search || ""}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <select
                                name="status"
                                defaultValue={filters.status || ""}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="brouillon">Brouillon</option>
                                <option value="envoye">Envoyé</option>
                                <option value="signe">Signé</option>
                                <option value="refuse">Refusé</option>
                                <option value="expire">Expiré</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                            Rechercher
                        </button>
                    </form>
                </div>

                {/* Liste des devis */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                        Numéro
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                        Chantier
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                                        Statut
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                                        Montant TTC
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {devis.data.length > 0 ? (
                                    devis.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">
                                                    #{item.numero}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {item.chantier_name}
                                                    </div>
                                                    {item.chantier_address && (
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                            {
                                                                item.chantier_address
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(item.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">
                                                {formatPrice(item.total_ttc)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={`/devis/${item.id}`}
                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        Voir
                                                    </Link>
                                                    {item.status ===
                                                        "brouillon" && (
                                                        <Link
                                                            href={`/devis/${item.id}/edit`}
                                                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                                                        >
                                                            Modifier
                                                        </Link>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-12 text-center"
                                        >
                                            <div className="text-gray-500">
                                                <span className="text-4xl mb-4 block">
                                                    📋
                                                </span>
                                                <p className="text-lg font-medium">
                                                    Aucun devis trouvé
                                                </p>
                                                <p className="text-sm mt-2">
                                                    Créez le premier devis pour
                                                    ce client !
                                                </p>
                                                <Link
                                                    href={`/devis/create?client_id=${client.id}`}
                                                    className="inline-block mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                                                >
                                                    Créer un devis
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {devis.links && devis.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-100">
                            <div className="flex justify-center">
                                <div className="flex space-x-1">
                                    {devis.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
