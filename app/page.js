import RankingList from './components/RankingList';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="container">
        <header className="mb-8 text-center">
          <h1 className="title">Famton Rankings</h1>
          <p className="text-slate-400">Family Badminton Season 2024-2025</p>
        </header>

        <RankingList />

        <footer className="mt-12 text-center text-xs text-slate-600">
          <p>Powered by Next.js & Google Sheets</p>
        </footer>
      </div>
    </main>
  );
}
