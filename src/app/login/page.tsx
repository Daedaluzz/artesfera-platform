import React, { Suspense } from "react";
import Login from "./Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar - ArtEsfera",
  description:
    "Faça login na sua conta ArtEsfera e conecte-se com a comunidade artística.",
};

function LoginLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy-blue dark:border-brand-yellow"></div>
    </div>
  );
}

const LoginPage = () => {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <Login />
    </Suspense>
  );
};

export default LoginPage;
