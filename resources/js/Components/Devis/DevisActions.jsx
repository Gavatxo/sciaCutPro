import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";

export default function DevisActions({ devis }) {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        email: devis.client?.email || "",
        subject: `Devis ${devis.numero} - ${devis.chantier_name}`,
        message: `Bonjour,\n\nVeuillez trouver ci-joint notre devis ${devis.numero} pour les travaux "${devis.chantier_name}".\n\nCordialement,`,
        send_copy: true,
    });

    const handleDownloadPdf = () => {
        // Créer un lien de téléchargement forcé
        const link = document.createElement("a");
        link.href = `/devis/${devis.id}/pdf`;
        link.download = `devis-${devis.numero}.pdf`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePreview = () => {
        window.open(`/devis/${devis.id}/preview`, "_blank");
    };

    const handleSendEmail = (e) => {
        e.preventDefault();
        post(`/devis/${devis.id}/send-email`, {
            onSuccess: () => {
                setShowEmailModal(false);
                reset();
            },
        });
    };

    const handleStatusChange = (status) => {
        setNewStatus(status);
        setShowStatusModal(true);
    };

    const confirmStatusChange = () => {
        router.patch(
            `/devis/${devis.id}/status`,
            {
                status: newStatus,
            },
            {
                onSuccess: () => {
                    setShowStatusModal(false);
                    setNewStatus("");
                },
            }
        );
    };

    const handleDuplicate = () => {
        if (confirm(`Voulez-vous dupliquer le devis ${devis.numero} ?`)) {
            router.post(`/devis/${devis.id}/duplicate`);
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            brouillon: "Brouillon",
            envoye: "Envoyé",
            signe: "Signé",
            refuse: "Refusé",
            expire: "Expiré",
        };
        return labels[status] || status;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-xl">⚡</span>
                Actions rapides
            </h3>

            <div className="space-y-4">
                {/* Actions principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={handlePreview}
                        className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        <span className="mr-2">👁️</span>
                        Aperçu
                    </button>

                    <button
                        onClick={handleDownloadPdf}
                        className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                    >
                        <span className="mr-2">📥</span>
                        Télécharger PDF
                    </button>

                    <button
                        onClick={() => setShowEmailModal(true)}
                        disabled={!devis.client?.email}
                        className="w-full inline-flex items-center justify-center px-4 py-3 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="mr-2">📧</span>
                        Envoyer par email
                    </button>

                    <button
                        onClick={handleDuplicate}
                        className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <span className="mr-2">📋</span>
                        Dupliquer
                    </button>
                </div>

                {/* Actions de statut */}
                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Changer le statut
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {devis.status === "brouillon" && (
                            <button
                                onClick={() => handleStatusChange("envoye")}
                                className="px-3 py-2 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                Marquer comme envoyé
                            </button>
                        )}
                        {devis.status === "envoye" && (
                            <>
                                <button
                                    onClick={() => handleStatusChange("signe")}
                                    className="px-3 py-2 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors"
                                >
                                    Marquer comme signé
                                </button>
                                <button
                                    onClick={() => handleStatusChange("refuse")}
                                    className="px-3 py-2 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    Marquer comme refusé
                                </button>
                            </>
                        )}
                        {(devis.status === "refuse" ||
                            devis.status === "expire") && (
                            <button
                                onClick={() => handleStatusChange("brouillon")}
                                className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Remettre en brouillon
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Email */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Envoyer le devis par email
                        </h3>

                        <form onSubmit={handleSendEmail} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email du destinataire *
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Objet *
                                </label>
                                <input
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData("subject", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.subject && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message *
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) =>
                                        setData("message", e.target.value)
                                    }
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    required
                                />
                                {errors.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="send_copy"
                                    checked={data.send_copy}
                                    onChange={(e) =>
                                        setData("send_copy", e.target.checked)
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="send_copy"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    M'envoyer une copie
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEmailModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {processing ? "Envoi..." : "Envoyer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmation changement de statut */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Confirmer le changement de statut
                        </h3>

                        <p className="text-gray-600 mb-6">
                            Voulez-vous vraiment changer le statut du devis{" "}
                            {devis.numero} de "{getStatusLabel(devis.status)}"
                            vers "{getStatusLabel(newStatus)}" ?
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={confirmStatusChange}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
