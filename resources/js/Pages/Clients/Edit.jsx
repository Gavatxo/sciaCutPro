// resources/js/Pages/Clients/Edit.jsx - Modification client

import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function EditClient({ client }) {
    const [clientType, setClientType] = useState(
        client.type || "professionnel"
    );

    const { data, setData, put, processing, errors } = useForm({
        type: client.type || "professionnel",
        first_name: client.first_name || "",
        last_name: client.last_name || "",
        company_name: client.company_name || "",
        address: client.address || "",
        postal_code: client.postal_code || "",
        city: client.city || "",
        phone: client.phone || "",
        email: client.email || "",
        contact_person: client.contact_person || "",
        siret: client.siret || "",
        tva_number: client.tva_number || "",
        payment_terms: client.payment_terms || 30,
        notes: client.notes || "",
    });

    const handleClientTypeChange = (type) => {
        setClientType(type);
        setData((prev) => ({
            ...prev,
            type: type,
            // Reset des champs spécifiques selon le type
            ...(type === "particulier"
                ? {
                      company_name: "",
                      contact_person: "",
                      siret: "",
                      tva_number: "",
                      payment_terms: 15,
                  }
                : {
                      first_name: "",
                      last_name: "",
                      payment_terms: 30,
                  }),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/clients/${client.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Modifier le client
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Mettre à jour les informations de {client.name}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/clients/${client.id}`}
                            className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        >
                            <span className="mr-2">👁️</span>
                            Voir le client
                        </Link>
                        <Link
                            href="/clients"
                            className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                        >
                            <span className="mr-2">←</span>
                            Retour à la liste
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Modifier ${client.name} - BuildFlow`} />

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                {/* Sélecteur du type de client */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-3 text-xl">🎯</span>
                        Type de client
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                handleClientTypeChange("particulier")
                            }
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                                clientType === "particulier"
                                    ? "border-blue-500 bg-blue-50 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center mb-3">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                        clientType === "particulier"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    <span className="text-xl">🏠</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        Particulier
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Propriétaire, locataire
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleClientTypeChange("professionnel")
                            }
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                                clientType === "professionnel"
                                    ? "border-blue-500 bg-blue-50 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center mb-3">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                                        clientType === "professionnel"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    <span className="text-xl">🏢</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        Professionnel
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Entreprise, collectivité
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Informations client */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="mr-3 text-xl">
                            {clientType === "particulier" ? "👤" : "🏢"}
                        </span>
                        Informations{" "}
                        {clientType === "particulier"
                            ? "du particulier"
                            : "de l'entreprise"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {clientType === "particulier" ? (
                            // Champs pour particuliers
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prénom *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                "first_name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Jean"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    />
                                    {errors.first_name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                        placeholder="Dupont"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    />
                                    {errors.last_name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Champs pour professionnels
                            <>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Raison sociale *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.company_name}
                                        onChange={(e) =>
                                            setData(
                                                "company_name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Mairie de Paris, Bouygues Construction..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    />
                                    {errors.company_name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.company_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Personne de contact
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_person}
                                        onChange={(e) =>
                                            setData(
                                                "contact_person",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Jean Dupont"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                    {errors.contact_person && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.contact_person}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SIRET
                                    </label>
                                    <input
                                        type="text"
                                        value={data.siret}
                                        onChange={(e) =>
                                            setData("siret", e.target.value)
                                        }
                                        placeholder="123 456 789 00012"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                    {errors.siret && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.siret}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Numéro de TVA intracommunautaire
                                    </label>
                                    <input
                                        type="text"
                                        value={data.tva_number}
                                        onChange={(e) =>
                                            setData(
                                                "tva_number",
                                                e.target.value
                                            )
                                        }
                                        placeholder="FR 12 345678901"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                    {errors.tva_number && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.tva_number}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Coordonnées */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="mr-3 text-xl">📍</span>
                        Coordonnées
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Adresse *
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                placeholder="123 rue de la République"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Code postal *
                            </label>
                            <input
                                type="text"
                                value={data.postal_code}
                                onChange={(e) =>
                                    setData("postal_code", e.target.value)
                                }
                                placeholder="75001"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                            {errors.postal_code && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.postal_code}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ville *
                            </label>
                            <input
                                type="text"
                                value={data.city}
                                onChange={(e) =>
                                    setData("city", e.target.value)
                                }
                                placeholder="Paris"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.city}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Téléphone *
                            </label>
                            <input
                                type="tel"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                placeholder="01 23 45 67 89"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="contact@exemple.fr"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Paramètres commerciaux */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="mr-3 text-xl">💼</span>
                        Paramètres commerciaux
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Délai de paiement (jours)
                            </label>
                            <select
                                value={data.payment_terms}
                                onChange={(e) =>
                                    setData(
                                        "payment_terms",
                                        parseInt(e.target.value)
                                    )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                <option value={15}>
                                    15 jours (particuliers)
                                </option>
                                <option value={30}>
                                    30 jours (professionnels)
                                </option>
                                <option value={45}>45 jours</option>
                                <option value={60}>60 jours</option>
                            </select>
                            {errors.payment_terms && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.payment_terms}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes internes
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Informations complémentaires, préférences du client..."
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            />
                            {errors.notes && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.notes}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                    <Link
                        href={`/clients/${client.id}`}
                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                        <span className="mr-2">←</span>
                        Annuler
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                    >
                        {processing ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">💾</span>
                                Sauvegarder les modifications
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
