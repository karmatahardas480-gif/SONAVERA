import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "SONAVERA JEWELS | Elegant Jewellery",
  description: "Shop elegant, gift-ready jewellery from SONAVERA JEWELS with secure online payment.",
  icons: { icon: "/brand/sonavera-mark.png", apple: "/brand/sonavera-mark.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <footer className="footer">
          <div><strong>SONAVERA JEWELS</strong><span>Elegance for every moment.</span></div>
          <p>© {new Date().getFullYear()} SONAVERA JEWELS. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
