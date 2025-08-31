import "./globals.css";

export const metadata = {
  title: "Blossm Nutrition – Daily support for women 30+",
  description: "Science-led daily nutrition that supports hormonal balance, sleep, skin, and mood.",
  openGraph: { images: ["/og.jpg"] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
