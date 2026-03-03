import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'Note Hub',
  description: 'NoteHub is a simple and efficient application designed for managing personal notes.',
  openGraph: {
    type: "website",
    url: "https://08-zustand-blond-two.vercel.app/",
    title: 'Note Hub',
    description: 'NoteHub is a simple and efficient application designed for managing personal notes.',
    siteName: "Note Hub",
    images: [
      {
        url: 'https://08-zustand-blond-two.vercel.app/',
        width: 600,
        height: 600,
        alt: "note hub image",
      },
    ],
  },
};


export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <TanStackProvider>
        <Header/>
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
        <div></div>
      </body>
    </html>
  );
}
