// resources/js/Pages/Devis/Show.jsx - Affichage détaillé du devis avec gestion des statuts

import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import DevisActions from "@/Components/Devis/DevisActions";

export default function ShowDevis({ devis }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
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
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}
            >
                <span className="mr-1">{badge.icon}</span>
                {badge.text}
            </span>
        );
    };

    const getClientIcon = () => {
        return devis.client?.type === "particulier" ? "🏠" : "🏢";
    };

    const handleDelete = () => {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer le devis #${devis.numero} ?`
            )
        ) {
            router.delete(`/devis/${devis.id}`);
        }
    };

    const handleStatusChange = (newStatus) => {
        let confirmMessage = "";
        let signedBy = "";

        switch (newStatus) {
            case "signe":
                signedBy = prompt("Nom du signataire :");
                if (!signedBy) return;
                confirmMessage = `Marquer le devis comme signé par "${signedBy}" ?`;
                break;
            case "refuse":
                confirmMessage = "Marquer le devis comme refusé ?";
                break;
            case "expire":
                confirmMessage = "Marquer le devis comme expiré ?";
                break;
            case "brouillon":
                confirmMessage = "Remettre le devis en brouillon ?";
                break;
        }

        if (confirm(confirmMessage)) {
            router.patch(`/devis/${devis.id}/status`, {
                status: newStatus,
                signed_by: signedBy,
            });
        }
    };

    const canEdit = ["brouillon", "envoye"].includes(devis.status);
    const canDelete = devis.status === "brouillon";

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">📋</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Devis #{devis.numero}
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                {getStatusBadge(devis.status)}
                                <span className="text-sm text-gray-600">
                                    {devis.chantier_name}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {canEdit && (
                            <Link
                                href={`/devis/${devis.id}/edit`}
                                className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                            >
                                <span className="mr-2">✏️</span>
                                Modifier
                            </Link>
                        )}
                        {devis.status === "brouillon" && (
                            <Link
                                href={`/devis/${devis.id}/send`}
                                method="post"
                                as="button"
                                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <span className="mr-2">📤</span>
                                Envoyer le devis
                            </Link>
                        )}
                        <Link
                            href="/devis"
                            className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                        >
                            <span className="mr-2">←</span>
                            Retour
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Devis #${devis.numero} - BuildFlow`} />

            <div className="space-y-8">
                {/* Informations générales */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Client */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-3 text-xl">
                                {getClientIcon()}
                            </span>
                            Client
                        </h2>

                        {devis.client ? (
                            <div className="space-y-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold text-gray-900">
                                            {devis.client.name}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                devis.client.type ===
                                                "particulier"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-purple-100 text-purple-700"
                                            }`}
                                        >
                                            {devis.client.type === "particulier"
                                                ? "Particulier"
                                                : "Professionnel"}
                                        </span>
                                    </div>
                                    {devis.client.type === "professionnel" &&
                                        devis.client.contact_person && (
                                            <p className="text-sm text-gray-600">
                                                Contact :{" "}
                                                {devis.client.contact_person}
                                            </p>
                                        )}
                                </div>

                                {devis.client.phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="mr-2">📞</span>
                                        <a
                                            href={`tel:${devis.client.phone}`}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {devis.client.phone}
                                        </a>
                                    </div>
                                )}

                                {devis.client.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="mr-2">✉️</span>
                                        <a
                                            href={`mailto:${devis.client.email}`}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {devis.client.email}
                                        </a>
                                    </div>
                                )}

                                <Link
                                    href={`/clients/${devis.client.id}`}
                                    className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors mt-3"
                                >
                                    <span className="mr-1">👁️</span>
                                    Voir le client
                                </Link>
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                Aucun client associé
                            </p>
                        )}
                    </div>

                    {/* Informations chantier */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-3 text-xl">🏗️</span>
                            Chantier
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Nom du chantier
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {devis.chantier_name}
                                </p>
                            </div>

                            {devis.chantier_address && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Adresse
                                    </label>
                                    <p className="text-gray-900 whitespace-pre-line">
                                        {devis.chantier_address}
                                    </p>
                                </div>
                            )}

                            {devis.date_intervention && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Date d'intervention
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(
                                            devis.date_intervention
                                        ).toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informations devis */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-3 text-xl">📊</span>
                            Informations
                        </h2>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Date de création
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {new Date(
                                        devis.created_at
                                    ).toLocaleDateString("fr-FR")}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Validité
                                </label>
                                <p className="text-gray-900 font-medium">
                                    {devis.validity_days} jours
                                </p>
                            </div>

                            {devis.date_envoi && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Date d'envoi
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(
                                            devis.date_envoi
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                            )}

                            {devis.date_signature && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Date de signature
                                    </label>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(
                                            devis.date_signature
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                    {devis.signed_by && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Signé par : {devis.signed_by}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gestion des statuts */}
                {devis.status !== "signe" && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">⚡</span>
                            Actions sur le devis
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Envoyer le devis */}
                            {devis.status === "brouillon" && (
                                <Link
                                    href={`/devis/${devis.id}/send`}
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <span className="mr-2">📤</span>
                                    Envoyer
                                </Link>
                            )}

                            {/* Marquer comme signé */}
                            {devis.status === "envoye" && (
                                <button
                                    onClick={() => handleStatusChange("signe")}
                                    className="inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <span className="mr-2">✅</span>
                                    Marquer signé
                                </button>
                            )}

                            {/* Marquer comme refusé */}
                            {devis.status === "envoye" && (
                                <button
                                    onClick={() => handleStatusChange("refuse")}
                                    className="inline-flex items-center justify-center px-4 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <span className="mr-2">❌</span>
                                    Marquer refusé
                                </button>
                            )}

                            {/* Marquer comme expiré */}
                            {devis.status === "envoye" && (
                                <button
                                    onClick={() => handleStatusChange("expire")}
                                    className="inline-flex items-center justify-center px-4 py-3 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                    <span className="mr-2">⏰</span>
                                    Marquer expiré
                                </button>
                            )}

                            {/* Remettre en brouillon */}
                            {["refuse", "expire"].includes(devis.status) && (
                                <button
                                    onClick={() =>
                                        handleStatusChange("brouillon")
                                    }
                                    className="inline-flex items-center justify-center px-4 py-3 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <span className="mr-2">📝</span>
                                    Remettre en brouillon
                                </button>
                            )}
                        </div>

                        {/* Informations sur les transitions */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">
                                    Transitions disponibles :
                                </span>
                                {devis.status === "brouillon" &&
                                    " Vous pouvez envoyer ce devis au client"}
                                {devis.status === "envoye" &&
                                    " Le client peut signer, refuser, ou le devis peut expirer"}
                                {devis.status === "refuse" &&
                                    " Vous pouvez remettre ce devis en brouillon pour le modifier"}
                                {devis.status === "expire" &&
                                    " Vous pouvez remettre ce devis en brouillon pour le relancer"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Prestations */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-xl">🔧</span>
                            Prestations
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantité
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unité
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Prix unitaire
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {devis.lignes &&
                                    devis.lignes.map((ligne, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {ligne.description}
                                                    </div>
                                                    {ligne.description_detail && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {
                                                                ligne.description_detail
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-900">
                                                {ligne.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-900">
                                                {ligne.unit}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">
                                                {formatPrice(ligne.unit_price)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                {formatPrice(ligne.total)}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totaux */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-end">
                            <div className="w-80 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Total HT :
                                    </span>
                                    <span className="font-medium">
                                        {formatPrice(devis.total_ht)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        TVA ({devis.tva_rate}%) :
                                    </span>
                                    <span className="font-medium">
                                        {formatPrice(
                                            devis.total_ttc - devis.total_ht
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                                    <span>Total TTC :</span>
                                    <span className="text-blue-600">
                                        {formatPrice(devis.total_ttc)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {devis.notes && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-3 text-xl">📝</span>
                            Notes
                        </h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-line">
                                {devis.notes}
                            </p>
                        </div>
                    </div>
                )}

                {/* Actions rapides */}
                {canDelete && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">
                            Zone de danger
                        </h3>
                        <p className="text-red-700 mb-4">
                            Cette action est irréversible. Le devis sera
                            définitivement supprimé.
                        </p>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <span className="mr-2">🗑️</span>
                            Supprimer le devis
                        </button>
                    </div>
                )}
                <div className="lg:col-span-1">
                    <DevisActions devis={devis} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
