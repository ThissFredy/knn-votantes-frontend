import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "KNN Votantes - Predicción de Intención de Voto",
    description:
        "Aplicación de Machine Learning para la predicción de intención de voto.",
    keywords: ["KNN", "Machine Learning", "Predicción de Voto"],
    icons: {
        icon: "/logo.png",
    },
};

import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Header />
                <main className="min-h-screen bg-white">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
