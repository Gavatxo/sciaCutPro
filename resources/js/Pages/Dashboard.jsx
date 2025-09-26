// resources/js/Pages/Dashboard.jsx - Version BuildFlow pour Sciage/Carrotage

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ stats, activites }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
    };

    const quickActions = [
        {
            title: "Nouveau devis",
            description: "Créer un devis rapidement",
            icon: "📋",
            href: "/devis/create",
            color: "from-blue-600 to-blue-700",
            hoverColor: "hover:from-blue-700 hover:to-blue-800",
        },
        {
            title: "Ajouter un client",
            description: "Particulier ou professionnel",
            icon: "👤",
            href: "/clients/create",
            color: "from-emerald-600 to-emerald-700",
            hoverColor: "hover:from-emerald-700 hover:to-emerald-800",
        },
        {
            title: "Gérer les factures",
            description: "Suivi facturation & paiements",
            icon: "💰",
            href: "/factures",
            color: "from-amber-600 to-amber-700",
            hoverColor: "hover:from-amber-700 hover:to-amber-800",
            badge: "Bientôt",
        },
        {
            title: "Planning chantiers",
            description: "Organiser vos interventions",
            icon: "📅",
            href: "/planning",
            color: "from-purple-600 to-purple-700",
            hoverColor: "hover:from-purple-700 hover:to-purple-800",
            badge: "Bientôt",
        },
    ];

    const getStatusBadge = (status) => {
        const badges = {
            brouillon: {
                color: "bg-gray-100 text-gray-700",
                text: "Brouillon",
            },
            envoye: { color: "bg-blue-100 text-blue-700", text: "Envoyé" },
            accepte: { color: "bg-green-100 text-green-700", text: "Accepté" },
            refuse: { color: "bg-red-100 text-red-700", text: "Refusé" },
        };
        return badges[status] || badges["brouillon"];
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Tableau de bord
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gérez votre activité du bâtiment
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/devis/create"
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <span className="mr-2">📋</span>
                            Nouveau devis
                        </Link>
                        <Link
                            href="/clients/create"
                            className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        >
                            <span className="mr-2">👤</span>
                            Nouveau client
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Tableau de bord - BuildFlow" />

            <div className="space-y-8">
                {/* KPI Cards avec thème sciage/carrotage */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    CA du mois
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {formatPrice(stats?.ca_mois || 0)}
                                </p>
                                <p className="text-sm text-emerald-600 mt-1 flex items-center">
                                    <span className="mr-1">📈</span>
                                    +12% vs mois dernier
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">💰</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Devis en attente
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.devis_attente || 0}
                                </p>
                                <p className="text-sm text-blue-600 mt-1">
                                    {formatPrice(
                                        (stats?.devis_attente || 0) * 3500
                                    )}{" "}
                                    potentiel
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">⏳</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Chantiers en cours
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.chantiers_actifs || 0}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Interventions planifiées
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🏗️</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Impayés
                                </p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {formatPrice(stats?.impayes || 0)}
                                </p>
                                <p className="text-sm text-red-600 mt-1">
                                    {stats?.factures_retard || 0} facture(s) en
                                    retard
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">⚠️</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions rapides et activité récente */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Actions rapides */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="mr-3 text-2xl">⚡</span>
                                Actions rapides
                            </h2>
                            <div className="space-y-4">
                                {quickActions.map((action, index) =>
                                    action.badge ? (
                                        <div
                                            key={index}
                                            className="relative flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 opacity-70 cursor-not-allowed"
                                        >
                                            <div
                                                className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mr-4 shadow-md`}
                                            >
                                                <span className="text-xl">
                                                    {action.icon}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-700">
                                                    {action.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {action.description}
                                                </p>
                                            </div>
                                            <div className="absolute top-2 right-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                                                {action.badge}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            key={index}
                                            href={action.href}
                                            className={`flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group hover:-translate-y-1`}
                                        >
                                            <div
                                                className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200 shadow-md`}
                                            >
                                                <span className="text-xl">
                                                    {action.icon}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                    {action.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {action.description}
                                                </p>
                                            </div>
                                            <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Activité récente */}
                    <div className="xl:col-span-2">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <span className="mr-3 text-2xl">🕒</span>
                                    Activité récente
                                </h2>
                                <Link
                                    href="/devis"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center"
                                >
                                    Voir tout
                                    <svg
                                        className="w-4 h-4 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            </div>

                            {activites && activites.length > 0 ? (
                                <div className="space-y-4">
                                    {activites.map((activite, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                                                <span className="text-xl">
                                                    {activite.icon || "📋"}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">
                                                    {activite.titre}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {activite.description}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {activite.created_at}
                                                </div>
                                            </div>
                                            {activite.status && (
                                                <div
                                                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                        getStatusBadge(
                                                            activite.status
                                                        ).color
                                                    }`}
                                                >
                                                    {
                                                        getStatusBadge(
                                                            activite.status
                                                        ).text
                                                    }
                                                </div>
                                            )}
                                            <div className="text-blue-600 group-hover:translate-x-1 transition-transform ml-3">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">📋</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        Aucune activité récente
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                                        Commencez par créer votre premier devis
                                        pour voir votre activité ici.
                                    </p>
                                    <Link
                                        href="/devis/create"
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <span className="mr-2">📋</span>
                                        Créer mon premier devis
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Performances et métriques du bâtiment */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <span className="mr-3 text-2xl">📊</span>
                            Tableau de bord analytique
                        </h2>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg font-medium">
                                7 jours
                            </button>
                            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                30 jours
                            </button>
                            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                3 mois
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">📈</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats?.taux_conversion || 0}%
                            </p>
                            <p className="text-sm text-gray-600">
                                Taux de conversion
                            </p>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">⭐</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats?.satisfaction || 0}%
                            </p>
                            <p className="text-sm text-gray-600">
                                Satisfaction client
                            </p>
                        </div>

                        <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">⚡</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats?.delai_moyen || 0}j
                            </p>
                            <p className="text-sm text-gray-600">
                                Délai moyen intervention
                            </p>
                        </div>
                    </div>

                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <span className="text-2xl">📈</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Module analytique avancé
                            </h3>
                            <p className="text-sm text-gray-500 max-w-sm">
                                Tableau de bord personnalisable en
                                développement.
                                <br />
                                Bientôt : analyses de rentabilité, prévisions,
                                reporting automatisé.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
