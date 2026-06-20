import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In" };

const appearance = {
  variables: {
    colorPrimary: "#2e7d46",
    colorBackground: "transparent",
    colorText: "#16241c",
    colorTextSecondary: "#56655b",
    colorInputBackground: "#ffffff",
    colorInputText: "#16241c",
    colorDanger: "#dc2626",
    borderRadius: "8px",
    fontFamily: "inherit",
    fontSize: "14px",
    spacingUnit: "16px",
  },
  elements: {
    rootBox: {
      width: "100%",
    },
    cardBox: {
      width: "100%",
      background: "transparent",
      boxShadow: "none",
      border: "none",
    },
    card: {
      background: "transparent",
      boxShadow: "none",
      border: "none",
      padding: "0",
      gap: "20px",
    },
    header: {
      display: "none",
    },
    socialButtonsBlockButton: {
      border: "1px solid #e3e7df",
      backgroundColor: "#ffffff",
      color: "#16241c",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
    },
    socialButtonsBlockButtonText: {
      color: "#16241c",
      fontWeight: "500",
    },
    dividerLine: { backgroundColor: "#e3e7df" },
    dividerText: { color: "#8a988f", fontSize: "12px" },
    formFieldLabel: {
      color: "#56655b",
      fontSize: "13px",
      fontWeight: "500",
    },
    formFieldInput: {
      border: "1px solid #e3e7df",
      backgroundColor: "#ffffff",
      color: "#16241c",
      borderRadius: "8px",
      fontSize: "14px",
      padding: "10px 12px",
    },
    formButtonPrimary: {
      backgroundColor: "#2e7d46",
      color: "#ffffff",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      padding: "10px 16px",
    },
    footerActionLink: { color: "#2e7d46", fontWeight: "500" },
    footerActionText: { color: "#56655b" },
    footer: {
      background: "transparent",
      borderTop: "none",
    },
    identityPreviewText: { color: "#16241c" },
    identityPreviewEditButton: { color: "#2e7d46" },
    formFieldInputShowPasswordButton: { color: "#8a988f" },
    alternativeMethodsBlockButton: {
      border: "1px solid #e3e7df",
      backgroundColor: "#ffffff",
      color: "#16241c",
      borderRadius: "8px",
    },
  },
};

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        {/* Brand header */}
        <div className="flex flex-col items-center gap-3">
          <Image
            alt="Kumaran Natural Products logo"
            height={56}
            src="/Kumaran natural product logo.png"
            style={{ width: 56, height: 56 }}
            width={56}
          />
          <div className="text-center">
            <p className="text-[18px] font-bold leading-7 text-text-darkest">
              Kumaran Natural Products
            </p>
            <p className="text-sm text-text-muted mt-0.5">Sign in to Operations Portal</p>
          </div>
        </div>

        {/* Single glass card — Clerk inner card is transparent */}
        <div className="glass-card px-8 py-8">
          <SignIn
            appearance={appearance}
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>

        <p className="text-center text-xs text-text-muted">
          New accounts require admin approval before access is granted.
        </p>
      </div>
    </main>
  );
}
