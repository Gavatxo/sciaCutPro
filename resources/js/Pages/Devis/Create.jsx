import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function CreateDevis({ clients, prestations, nextNumero }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: "",
        chantier_name: "",
        chantier_address: "",
        date_intervention: "",
        notes: "",
        lignes: [
            {
                description: "",
                description_detail: "",
                quantity: 1,
                unit: "ml",
                unit_price: 0,
            },
        ],
    });

    // Auto-complétion des informations client
    const handleClientChange = (clientId) => {
        setData("client_id", clientId);

        if (clientId) {
            const selectedClient = clients.find((c) => c.id == clientId);
            if (selectedClient && selectedClient.contact_person) {
                // On peut pré-remplir des infos si besoin
                console.log("Client sélectionné:", selectedClient);
            }
        }
    };

    const addLigne = () => {
        setData("lignes", [
            ...data.lignes,
            {
                description: "",
                description_detail: "",
                quantity: 1,
                unit: "ml",
                unit_price: 0,
            },
        ]);
    };

    const removeLigne = (index) => {
        if (data.lignes.length > 1) {
            const newLignes = data.lignes.filter((_, i) => i !== index);
            setData("lignes", newLignes);
        }
    };

    const updateLigne = (index, field, value) => {
        const newLignes = [...data.lignes];
        newLignes[index][field] = value;
        setData("lignes", newLignes);
    };

    const selectPrestation = (index, prestationId) => {
        if (prestationId) {
            const prestation = prestations.find((p) => p.id == prestationId);
            if (prestation) {
                updateLigne(index, "description", prestation.name);
                updateLigne(index, "unit", prestation.unit);
                updateLigne(index, "unit_price", prestation.default_price || 0);
                if (prestation.description) {
                    updateLigne(
                        index,
                        "description_detail",
                        prestation.description
                    );
                }
            }
        }
    };

    const calculateTotal = () => {
        return data.lignes.reduce((total, ligne) => {
            return (
                total +
                parseFloat(ligne.quantity || 0) *
                    parseFloat(ligne.unit_price || 0)
            );
        }, 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/devis");
    };

    const totalHT = calculateTotal();
    const tva = totalHT * 0.2;
    const totalTTC = totalHT + tva;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Nouveau devis
                    </h1>
                    <Link
                        href="/devis"
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <span>←</span>
                        Retour
                    </Link>
                </div>
            }
        >
            <Head title="Nouveau devis" />

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations générales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>👤</span>
                            Informations client
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Client *
                                </label>
                                <select
                                    value={data.client_id}
                                    onChange={(e) =>
                                        handleClientChange(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                >
                                    <option value="">
                                        Sélectionner un client
                                    </option>
                                    {clients.map((client) => (
                                        <option
                                            key={client.id}
                                            value={client.id}
                                        >
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.client_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.client_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">
                                    <Link
                                        href="/clients/create"
                                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        + Ajouter un nouveau client
                                    </Link>
                                </p>
                            </div>

                            {/* Informations du client sélectionné */}
                            {data.client_id && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                    {(() => {
                                        const selectedClient = clients.find(
                                            (c) => c.id == data.client_id
                                        );
                                        return selectedClient ? (
                                            <div className="text-sm space-y-1">
                                                <p>
                                                    <strong>Contact:</strong>{" "}
                                                    {selectedClient.contact_person ||
                                                        "Non renseigné"}
                                                </p>
                                                <p>
                                                    <strong>Téléphone:</strong>{" "}
                                                    {selectedClient.phone ||
                                                        "Non renseigné"}
                                                </p>
                                                <p>
                                                    <strong>Email:</strong>{" "}
                                                    {selectedClient.email ||
                                                        "Non renseigné"}
                                                </p>
                                            </div>
                                        ) : null;
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span>🏗️</span>
                            Informations chantier
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Numéro de devis
                                </label>
                                <input
                                    type="text"
                                    value={nextNumero}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom du chantier *
                                </label>
                                <input
                                    type="text"
                                    value={data.chantier_name}
                                    onChange={(e) =>
                                        setData("chantier_name", e.target.value)
                                    }
                                    placeholder="ex: Rénovation centre commercial"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                {errors.chantier_name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.chantier_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Adresse du chantier
                                </label>
                                <textarea
                                    value={data.chantier_address}
                                    onChange={(e) =>
                                        setData(
                                            "chantier_address",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Adresse complète du chantier"
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date d'intervention souhaitée
                                </label>
                                <input
                                    type="date"
                                    value={data.date_intervention}
                                    onChange={(e) =>
                                        setData(
                                            "date_intervention",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prestations */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <span>🔧</span>
                            Prestations
                        </h3>
                        <button
                            type="button"
                            onClick={addLigne}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                            + Ajouter une ligne
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.lignes.map((ligne, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 rounded-lg border"
                            >
                                {/* Sélection de prestation prédéfinie */}
                                {prestations.length > 0 && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Prestation prédéfinie (optionnel)
                                        </label>
                                        <select
                                            onChange={(e) =>
                                                selectPrestation(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">
                                                Choisir une prestation...
                                            </option>
                                            {prestations.map((prestation) => (
                                                <option
                                                    key={prestation.id}
                                                    value={prestation.id}
                                                >
                                                    {prestation.name} -{" "}
                                                    {formatPrice(
                                                        prestation.default_price
                                                    )}{" "}
                                                    / {prestation.unit}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-3">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description *
                                        </label>
                                        <input
                                            type="text"
                                            value={ligne.description}
                                            onChange={(e) =>
                                                updateLigne(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Prestation"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {errors[
                                            `lignes.${index}.description`
                                        ] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {
                                                    errors[
                                                        `lignes.${index}.description`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantité *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={ligne.quantity}
                                            onChange={(e) =>
                                                updateLigne(
                                                    index,
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Unité
                                        </label>
                                        <select
                                            value={ligne.unit}
                                            onChange={(e) =>
                                                updateLigne(
                                                    index,
                                                    "unit",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="ml">ml</option>
                                            <option value="m2">m²</option>
                                            <option value="m3">m³</option>
                                            <option value="trou">trou</option>
                                            <option value="forfait">
                                                forfait
                                            </option>
                                            <option value="h">heure</option>
                                            <option value="j">jour</option>
                                            <option value="T">tonne</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Prix unitaire *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={ligne.unit_price}
                                            onChange={(e) =>
                                                updateLigne(
                                                    index,
                                                    "unit_price",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Total
                                            </label>
                                            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-right font-medium">
                                                {formatPrice(
                                                    ligne.quantity *
                                                        ligne.unit_price
                                                )}
                                            </div>
                                        </div>
                                        {data.lignes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeLigne(index)
                                                }
                                                className="ml-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description détaillée (optionnel)
                                    </label>
                                    <textarea
                                        value={ligne.description_detail}
                                        onChange={(e) =>
                                            updateLigne(
                                                index,
                                                "description_detail",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Détails techniques, contraintes, etc."
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Totaux */}
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>💰</span>
                        Récapitulatif
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
                        <div>
                            <div className="text-sm text-gray-600">
                                Sous-total HT
                            </div>
                            <div className="text-xl font-bold text-gray-800">
                                {formatPrice(totalHT)}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">
                                TVA (20%)
                            </div>
                            <div className="text-xl font-bold text-gray-800">
                                {formatPrice(tva)}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-600">
                                Total TTC
                            </div>
                            <div className="text-2xl font-bold text-green-800">
                                {formatPrice(totalTTC)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>📝</span>
                        Notes et conditions
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes particulières
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            placeholder="Conditions d'accès, contraintes spéciales, etc."
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-6 border-t-2 border-gray-100">
                    <div className="flex gap-4">
                        <Link
                            href="/devis"
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Annuler
                        </Link>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Création...
                                </>
                            ) : (
                                <>
                                    <span>💾</span>
                                    Créer le devis
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
