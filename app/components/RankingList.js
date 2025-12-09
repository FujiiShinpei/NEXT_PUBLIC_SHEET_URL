'use client';

import { useState, useEffect } from 'react';
import RankingCard from './RankingCard';
import { fetchRankings } from '../lib/sheets';

// Mock data for initial dev or fallback
const MOCK_DATA = [
    { id: 1, name: 'Sample Player 1', rank: 1, displayRank: 1, points: 150 },
    { id: 2, name: 'Sample Player 2', rank: 2, displayRank: 2, points: 120 },
    { id: 3, name: 'Sample Player 3', rank: 3, displayRank: 3, points: 100 },
];

export default function RankingList() {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                // TODO: Replace with actual published CSV URL
                // For now, we simulate a delay or use mock data if no URL provided
                const csvUrl = process.env.NEXT_PUBLIC_SHEET_URL;

                let data = [];
                if (csvUrl) {
                    data = await fetchRankings(csvUrl);
                } else {
                    console.log("No Sheet URL found, using mock data for demo.");
                    // Simulate network delay
                    await new Promise(r => setTimeout(r, 800));
                    data = MOCK_DATA;
                }

                setRankings(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load rankings.');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="loading">Loading rankings...</div>;
    }

    if (error) {
        return <div className="text-red-400 text-center p-4">{error}</div>;
    }

    if (rankings.length === 0) {
        return <div className="text-center text-slate-400 p-8">No data found in spreadsheet.</div>;
    }

    return (
        <div className="card-list">
            {rankings.map((player) => (
                <RankingCard key={player.id} player={player} />
            ))}
        </div>
    );
}
