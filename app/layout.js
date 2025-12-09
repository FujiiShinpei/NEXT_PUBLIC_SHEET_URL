import "./globals.css";

export const metadata = {
  title: "Famton Rankings",
  description: "Family Badminton Ranking System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
