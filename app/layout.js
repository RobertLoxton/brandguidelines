// app/layout.js
import "./globals.css";
import "./react-colorful.css"; // <- add this (local styles for the color picker)

export const metadata = {
  title: "Blossm – Daily support for women 30+",
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
