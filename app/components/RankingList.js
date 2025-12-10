'use client';

import { useState, useEffect } from 'react';
import RankingCard from './RankingCard';
import { fetchRankings } from '../lib/sheets';

export default function RankingList() {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortMode, setSortMode] = useState('total'); // 'total' | 'monthly'

    useEffect(() => {
        async function loadData() {
            try {
                const csvUrl = process.env.NEXT_PUBLIC_SHEET_URL;
                let data = [];
                if (csvUrl) {
                    data = await fetchRankings(csvUrl);
                }
                setRankings(data);
            } catch (err) {
                console.error(err);
                setError('ランキングの読み込みに失敗しました');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <div className="loading">読み込み中...</div>;
    if (error) return <div className="error-msg">{error}</div>;
    if (rankings.length === 0) return <div className="empty-msg">データが見つかりませんでした</div>;

    // Sort and prep data
    const sortedData = [...rankings].sort((a, b) => {
        if (sortMode === 'monthly') {
            // Sort by Monthly Points (Column W) descending
            return b.monthlyPoints - a.monthlyPoints;
        }
        // Default: Sort by Annual Rank
        return a.rank - b.rank;
    });

    // Re-assign display rank for the view if needed
    const displayData = sortedData.map((p, i) => ({
        ...p,
        // If sorting by monthly, show quantitative rank based on month
        displayRank: sortMode === 'monthly' ? i + 1 : p.displayRank,
    }));

    return (
        <div className="w-full">
            {/* Sort Toggles */}
            {/* Sort Toggles - Casual Style */}
            <div className="sort-controls">
                <button
                    className={`btn-toggle ${sortMode === 'total' ? 'btn-toggle-active' : 'btn-toggle-inactive'}`}
                    onClick={() => setSortMode('total')}
                >
                    年間
                </button>
                <button
                    className={`btn-toggle ${sortMode === 'monthly' ? 'btn-toggle-active' : 'btn-toggle-inactive'}`}
                    onClick={() => setSortMode('monthly')}
                >
                    今月
                </button>
            </div>

            <div className="card-list">
                {/* Table Header */}
                <div className="ranking-header">
                    <div className="col-rank">#</div>
                    <div className="col-name">名前</div>
                    <div className="col-monthly">今月</div>
                    <div className="col-today">加算点</div>
                    <div className="col-points">年間</div>
                </div>

                {displayData.map((player) => (
                    <RankingCard key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
}
