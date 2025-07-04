import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function DevisIndex({ devis, filters, stats }) {
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
                className={`px-2 py-1 text-xs font-bold text-white rounded-full ${styles[status]}`}
            >
                {labels[status]}
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
        return new Date(date).toLocaleDateString("fr-FR");
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Gestion des devis
                    </h1>
                    <Link
                        href="/devis/create"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <span>➕</span>
                        Nouveau devis
                    </Link>
                </div>
            }
        >
            <Head title="Devis" />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-800">
                        {stats.total}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-800">
                        {stats.brouillon}
                    </div>
                    <div className="text-sm text-gray-600">Brouillons</div>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-800">
                        {stats.envoye}
                    </div>
                    <div className="text-sm text-blue-600">Envoyés</div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-800">
                        {stats.signe}
                    </div>
                    <div className="text-sm text-green-600">Signés</div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-800">
                        {formatPrice(stats.total_ca)}
                    </div>
                    <div className="text-sm text-green-600">CA signé</div>
                </div>
            </div>

            {/* Filtres */}
            <form
                onSubmit={handleSearch}
                className="bg-gray-50 p-4 rounded-lg mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            name="search"
                            placeholder="Rechercher (numéro, client, chantier...)"
                            defaultValue={filters.search}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <select
                            name="status"
                            defaultValue={filters.status}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="brouillon">Brouillon</option>
                            <option value="envoye">Envoyé</option>
                            <option value="signe">Signé</option>
                            <option value="refuse">Refusé</option>
                            <option value="expire">Expiré</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Rechercher
                        </button>
                        <Link
                            href="/devis"
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Reset
                        </Link>
                    </div>
                </div>
            </form>

            {/* Table des devis */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                                Total TTC
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {devis.data.length > 0 ? (
                            devis.data.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            #{item.numero}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {item.client.name}
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
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatPrice(item.total_ttc)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(item.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(item.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
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
                                                        className="text-green-600 hover:text-green-900"
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

            {/* Pagination */}
            {devis.links && devis.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <div className="flex space-x-1">
                        {devis.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`px-3 py-2 text-sm ${
                                    link.active
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                } border border-gray-300 ${
                                    index === 0 ? "rounded-l-lg" : ""
                                } ${
                                    index === devis.links.length - 1
                                        ? "rounded-r-lg"
                                        : ""
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
