import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function CreateDevis({
    clients,
    prestations,
    nextNumero,
    selectedClient, // Client présélectionné
}) {
    const [selectedPrestation, setSelectedPrestation] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        client_id: selectedClient?.id || "",
        chantier_name: "",
        chantier_address: selectedClient
            ? `${selectedClient.address || ""}\n${
                  selectedClient.postal_code || ""
              } ${selectedClient.city || ""}`.trim()
            : "",
        date_intervention: "",
        notes: "",
        lignes: [
            {
                description: "",
                description_detail: "",
                quantity: 1,
                unit: "u",
                unit_price: 0,
            },
        ],
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
    };

    const calculateTotal = () => {
        return data.lignes.reduce((total, ligne) => {
            return total + ligne.quantity * ligne.unit_price;
        }, 0);
    };

    const handleClientChange = (clientId) => {
        setData("client_id", clientId);

        if (clientId) {
            const client = clients.find((c) => c.id == clientId);
            if (client) {
                // Pré-remplir l'adresse du chantier avec l'adresse du client
                const adresse = `${client.address || ""}\n${
                    client.postal_code || ""
                } ${client.city || ""}`.trim();
                setData("chantier_address", adresse);
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
                unit: "u",
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

    const addPrestation = (prestation) => {
        const newLigne = {
            description: prestation.name,
            description_detail: prestation.description || "",
            quantity: 1,
            unit: prestation.unit,
            unit_price: prestation.default_price || 0,
        };

        setData("lignes", [...data.lignes, newLigne]);
        setSelectedPrestation(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/devis");
    };

    const getClientIcon = (type) => {
        return type === "particulier" ? "🏠" : "🏢";
    };

    const totalHT = calculateTotal();
    const tva = totalHT * 0.2;
    const totalTTC = totalHT + tva;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Nouveau devis
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Créer un devis pour vos travaux - #{nextNumero}
                        </p>
                    </div>
                    <Link
                        href="/devis"
                        className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                        <span className="mr-2">←</span>
                        Retour à la liste
                    </Link>
                </div>
            }
        >
            <Head title="Nouveau devis - BuildFlow" />

            <form
                onSubmit={handleSubmit}
                className="max-w-6xl mx-auto space-y-8"
            >
                {/* Alerte client présélectionné */}
                {selectedClient && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <span className="text-2xl">ℹ️</span>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Client présélectionné
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">
                                            {getClientIcon(selectedClient.type)}
                                        </span>
                                        <span className="font-medium">
                                            {selectedClient.name}
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                selectedClient.type ===
                                                "particulier"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-purple-100 text-purple-800"
                                            }`}
                                        >
                                            {selectedClient.type ===
                                            "particulier"
                                                ? "Particulier"
                                                : "Professionnel"}
                                        </span>
                                    </div>
                                    <p className="mt-1">
                                        Le client et l'adresse du chantier ont
                                        été pré-remplis. Vous pouvez les
                                        modifier si nécessaire.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Informations générales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Client */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-3 text-xl">👤</span>
                            Informations client
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Client *
                                </label>
                                <select
                                    value={data.client_id}
                                    onChange={(e) =>
                                        handleClientChange(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                                            {getClientIcon(client.type)}{" "}
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

                            {data.client_id && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    {(() => {
                                        const client = clients.find(
                                            (c) => c.id == data.client_id
                                        );
                                        return client ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">
                                                        {getClientIcon(
                                                            client.type
                                                        )}
                                                    </span>
                                                    <span className="font-medium text-blue-900">
                                                        {client.name}
                                                    </span>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            client.type ===
                                                            "particulier"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-purple-100 text-purple-800"
                                                        }`}
                                                    >
                                                        {client.type ===
                                                        "particulier"
                                                            ? "Particulier"
                                                            : "Professionnel"}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-blue-700">
                                                    {client.phone && (
                                                        <div>
                                                            📞 {client.phone}
                                                        </div>
                                                    )}
                                                    {client.email && (
                                                        <div>
                                                            ✉️ {client.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : null;
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chantier */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-3 text-xl">🏗️</span>
                            Informations chantier
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom du chantier *
                                </label>
                                <input
                                    type="text"
                                    value={data.chantier_name}
                                    onChange={(e) =>
                                        setData("chantier_name", e.target.value)
                                    }
                                    placeholder="Rénovation salle de bain, Extension maison..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                                {errors.chantier_name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.chantier_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adresse du chantier
                                    {selectedClient && (
                                        <span className="text-blue-600 text-xs ml-2">
                                            (pré-remplie depuis le client)
                                        </span>
                                    )}
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                />
                                {errors.chantier_address && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.chantier_address}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date d'intervention prévue
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                {errors.date_intervention && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.date_intervention}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prestations prédéfinies */}
                {prestations && prestations.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <span className="mr-3 text-xl">⚡</span>
                            Prestations prédéfinies
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {prestations.map((prestation) => (
                                <button
                                    key={prestation.id}
                                    type="button"
                                    onClick={() => addPrestation(prestation)}
                                    className="p-4 text-left border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                                >
                                    <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                        {prestation.name}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {formatPrice(prestation.default_price)}{" "}
                                        / {prestation.unit}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Cliquer pour ajouter
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lignes de devis */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-xl">📋</span>
                            Détail du devis
                        </h3>
                        <button
                            type="button"
                            onClick={addLigne}
                            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            <span className="mr-2">+</span>
                            Ajouter une ligne
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.lignes.map((ligne, index) => (
                            <div
                                key={index}
                                className="p-4 border border-gray-200 rounded-xl bg-gray-50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                    {/* Description */}
                                    <div className="md:col-span-4">
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
                                            placeholder="Sciage béton, Pose carrelage..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Quantité */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantité *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={ligne.quantity}
                                            onChange={(e) =>
                                                updateLigne(
                                                    index,
                                                    "quantity",
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Unité */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Unité *
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            required
                                        >
                                            <option value="u">Unité</option>
                                            <option value="ml">
                                                Mètre linéaire
                                            </option>
                                            <option value="m2">
                                                Mètre carré
                                            </option>
                                            <option value="m3">
                                                Mètre cube
                                            </option>
                                            <option value="kg">
                                                Kilogramme
                                            </option>
                                            <option value="T">Tonne</option>
                                            <option value="h">Heure</option>
                                            <option value="j">Jour</option>
                                            <option value="forfait">
                                                Forfait
                                            </option>
                                        </select>
                                    </div>

                                    {/* Prix unitaire */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Prix unitaire HT *
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={ligne.unit_price}
                                            onChange={(e) =>
                                                updateLigne(
                                                    index,
                                                    "unit_price",
                                                    parseFloat(
                                                        e.target.value
                                                    ) || 0
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Total */}
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total HT
                                        </label>
                                        <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-900">
                                            {formatPrice(
                                                ligne.quantity *
                                                    ligne.unit_price
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="md:col-span-1 flex items-end">
                                        <button
                                            type="button"
                                            onClick={() => removeLigne(index)}
                                            disabled={data.lignes.length === 1}
                                            className="w-full px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Description détaillée */}
                                <div className="mt-3">
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
                                        placeholder="Détails techniques, spécifications..."
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm resize-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {errors.lignes && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.lignes}
                        </p>
                    )}
                </div>

                {/* Récapitulatif */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-3 text-xl">🧮</span>
                        Récapitulatif
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes et conditions particulières
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Conditions de paiement, modalités d'exécution..."
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            />
                            {errors.notes && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.notes}
                                </p>
                            )}
                        </div>

                        {/* Totaux */}
                        <div className="bg-gray-50 p-6 rounded-xl">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">
                                        Total HT :
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatPrice(totalHT)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">
                                        TVA 20% :
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatPrice(tva)}
                                    </span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            Total TTC :
                                        </span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {formatPrice(totalTTC)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <Link
                        href="/devis"
                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                        <span className="mr-2">←</span>
                        Annuler
                    </Link>

                    <button
                        type="submit"
                        disabled={processing || data.lignes.length === 0}
                        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                    >
                        {processing ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Création...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">💾</span>
                                Créer le devis #{nextNumero}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
