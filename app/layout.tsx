import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/utils/queryClientProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimeLocalizationProvider from "@/utils/localizationProvider";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "FUParking",
  description: "FU Parking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ToastContainer autoClose={1000} />
        <QueryProviders>
          <TimeLocalizationProvider>{children}</TimeLocalizationProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
