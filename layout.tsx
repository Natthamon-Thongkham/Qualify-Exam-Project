import type { Metadata } from "next";
import "./globals.css";
import AdminNav from "@/components/AdminNav";

export const metadata: Metadata = {
  title: "Qualify Exam",
  description: "Qualify Exam System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="appPage">
          <header className="appHeader">
            <h1 className="appLogo">Qualify Exam</h1>

            <AdminNav />
          </header>

          {children}
        </main>
      </body>
    </html>
  );
}