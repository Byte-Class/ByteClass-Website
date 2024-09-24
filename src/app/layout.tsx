import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
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
        <Toaster />
      </body>
    </html>
  );
}
