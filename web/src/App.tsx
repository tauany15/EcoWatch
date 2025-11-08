import { useEffect, useState } from 'react';

interface Species {
  name: string;
  scientificName: string;
  status: string;
}

interface BiomeData {
  biome: string;
  source: string;
  totalSpecies: number;
  species: Species[];
}

function App() {
  const [data, setData] = useState<BiomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBiomeData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/biomes/cold');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch biome data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBiomeData();
  }, []);

  const getSpeciesEmoji = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bear')) return '🐻‍❄️';
    if (lowerName.includes('fox')) return '🦊';
    if (lowerName.includes('owl')) return '🦉';
    if (lowerName.includes('penguin')) return '🐧';
    if (lowerName.includes('walrus')) return '🦭';
    if (lowerName.includes('beluga') || lowerName.includes('whale')) return '🐋';
    if (lowerName.includes('narwhal')) return '🦄';
    if (lowerName.includes('seal')) return '🦭';
    if (lowerName.includes('muskox') || lowerName.includes('ox')) return '🦬';
    return '❄️';
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('endangered')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (normalizedStatus.includes('vulnerable')) {
      return 'bg-orange-100 text-orange-800 border-orange-200';
    } else if (normalizedStatus.includes('threatened')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else if (normalizedStatus.includes('least concern')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-700 text-xl font-medium">Loading species data...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching from GBIF database</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-red-100">
          <div className="text-red-500 text-6xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Unable to Load Data</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 px-8 py-8">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl">❄️</span>
              <h1 className="text-4xl font-bold text-white">
                {data?.biome || 'Cold Biome'}
              </h1>
            </div>
            <p className="text-blue-100 text-lg">
              Tracking {data?.totalSpecies || 0} species in arctic and polar regions
            </p>
            <p className="text-blue-200 text-sm mt-2">
              Data source: {data?.source || 'GBIF'}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Common Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Scientific Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Conservation Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.species.map((species, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getSpeciesEmoji(species.name)}
                        </span>
                        <div className="text-sm font-semibold text-gray-900">
                          {species.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600 italic">
                        {species.scientificName}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-full border ${getStatusColor(species.status)}`}>
                        {species.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {data?.species.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="text-xl">No species data available</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Real-time biodiversity data from the Global Biodiversity Information Facility</p>
        </div>
      </div>
    </div>
  );
}

export default App;