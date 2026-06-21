import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "Society Management App",
  description: "Modern society management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
