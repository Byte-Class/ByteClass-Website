import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { Provider } from "@/components/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Provider>{children}</Provider>
        <Toaster closeButton richColors position="top-right" />
      </body>
    </html>
  );
}
