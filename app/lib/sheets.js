import Papa from 'papaparse';

export const fetchRankings = async (csvUrl) => {
  try {
    const response = await fetch(csvUrl, { next: { revalidate: 60 } }); // Revalidate every minute
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        complete: (results) => {
          try {
            const data = results.data;
            if (!data || data.length < 3) {
              resolve([]);
              return;
            }

            // Row 0 is Months (12月, 1月...)
            // Row 1 is Headers (名前, 順位, 順位Pt...)
            const headers = data[1];
            
            // Find indices
            const nameIndex = headers.findIndex(h => h && h.includes('名前'));
            const rankIndex = headers.findIndex(h => h && h.includes('年間順位'));
            const totalPtIndex = headers.findIndex(h => h && h.includes('総順位Pt'));

            if (nameIndex === -1 || rankIndex === -1) {
              console.error('Required columns not found');
              resolve([]);
              return;
            }

            // Extract player data (from row 2 onwards)
            const players = data.slice(2)
              .filter(row => row[nameIndex] && row[nameIndex].trim() !== '') // Filter empty rows
              .map((row, index) => {
                const rank = parseInt(row[rankIndex], 10);
                const points = parseFloat(row[totalPtIndex]) || 0;
                
                // If rank is NaN (e.g. empty), maybe treat as unranked or huge number
                return {
                  id: index,
                  name: row[nameIndex],
                  rank: isNaN(rank) ? 999 : rank,
                  points: points,
                  displayRank: isNaN(rank) ? '-' : rank
                };
              })
              .sort((a, b) => a.rank - b.rank); // Sort by rank properly

            resolve(players);
          } catch (e) {
            reject(e);
          }
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return [];
  }
};
