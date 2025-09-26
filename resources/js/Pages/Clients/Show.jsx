// resources/js/Pages/Clients/Show.jsx - Affichage détaillé client

import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function ShowClient({ client, stats }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
    };

    const getClientIcon = () => {
        return client.type === "particulier" ? "🏠" : "🏢";
    };

    const getClientBadge = () => {
        if (client.type === "particulier") {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    🏠 Particulier
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
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
                {days} jours
            </span>
        );
    };

    const handleDelete = () => {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer le client ${client.name} ?`
            )
        ) {
            router.delete(`/clients/${client.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">{getClientIcon()}</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {client.name}
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                {getClientBadge()}
                                {client.payment_terms &&
                                    getPaymentTermsBadge(client.payment_terms)}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/clients/${client.id}/edit`}
                            className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        >
                            <span className="mr-2">✏️</span>
                            Modifier
                        </Link>
                        <Link
                            href={`/devis/create?client_id=${client.id}`}
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <span className="mr-2">📋</span>
                            Nouveau devis
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
            <Head title={`${client.name} - BuildFlow`} />

            <div className="space-y-8">
                {/* Statistiques du client */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">📋</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.total_devis || 0}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Devis total
                                </p>
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
                                    {formatPrice(stats?.total_signe || 0)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    CA généré
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">⏳</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats?.devis_attente || 0}
                                </p>
                                <p className="text-sm text-gray-600">
                                    En attente
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                                <span className="text-xl text-white">📈</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatPrice(stats?.ca_annuel || 0)}
                                </p>
                                <p className="text-sm text-gray-600">CA 2025</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations détaillées */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coordonnées */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="mr-3 text-xl">📞</span>
                                Coordonnées
                            </h2>

                            <div className="space-y-4">
                                {client.type === "particulier" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Prénom
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {client.first_name ||
                                                    "Non renseigné"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Nom
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {client.last_name ||
                                                    "Non renseigné"}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Raison sociale
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {client.company_name ||
                                                "Non renseignée"}
                                        </p>
                                    </div>
                                )}

                                {client.type === "professionnel" &&
                                    client.contact_person && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Personne de contact
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {client.contact_person}
                                            </p>
                                        </div>
                                    )}

                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Adresse
                                    </label>
                                    <div className="text-gray-900">
                                        <p>{client.address}</p>
                                        <p>
                                            {client.postal_code} {client.city}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Téléphone
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {client.phone ? (
                                                <a
                                                    href={`tel:${client.phone}`}
                                                    className="hover:text-blue-600 transition-colors"
                                                >
                                                    {client.phone}
                                                </a>
                                            ) : (
                                                "Non renseigné"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Email
                                        </label>
                                        <p className="text-gray-900 font-medium">
                                            {client.email ? (
                                                <a
                                                    href={`mailto:${client.email}`}
                                                    className="hover:text-blue-600 transition-colors"
                                                >
                                                    {client.email}
                                                </a>
                                            ) : (
                                                "Non renseigné"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informations commerciales */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="mr-3 text-xl">💼</span>
                                Informations commerciales
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Délai de paiement
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {client.payment_terms} jours
                                    </p>
                                </div>

                                {client.type === "professionnel" && (
                                    <>
                                        {client.siret && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    SIRET
                                                </label>
                                                <p className="text-gray-900 font-medium">
                                                    {client.siret}
                                                </p>
                                            </div>
                                        )}
                                        {client.tva_number && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">
                                                    N° TVA intracommunautaire
                                                </label>
                                                <p className="text-gray-900 font-medium">
                                                    {client.tva_number}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {client.notes && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Notes internes
                                        </label>
                                        <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg mt-1">
                                            {client.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions supplémentaires */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Actions
                            </h2>
                            <div className="space-y-3">
                                <Link
                                    href={`/devis/create?client_id=${client.id}`}
                                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                                >
                                    <span className="mr-2">📋</span>
                                    Créer un devis
                                </Link>

                                <Link
                                    href={`/clients/${client.id}/edit`}
                                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    <span className="mr-2">✏️</span>
                                    Modifier le client
                                </Link>

                                <button
                                    onClick={handleDelete}
                                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    <span className="mr-2">🗑️</span>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Devis récents */}
                {client.devis && client.devis.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <span className="mr-3 text-xl">📋</span>
                                Devis récents
                            </h2>
                            <Link
                                href="/devis"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                            >
                                Voir tous les devis →
                            </Link>
                        </div>

                        <div className="overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                            Numéro
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                            Statut
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                                            Montant
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {client.devis.map((devis) => (
                                        <tr
                                            key={devis.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                #{devis.numero}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(
                                                    devis.created_at
                                                ).toLocaleDateString("fr-FR")}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        devis.status === "signe"
                                                            ? "bg-green-100 text-green-800"
                                                            : devis.status ===
                                                              "envoye"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : devis.status ===
                                                              "refuse"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {devis.status === "signe"
                                                        ? "Signé"
                                                        : devis.status ===
                                                          "envoye"
                                                        ? "Envoyé"
                                                        : devis.status ===
                                                          "refuse"
                                                        ? "Refusé"
                                                        : "Brouillon"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                                {formatPrice(devis.total_ttc)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link
                                                    href={`/devis/${devis.id}`}
                                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    Voir
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
