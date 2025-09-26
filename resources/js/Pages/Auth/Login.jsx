// resources/js/Pages/Auth/Login.jsx - Page de connexion BuildFlow

import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <>
            <Head title="Connexion - BuildFlow" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 items-center justify-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
                        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
                        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
                    </div>

                    <div className="relative z-10 text-white text-center max-w-md">
                        {/* Logo */}
                        <div className="flex items-center justify-center space-x-3 mb-8">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                <span className="text-2xl font-bold">B</span>
                            </div>
                            <span className="text-3xl font-bold">
                                BuildFlow
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold mb-6 leading-tight">
                            Bienvenue sur BuildFlow
                        </h1>

                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Gérez vos chantiers, devis et factures en toute
                            simplicité. La solution qui fait gagner du temps aux
                            professionnels du BTP.
                        </p>

                        {/* Features List */}
                        <div className="space-y-4 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-white"
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
                                </div>
                                <span className="text-blue-100">
                                    Devis professionnels en 2 minutes
                                </span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-white"
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
                                </div>
                                <span className="text-blue-100">
                                    Signature électronique intégrée
                                </span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-white"
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
                                </div>
                                <span className="text-blue-100">
                                    Suivi des paiements automatique
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    B
                                </span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">
                                BuildFlow
                            </span>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Connexion
                                </h2>
                                <p className="text-gray-600">
                                    Connectez-vous à votre espace BuildFlow
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Adresse email"
                                        className="text-gray-700 font-medium"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        autoComplete="username"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="votre@email.com"
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Mot de passe"
                                        className="text-gray-700 font-medium"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        autoComplete="current-password"
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="••••••••"
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">
                                            Se souvenir de moi
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                                        >
                                            Mot de passe oublié ?
                                        </Link>
                                    )}
                                </div>

                                <PrimaryButton
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
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
                                            Connexion...
                                        </div>
                                    ) : (
                                        "Se connecter"
                                    )}
                                </PrimaryButton>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-gray-600">
                                    Pas encore de compte ?{" "}
                                    <Link
                                        href={route("register")}
                                        className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                                    >
                                        Créer un compte gratuitement
                                    </Link>
                                </p>
                            </div>

                            {/* Demo Account */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-800 text-center mb-2">
                                    <span className="font-semibold">
                                        Compte de démonstration :
                                    </span>
                                </p>
                                <div className="text-xs text-blue-600 text-center space-y-1">
                                    <div>📧 Email : demo@buildflow.fr</div>
                                    <div>🔐 Mot de passe : demo123</div>
                                </div>
                            </div>
                        </div>

                        {/* Back to home */}
                        <div className="text-center mt-6">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center"
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
            </div>
        </>
    );
}
