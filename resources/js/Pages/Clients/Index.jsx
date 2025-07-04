import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function ClientsIndex({ clients, filters, stats }) {
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const search = formData.get("search");

        router.get(
            "/clients",
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (client) => {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer le client "${client.name}" ?`
            )
        ) {
            router.delete(`/clients/${client.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Gestion des clients
                    </h1>
                    <Link
                        href="/clients/create"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <span>➕</span>
                        Nouveau client
                    </Link>
                </div>
            }
        >
            <Head title="Clients" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-800">
                        {stats.total}
                    </div>
                    <div className="text-sm text-blue-600">Total clients</div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-800">
                        {stats.actifs}
                    </div>
                    <div className="text-sm text-green-600">
                        Clients actifs (6 derniers mois)
                    </div>
                </div>
            </div>

            {/* Recherche */}
            <form
                onSubmit={handleSearch}
                className="bg-gray-50 p-4 rounded-lg mb-6"
            >
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            name="search"
                            placeholder="Rechercher un client (nom, email, contact...)"
                            defaultValue={filters.search}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Rechercher
                    </button>
                    <Link
                        href="/clients"
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Reset
                    </Link>
                </div>
            </form>

            {/* Table des clients */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nom
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Téléphone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clients.data.length > 0 ? (
                            clients.data.map((client) => (
                                <tr
                                    key={client.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">
                                            {client.name}
                                        </div>
                                        {client.siret && (
                                            <div className="text-sm text-gray-500">
                                                SIRET: {client.siret}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {client.contact_person || "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {client.phone || "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {client.email || "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/clients/${client.id}`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Voir
                                            </Link>
                                            <Link
                                                href={`/clients/${client.id}/edit`}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(client)
                                                }
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-12 text-center"
                                >
                                    <div className="text-gray-500">
                                        <span className="text-4xl mb-4 block">
                                            👥
                                        </span>
                                        <p className="text-lg font-medium">
                                            Aucun client trouvé
                                        </p>
                                        <p className="text-sm mt-2">
                                            Ajoutez votre premier client pour
                                            commencer !
                                        </p>
                                        <Link
                                            href="/clients/create"
                                            className="inline-block mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                                        >
                                            Ajouter un client
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {clients.links && clients.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <div className="flex space-x-1">
                        {clients.links.map((link, index) => (
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
                                    index === clients.links.length - 1
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
