import RankingList from './components/RankingList';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="container">
        <header className="mb-8 text-center">
          <h1 className="title">Famton 年間ランキング</h1>

        </header>

        <RankingList />

      </div>
    </main>
  );
}
