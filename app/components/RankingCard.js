
export default function RankingCard({ player }) {
    const { rank, name, points, displayRank } = player;

    // Determine styles based on rank
    let rankStyle = "bg-slate-700/50 text-slate-300"; // Default
    let containerStyle = "border-slate-700/50";
    let glow = "";

    if (rank === 1) {
        rankStyle = "bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950 font-bold shadow-[0_0_15px_rgba(234,179,8,0.5)]";
        containerStyle = "border-yellow-500/50 bg-yellow-900/10";
        glow = "shadow-[0_0_20px_rgba(234,179,8,0.2)]";
    } else if (rank === 2) {
        rankStyle = "bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900 font-bold shadow-[0_0_15px_rgba(148,163,184,0.5)]";
        containerStyle = "border-slate-400/50 bg-slate-800/30";
    } else if (rank === 3) {
        rankStyle = "bg-gradient-to-br from-orange-300 to-amber-700 text-amber-950 font-bold shadow-[0_0_15px_rgba(180,83,9,0.5)]";
        containerStyle = "border-orange-500/50 bg-orange-900/10";
    }

    return (
        <div className={`relative flex items-center p-4 rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${containerStyle} ${glow} bg-opacity-40`}>
            {/* Rank Badge */}
            <div className={`flex items-center justify-center w-12 h-12 rounded-full text-xl ${rankStyle} mr-4 shrink-0`}>
                {displayRank}
            </div>

            {/* Name */}
            <div className="flex-grow min-w-0">
                <h2 className={`text-lg font-semibold truncate ${rank <= 3 ? 'text-white' : 'text-slate-200'}`}>
                    {name}
                </h2>
            </div>

            {/* Points */}
            <div className="text-right shrink-0 ml-4">
                <span className="block text-sm text-slate-400 uppercase tracking-wider">Total Pt</span>
                <span className="block text-xl font-bold font-mono text-purple-400">
                    {points.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
