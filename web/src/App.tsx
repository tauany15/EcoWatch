import { useEffect, useMemo, useState } from 'react';
import { getBiome, getBiomes, type BiomeData, type BiomeSummary, type Species } from './lib/api';

const ALL_STATUSES = 'All statuses';

function App() {
  const [biomes, setBiomes] = useState<BiomeSummary[]>([]);
  const [selectedBiomeSlug, setSelectedBiomeSlug] = useState('cold');
  const [data, setData] = useState<BiomeData | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(ALL_STATUSES);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBiomes = async () => {
      try {
        const result = await getBiomes();
        setBiomes(result.biomes);

        if (result.biomes.length > 0) {
          setSelectedBiomeSlug(result.biomes[0].slug);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch biomes');
      }
    };

    fetchBiomes();
  }, []);

  useEffect(() => {
    const fetchBiomeData = async () => {
      try {
        setLoading(true);
        const result = await getBiome(selectedBiomeSlug);
        setData(result);
        setSelectedStatus(ALL_STATUSES);
        setSelectedSpecies(null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch biome data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBiomeData();
  }, [selectedBiomeSlug]);

  const statusOptions = useMemo(() => {
    const statuses = new Set(data?.species.map((species) => species.status) || []);
    return [ALL_STATUSES, ...Array.from(statuses).sort()];
  }, [data]);

  const filteredSpecies = useMemo(() => {
    if (!data) {
      return [];
    }

    if (selectedStatus === ALL_STATUSES) {
      return data.species;
    }

    return data.species.filter((species) => species.status === selectedStatus);
  }, [data, selectedStatus]);

  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();

    data?.species.forEach((species) => {
      counts.set(species.status, (counts.get(species.status) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const maxStatusCount = Math.max(...statusCounts.map((item) => item.count), 1);
  const isLiveData = data?.dataSource === 'gbif-live';

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <section className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-red-100 text-center">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Unable to Load Data</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors font-semibold"
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-gradient-to-r from-teal-800 via-cyan-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-100">Eco Watch</p>
              <h1 className="mt-2 text-4xl font-bold">Biodiversity Dashboard</h1>
              <p className="mt-3 max-w-3xl text-cyan-50">
                Explore species across cold, rainforest, desert, and ocean biomes with curated conservation context and GBIF taxonomy enrichment.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                isLiveData ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isLiveData ? 'Live GBIF taxonomy' : 'Fallback curated data'}
              </span>
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
                {data ? `${data.totalSpecies} species loaded` : 'Loading species'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {biomes.map((biome) => (
            <button
              key={biome.slug}
              onClick={() => setSelectedBiomeSlug(biome.slug)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                selectedBiomeSlug === biome.slug
                  ? 'bg-teal-700 text-white shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
              }`}
            >
              {biome.name}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingDashboard />
        ) : data ? (
          <>
            <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-950">{data.name}</h2>
                    <p className="mt-2 text-slate-600">{data.summary}</p>
                    <p className="mt-3 text-sm text-slate-500">
                      <span className="font-semibold text-slate-700">Climate:</span> {data.climate}
                    </p>
                  </div>
                  <label className="block min-w-56">
                    <span className="text-sm font-semibold text-slate-700">Filter by status</span>
                    <select
                      value={selectedStatus}
                      onChange={(event) => setSelectedStatus(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    >
                      {statusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <StatusChart statusCounts={statusCounts} maxStatusCount={maxStatusCount} />
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredSpecies.map((species) => (
                <SpeciesCard
                  key={species.id}
                  species={species}
                  onSelect={() => setSelectedSpecies(species)}
                />
              ))}
            </section>

            {filteredSpecies.length === 0 && (
              <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
                No species match this conservation status.
              </div>
            )}

            <footer className="mt-8 text-center text-sm text-slate-500 space-y-1">
              <p>{data.statusSource}</p>
              <p>{data.source}</p>
              <p>Last refreshed: {new Date(data.generatedAt).toLocaleString()}</p>
            </footer>
          </>
        ) : null}
      </section>

      {selectedSpecies && (
        <SpeciesModal
          species={selectedSpecies}
          onClose={() => setSelectedSpecies(null)}
        />
      )}
    </main>
  );
}

function LoadingDashboard() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-52 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
          <div className="mt-4 h-6 w-36 rounded bg-slate-200 animate-pulse" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100 animate-pulse" />
          <div className="mt-2 h-3 w-5/6 rounded bg-slate-100 animate-pulse" />
          <div className="mt-8 h-9 w-full rounded bg-slate-100 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function StatusChart({
  statusCounts,
  maxStatusCount
}: {
  statusCounts: Array<{ status: string; count: number }>;
  maxStatusCount: number;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">Species by Status</h2>
      <div className="mt-4 space-y-3">
        {statusCounts.map((item) => (
          <div key={item.status}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item.status}</span>
              <span className="text-slate-500">{item.count}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600"
                style={{ width: `${Math.max((item.count / maxStatusCount) * 100, 8)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeciesCard({ species, onSelect }: { species: Species; onSelect: () => void }) {
  return (
    <article className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(species.status)}`}>
            {species.status}
          </span>
          <h3 className="mt-4 text-xl font-bold text-slate-950">{species.name}</h3>
          <p className="mt-1 text-sm italic text-slate-500">{species.scientificName}</p>
        </div>
        <span className="text-3xl" aria-hidden="true">{getSpeciesEmoji(species.name)}</span>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-slate-700">Habitat</dt>
          <dd className="text-slate-600">{species.habitat}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-700">Population Trend</dt>
          <dd className="text-slate-600">{species.populationTrend}</dd>
        </div>
      </dl>

      <button
        onClick={onSelect}
        className="mt-auto w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
      >
        View Details
      </button>
    </article>
  );
}

function SpeciesModal({ species, onClose }: { species: Species; onClose: () => void }) {
  const taxonomyEntries = Object.entries(species.taxonomy || {}).filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(species.status)}`}>
                {species.status}
              </span>
              <h2 className="mt-3 text-3xl font-bold text-slate-950">{species.name}</h2>
              <p className="text-slate-500 italic">{species.scientificName}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-slate-200 px-3 py-1 text-xl leading-none text-slate-600 hover:bg-slate-100"
              aria-label="Close species details"
            >
              x
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <InfoBlock title="Region" value={species.region} />
          <InfoBlock title="Habitat" value={species.habitat} />
          <InfoBlock title="Diet" value={species.diet} />
          <InfoBlock title="Population Trend" value={species.populationTrend} />

          <div className="md:col-span-2">
            <h3 className="font-bold text-slate-800">Main Threats</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {species.threats.map((threat) => (
                <span key={threat} className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-800">
                  {threat}
                </span>
              ))}
            </div>
          </div>

          {taxonomyEntries.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="font-bold text-slate-800">Taxonomy</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {taxonomyEntries.map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
                    <p className="text-sm text-slate-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h3 className="font-bold text-slate-800">{title}</h3>
      <p className="mt-1 text-slate-600">{value}</p>
    </div>
  );
}

function getStatusColor(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes('critically')) {
    return 'bg-red-100 text-red-900 border-red-200';
  }

  if (normalizedStatus.includes('endangered')) {
    return 'bg-red-50 text-red-800 border-red-200';
  }

  if (normalizedStatus.includes('vulnerable')) {
    return 'bg-orange-100 text-orange-800 border-orange-200';
  }

  if (normalizedStatus.includes('threatened')) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }

  if (normalizedStatus.includes('least concern')) {
    return 'bg-green-100 text-green-800 border-green-200';
  }

  return 'bg-slate-100 text-slate-800 border-slate-200';
}

function getSpeciesEmoji(name: string) {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('bear')) return '🐻‍❄️';
  if (lowerName.includes('fox')) return '🦊';
  if (lowerName.includes('owl')) return '🦉';
  if (lowerName.includes('penguin')) return '🐧';
  if (lowerName.includes('walrus') || lowerName.includes('seal')) return '🦭';
  if (lowerName.includes('whale') || lowerName.includes('narwhal')) return '🐋';
  if (lowerName.includes('muskox') || lowerName.includes('camel')) return '🐪';
  if (lowerName.includes('jaguar')) return '🐆';
  if (lowerName.includes('orangutan')) return '🦧';
  if (lowerName.includes('eagle') || lowerName.includes('macaw')) return '🦜';
  if (lowerName.includes('frog')) return '🐸';
  if (lowerName.includes('sloth')) return '🦥';
  if (lowerName.includes('anaconda') || lowerName.includes('sidewinder')) return '🐍';
  if (lowerName.includes('turtle') || lowerName.includes('tortoise')) return '🐢';
  if (lowerName.includes('shark')) return '🦈';
  if (lowerName.includes('octopus')) return '🐙';
  if (lowerName.includes('ray')) return '🐟';
  if (lowerName.includes('coral')) return '🪸';
  if (lowerName.includes('seahorse')) return '🌊';

  return '🌿';
}

export default App;
