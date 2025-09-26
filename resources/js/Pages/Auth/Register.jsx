// resources/js/Pages/Auth/Register.jsx - Page d'inscription BuildFlow

import { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        company_name: "",
        company_phone: "",
        company_address: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <>
            <Head title="Inscription - BuildFlow" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="inline-flex items-center space-x-3 mb-6"
                        >
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    B
                                </span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                BuildFlow
                            </span>
                        </Link>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Créer votre compte
                        </h1>
                        <p className="text-gray-600">
                            Rejoignez des centaines d'entreprises qui font
                            confiance à BuildFlow
                        </p>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Progress Steps */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                            <div className="flex items-center justify-between max-w-md mx-auto">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold">
                                            1
                                        </span>
                                    </div>
                                    <span className="ml-3 text-sm font-medium">
                                        Informations personnelles
                                    </span>
                                </div>
                                <div className="flex-1 h-1 bg-white/20 mx-4"></div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold">
                                            2
                                        </span>
                                    </div>
                                    <span className="ml-3 text-sm font-medium">
                                        Votre entreprise
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submit} className="p-8 space-y-6">
                            {/* Personal Information Section */}
                            <div>
                                <div className="flex items-center mb-6">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Vos informations personnelles
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="name"
                                            value="Nom complet *"
                                            className="text-gray-700 font-medium"
                                        />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Jean Dupont"
                                            required
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="email"
                                            value="Adresse email *"
                                            className="text-gray-700 font-medium"
                                        />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="jean@monentreprise.fr"
                                            required
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="password"
                                            value="Mot de passe *"
                                            className="text-gray-700 font-medium"
                                        />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="••••••••"
                                            required
                                        />
                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">
                                            Minimum 8 caractères
                                        </p>
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="password_confirmation"
                                            value="Confirmer le mot de passe *"
                                            className="text-gray-700 font-medium"
                                        />
                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="••••••••"
                                            required
                                        />
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Company Information Section */}
                            <div className="border-t border-gray-200 pt-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3">
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Informations de votre entreprise
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="company_name"
                                            value="Nom de l'entreprise *"
                                            className="text-gray-700 font-medium"
                                        />
                                        <TextInput
                                            id="company_name"
                                            name="company_name"
                                            value={data.company_name}
                                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            onChange={(e) =>
                                                setData(
                                                    "company_name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ma Société SARL"
                                            required
                                        />
                                        <InputError
                                            message={errors.company_name}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel
                                                htmlFor="company_phone"
                                                value="Téléphone"
                                                className="text-gray-700 font-medium"
                                            />
                                            <TextInput
                                                id="company_phone"
                                                name="company_phone"
                                                value={data.company_phone}
                                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                onChange={(e) =>
                                                    setData(
                                                        "company_phone",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="01 23 45 67 89"
                                            />
                                            <InputError
                                                message={errors.company_phone}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="company_address"
                                                value="Adresse"
                                                className="text-gray-700 font-medium"
                                            />
                                            <TextInput
                                                id="company_address"
                                                name="company_address"
                                                value={data.company_address}
                                                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                onChange={(e) =>
                                                    setData(
                                                        "company_address",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="123 Rue de la Construction, 75001 Paris"
                                            />
                                            <InputError
                                                message={errors.company_address}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits Section */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    🎉 Inclus dans votre essai gratuit :
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="w-5 h-5 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            Devis illimités
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="w-5 h-5 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            Signature électronique
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="w-5 h-5 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            Gestion des clients
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg
                                            className="w-5 h-5 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            Support prioritaire
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <PrimaryButton
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Création du compte...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <span>
                                                🚀 Créer mon compte BuildFlow
                                            </span>
                                        </div>
                                    )}
                                </PrimaryButton>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    En créant votre compte, vous acceptez nos{" "}
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        conditions d'utilisation
                                    </a>{" "}
                                    et notre{" "}
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:underline"
                                    >
                                        politique de confidentialité
                                    </a>
                                    .
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Login Link */}
                    <div className="text-center mt-8">
                        <p className="text-gray-600">
                            Vous avez déjà un compte ?{" "}
                            <Link
                                href={route("login")}
                                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                            >
                                Se connecter
                            </Link>
                        </p>
                    </div>

                    {/* Back to home */}
                    <div className="text-center mt-4">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center text-sm"
                        >
                            <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
