import "./globals.css";

export const metadata = {
    title: "MarketCal",
    description: "Projeto final de uma agência de marketing digital para ajudar sua equipe de social media a gerenciar seus clientes",
    icons: {
        icon: "/icons/favicon.ico",
    },
};

export default function RootLayout({ children }) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
