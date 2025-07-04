import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function DevisIndex({ devis, filters = {}, stats = {} }) {
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const search = formData.get("search");
        const status = formData.get("status");

        router.get(
            "/devis",
            { search, status },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (devisItem) => {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer le devis #${devisItem.numero} ?`
            )
        ) {
            router.delete(`/devis/${devisItem.id}`);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            brouillon: "bg-gray-500",
            envoye: "bg-blue-500",
            signe: "bg-green-500",
            refuse: "bg-red-500",
            expire: "bg-orange-500",
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
                className={`px-2 py-1 text-xs font-bold text-white rounded-full ${
                    styles[status] || "bg-gray-500"
                }`}
            >
                {labels[status] || status}
            </span>
        );
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("fr-FR");
    };

    // Protection contre les données manquantes
    const devisData = devis?.data || [];
    const hasDevis = devisData.length > 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Gestion des devis
                    </h1>
                    <Link
                        href="/devis/create"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                        ➕ Nouveau devis
                    </Link>
                </div>
            }
        >
            <Head title="Devis" />

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <span className="text-2xl">📋</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Total devis
                            </h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {stats.total || devisData.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <span className="text-2xl">⏳</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-700">
                                En attente
                            </h3>
                            <p className="text-2xl font-bold text-yellow-600">
                                {stats.en_attente ||
                                    devisData.filter(
                                        (d) => d.status === "envoye"
                                    ).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Signés
                            </h3>
                            <p className="text-2xl font-bold text-green-600">
                                {stats.signes ||
                                    devisData.filter(
                                        (d) => d.status === "signe"
                                    ).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-700">
                                Montant total
                            </h3>
                            <p className="text-2xl font-bold text-purple-600">
                                {formatPrice(
                                    stats.montant_total ||
                                        devisData.reduce(
                                            (sum, d) =>
                                                sum + (d.total_ttc || 0),
                                            0
                                        )
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-wrap gap-4 items-end"
                >
                    <div className="flex-1 min-w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rechercher
                        </label>
                        <input
                            type="text"
                            name="search"
                            defaultValue={filters.search || ""}
                            placeholder="Numéro, client, chantier..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="min-w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut
                        </label>
                        <select
                            name="status"
                            defaultValue={filters.status || ""}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        🔍 Filtrer
                    </button>
                </form>
            </div>

            {/* Tableau des devis */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Numéro
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chantier
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {hasDevis ? (
                            devisData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            #{item.numero}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.client?.name ||
                                                "Client inconnu"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {item.chantier_name}
                                        </div>
                                        {item.date_intervention && (
                                            <div className="text-xs text-gray-500">
                                                Prévu le{" "}
                                                {formatDate(
                                                    item.date_intervention
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(item.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(item.total_ttc)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-3">
                                            <Link
                                                href={`/devis/${item.id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Voir
                                            </Link>
                                            {item.status === "brouillon" && (
                                                <>
                                                    <Link
                                                        href={`/devis/${item.id}/edit`}
                                                        className="text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(item)
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
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
                                            Créez votre premier devis pour
                                            commencer !
                                        </p>
                                        <Link
                                            href="/devis/create"
                                            className="inline-block mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
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

            {/* Pagination - seulement si des liens de pagination existent */}
            {devis?.links && devis.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <div className="flex space-x-1">
                        {devis.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`px-3 py-2 text-sm ${
                                    link.active
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-50"
                                } border border-gray-300 rounded-md`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
