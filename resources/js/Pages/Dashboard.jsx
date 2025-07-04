import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ stats, activites }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(price || 0);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Tableau de bord
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
            <Head title="Dashboard" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">
                        {formatPrice(stats?.ca_mois || 0)}
                    </div>
                    <div className="text-sm opacity-90">CA ce mois</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">
                        {stats?.devis_attente || 0}
                    </div>
                    <div className="text-sm opacity-90">Devis en attente</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">
                        {stats?.factures_emises || 0}
                    </div>
                    <div className="text-sm opacity-90">Factures émises</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl text-center shadow-lg">
                    <div className="text-3xl font-bold mb-2">
                        {formatPrice(stats?.impayes || 0)}
                    </div>
                    <div className="text-sm opacity-90">Impayés</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                    Activité récente
                </h2>

                {activites && activites.length > 0 ? (
                    <div className="space-y-4">
                        {activites.map((activite, index) => (
                            <div
                                key={index}
                                className="flex items-center bg-white p-4 rounded-lg shadow-sm"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-white">
                                        {activite.icon}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-800">
                                        {activite.titre}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {activite.description} •{" "}
                                        {activite.created_at}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <span className="text-4xl mb-4 block">📊</span>
                        <p className="text-lg font-medium">
                            Aucune activité récente
                        </p>
                        <p className="text-sm mt-2">
                            Créez votre premier devis pour commencer !
                        </p>
                        <Link
                            href="/devis/create"
                            className="inline-block mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition-all"
                        >
                            Créer un devis
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
