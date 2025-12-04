import "./globals.css";
import { PostsProvider } from "../context/PostsContext";

export const metadata = {
    title: "MarketCal",
    description: "Projeto final de uma agência de marketing digital para ajudar sua equipe de social media a gerenciar seus clientes",
};

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <PostsProvider>
                    {children}
                </PostsProvider>
            </body>
        </html>
    );
}
