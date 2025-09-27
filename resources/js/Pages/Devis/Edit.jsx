// resources/js/Pages/Devis/Edit.jsx - Modification d'un devis

import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function EditDevis({ devis, clients, prestations }) {
    const { data, setData, put, processing, errors } = useForm({
        client_id: devis.client_id || "",
        chantier_name: devis.chantier_name || "",
        chantier_address: devis.chantier_address || "",
        date_intervention: devis.date_intervention || "",
        notes: devis.notes || "",
        lignes: devis.lignes || [],
    });

    const [prestationSuggestions, setPrestationSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(null);

    useEffect(() => {
        if (data.lignes.length === 0) {
            addLigne();
        }
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
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
        const newLignes = data.lignes.filter((_, i) => i !== index);
        setData("lignes", newLignes);
    };

    const updateLigne = (index, field, value) => {
        const newLignes = [...data.lignes];
        newLignes[index] = { ...newLignes[index], [field]: value };
        setData("lignes", newLignes);
    };

    const searchPrestations = (query) => {
        if (!query || query.length < 2) {
            setPrestationSuggestions([]);
            return;
        }

        const filtered = prestations.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase())
        );
        setPrestationSuggestions(filtered);
    };

    const selectPrestation = (index, prestation) => {
        updateLigne(index, "description", prestation.name);
        updateLigne(index, "unit", prestation.unit);
        updateLigne(index, "unit_price", prestation.default_price);
        setPrestationSuggestions([]);
        setShowSuggestions(null);
    };

    const calculateTotal = () => {
        return data.lignes.reduce((total, ligne) => {
            return total + ligne.quantity * ligne.unit_price;
        }, 0);
    };

    const calculateTva = () => {
        return calculateTotal() * 0.2;
    };

    const calculateTotalTtc = () => {
        return calculateTotal() + calculateTva();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/devis/${devis.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                            <span className="text-2xl">✏️</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Modifier le devis #{devis.numero}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {devis.chantier_name}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/devis`}
                            className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                        >
                            <span className="mr-2">←</span>
                            Annuler
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Modifier devis #${devis.numero} - BuildFlow`} />

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations générales */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="mr-3 text-xl">📋</span>
                        Informations générales
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client *
                            </label>
                            <select
                                value={data.client_id}
                                onChange={(e) =>
                                    setData("client_id", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Sélectionner un client</option>
                                {clients.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                        {client.type === "professionnel" &&
                                            client.contact_person &&
                                            ` (${client.contact_person})`}
                                    </option>
                                ))}
                            </select>
                            {errors.client_id && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.client_id}
                                </p>
                            )}
                        </div>

                        {/* Nom du chantier */}
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: Rénovation villa Dupont"
                                required
                            />
                            {errors.chantier_name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.chantier_name}
                                </p>
                            )}
                        </div>

                        {/* Adresse du chantier */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Adresse du chantier
                            </label>
                            <textarea
                                value={data.chantier_address}
                                onChange={(e) =>
                                    setData("chantier_address", e.target.value)
                                }
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Adresse complète du chantier"
                            />
                            {errors.chantier_address && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.chantier_address}
                                </p>
                            )}
                        </div>

                        {/* Date d'intervention */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date d'intervention prévue
                            </label>
                            <input
                                type="date"
                                value={data.date_intervention}
                                onChange={(e) =>
                                    setData("date_intervention", e.target.value)
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.date_intervention && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.date_intervention}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Prestations */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-xl">🔧</span>
                            Prestations
                        </h2>
                        <button
                            type="button"
                            onClick={addLigne}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <span className="mr-2">+</span>
                            Ajouter une ligne
                        </button>
                    </div>

                    <div className="p-6">
                        {data.lignes.map((ligne, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-xl p-4 mb-4 last:mb-0"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Ligne {index + 1}
                                    </h3>
                                    {data.lignes.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeLigne(index)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <span className="text-xl">🗑️</span>
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    {/* Description */}
                                    <div className="md:col-span-2 relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description *
                                        </label>
                                        <input
                                            type="text"
                                            value={ligne.description}
                                            onChange={(e) => {
                                                updateLigne(
                                                    index,
                                                    "description",
                                                    e.target.value
                                                );
                                                searchPrestations(
                                                    e.target.value
                                                );
                                                setShowSuggestions(index);
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ex: Sciage au sol"
                                            required
                                        />

                                        {/* Suggestions de prestations */}
                                        {showSuggestions === index &&
                                            prestationSuggestions.length >
                                                0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                                    {prestationSuggestions.map(
                                                        (prestation) => (
                                                            <button
                                                                key={
                                                                    prestation.id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    selectPrestation(
                                                                        index,
                                                                        prestation
                                                                    )
                                                                }
                                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                                            >
                                                                <div className="font-medium text-gray-900">
                                                                    {
                                                                        prestation.name
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {formatPrice(
                                                                        prestation.default_price
                                                                    )}{" "}
                                                                    /{" "}
                                                                    {
                                                                        prestation.unit
                                                                    }
                                                                </div>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                        {errors[
                                            `lignes.${index}.description`
                                        ] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors[
                                                        `lignes.${index}.description`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* Quantité */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantité *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors[`lignes.${index}.quantity`] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors[
                                                        `lignes.${index}.quantity`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* Unité */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="ml">
                                                ml (mètre linéaire)
                                            </option>
                                            <option value="m2">
                                                m² (mètre carré)
                                            </option>
                                            <option value="m3">
                                                m³ (mètre cube)
                                            </option>
                                            <option value="trou">trou</option>
                                            <option value="T">T (tonne)</option>
                                            <option value="h">h (heure)</option>
                                            <option value="j">j (jour)</option>
                                            <option value="u">u (unité)</option>
                                            <option value="forfait">
                                                forfait
                                            </option>
                                        </select>
                                        {errors[`lignes.${index}.unit`] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors[`lignes.${index}.unit`]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Prix unitaire */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Prix unitaire € *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                        {errors[
                                            `lignes.${index}.unit_price`
                                        ] && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors[
                                                        `lignes.${index}.unit_price`
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Description détaillée */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description détaillée (optionnel)
                                    </label>
                                    <textarea
                                        value={ligne.description_detail || ""}
                                        onChange={(e) =>
                                            updateLigne(
                                                index,
                                                "description_detail",
                                                e.target.value
                                            )
                                        }
                                        rows={2}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Détails supplémentaires, spécifications techniques..."
                                    />
                                </div>

                                {/* Total de la ligne */}
                                <div className="mt-4 text-right">
                                    <span className="text-lg font-bold text-gray-900">
                                        Total :{" "}
                                        {formatPrice(
                                            ligne.quantity * ligne.unit_price
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {errors.lignes && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.lignes}
                            </p>
                        )}
                    </div>

                    {/* Totaux généraux */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex justify-end">
                            <div className="w-80 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Total HT :
                                    </span>
                                    <span className="font-medium">
                                        {formatPrice(calculateTotal())}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        TVA (20%) :
                                    </span>
                                    <span className="font-medium">
                                        {formatPrice(calculateTva())}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                                    <span>Total TTC :</span>
                                    <span className="text-blue-600">
                                        {formatPrice(calculateTotalTtc())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="mr-3 text-xl">📝</span>
                        Notes (optionnel)
                    </h2>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Notes supplémentaires, conditions particulières, informations importantes..."
                    />
                    {errors.notes && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.notes}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-6">
                    <Link
                        href={`/devis`}
                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                        <span className="mr-2">←</span>
                        Annuler
                    </Link>

                    <button
                        type="submit"
                        disabled={processing || data.lignes.length === 0}
                        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {processing ? (
                            <>
                                <span className="mr-2">⏳</span>
                                Modification en cours...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">💾</span>
                                Modifier le devis
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
