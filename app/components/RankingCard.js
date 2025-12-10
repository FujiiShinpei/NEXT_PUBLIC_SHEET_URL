
export default function RankingCard({ player }) {
    const { rank, name, points, monthlyPoints, todayPoints, trend, displayRank } = player;

    // Determine variant classes
    let rankClass = "rank-default";
    let rowClass = "row-default";

    // Use displayRank for styling (ensure it's a number for comparison)
    const effectiveRank = typeof displayRank === 'number' ? displayRank : 999;

    if (effectiveRank === 1) rowClass = "row-gold";
    else if (effectiveRank === 2) rowClass = "row-silver";
    else if (effectiveRank === 3) rowClass = "row-bronze";

    const formattedPoints = (points > 0 ? '+ ' : '') + points.toLocaleString();
    const formattedMonthly = monthlyPoints ? (monthlyPoints > 0 ? '+' : '') + monthlyPoints : '-';
    const formattedToday = todayPoints ? (todayPoints > 0 ? '+' : '') + todayPoints : '-';

    // Explicit char for trend
    let trendIcon = "━"; // thicker line
    if (trend === 'up') trendIcon = "▲";
    else if (trend === 'down') trendIcon = "▼";

    return (
        <div className={`ranking-row ${rowClass}`}>
            <div className="col-rank">
                <span className="rank-num">{displayRank}</span>
                <span className={`trend-icon trend-${trend}`}>{trendIcon}</span>
            </div>
            <div className="col-name">
                <span className="player-name">{name}</span>
            </div>
            <div className="col-monthly">
                <span className="monthly-val">{formattedMonthly}</span>
                <span className="point-unit">Pt</span>
            </div>
            <div className="col-today">
                <span className="monthly-val">{formattedToday}</span>
                <span className="point-unit">Pt</span>
            </div>
            <div className="col-points">
                <span className="point-val">{formattedPoints}</span>
                <span className="point-unit">Pt</span>
            </div>
        </div>
    );
}
