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
            if (!data || data.length === 0) {
              console.warn('Empty data received');
              resolve([]);
              return;
            }

            // Log first few rows for debugging
            console.log('CSV Preview:', data.slice(0, 5));

            // Dynamic Header Search
            // We look for a row that contains '名前' AND '年間順位' or '総順位Pt'
            let headerRowIndex = -1;
            let nameIndex = -1;
            let rankIndex = -1;
            let totalPtIndex = -1;

            for (let i = 0; i < Math.min(data.length, 10); i++) {
              const row = data[i];
              // Search for column indices in this row
              const nIdx = row.findIndex(c => c && c.trim() === '名前');
              const rIdx = row.findIndex(c => c && c.includes('年間順位'));
              const tIdx = row.findIndex(c => c && c.includes('総順位Pt'));

              if (nIdx !== -1 && (rIdx !== -1 || tIdx !== -1)) {
                headerRowIndex = i;
                nameIndex = nIdx;
                rankIndex = rIdx;
                totalPtIndex = tIdx;
                break;
              }
            }

            if (headerRowIndex === -1) {
              console.error('Header row not found. Searched first 10 rows.');
              console.log('Data:', data);
              resolve([]);
              return;
            }

            console.log(`Found headers at row ${headerRowIndex}: Name=${nameIndex}, Rank=${rankIndex}, Total=${totalPtIndex}`);

            // If Rank or Total is missing, try to infer from partial matches or relative positions if needed
            // But strict matching is safer to avoid garbage data.
            // Note: If 'Annual Rank' is missing but 'Total Pt' exists, we might still want to show it.

            // Extract player data (from the row AFTER headers)
            const players = data.slice(headerRowIndex + 1)
              .filter(row => row[nameIndex] && row[nameIndex].trim() !== '') // Filter empty names
              .map((row, index) => {
                // If specific columns weren't found, default to innocuous values
                const rankVal = rankIndex !== -1 ? parseInt(row[rankIndex], 10) : 999;
                const pointsVal = totalPtIndex !== -1 ? parseFloat(row[totalPtIndex]) : 0;

                // Calculate trend directly from Column AB (Index 27)
                const monthlyPt = parseFloat(row[22]) || 0; // Column W is index 22 (Monthly)
                const todayPt = parseFloat(row[24]) || 0;   // Column Y is index 24 (Today / Added)

                // Previous Rank is in Column AB (Index 27)
                // Default to current rank if missing (so trend is 'same')
                const prevRankVal = parseInt(row[27], 10);
                const prevRank = isNaN(prevRankVal) ? rankVal : prevRankVal;

                let trend = 'same';
                if (rankVal < prevRank) trend = 'up';
                else if (rankVal > prevRank) trend = 'down';

                return {
                  id: index,
                  name: row[nameIndex],
                  rank: isNaN(rankVal) ? 999 : rankVal,
                  points: isNaN(pointsVal) ? 0 : pointsVal,
                  monthlyPoints: monthlyPt,
                  todayPoints: todayPt,
                  trend: trend,
                  displayRank: isNaN(rankVal) ? '-' : rankVal
                };
              })
              .sort((a, b) => a.rank - b.rank);

            resolve(players);
          } catch (e) {
            console.error('Parsing error:', e);
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
