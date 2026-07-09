import { Router, Request, Response } from 'express';

const router = Router();
const GBIF_TIMEOUT_MS = Number(process.env.GBIF_TIMEOUT_MS || 4000);
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 1000 * 60 * 30);

type DataSource = 'gbif-live' | 'curated-fallback';

interface GBIFSearchResult {
  results?: Array<{
    key?: number;
    scientificName?: string;
    canonicalName?: string;
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
  }>;
}

interface SpeciesData {
  name: string;
  scientificName: string;
  status: string;
  taxonomy?: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
  };
}

interface BiomeResponse {
  biome: string;
  source: string;
  statusSource: string;
  dataSource: DataSource;
  totalSpecies: number;
  generatedAt: string;
  species: SpeciesData[];
}

// Species configuration with common names and conservation status
const COLD_BIOME_SPECIES = [
  {
    scientificName: 'Ursus maritimus',
    commonName: 'Polar Bear',
    status: 'Vulnerable'
  },
  {
    scientificName: 'Vulpes lagopus',
    commonName: 'Arctic Fox',
    status: 'Least Concern'
  },
  {
    scientificName: 'Bubo scandiacus',
    commonName: 'Snowy Owl',
    status: 'Vulnerable'
  },
  {
    scientificName: 'Aptenodytes forsteri',
    commonName: 'Emperor Penguin',
    status: 'Near Threatened'
  },
  {
    scientificName: 'Odobenus rosmarus',
    commonName: 'Walrus',
    status: 'Vulnerable'
  },
  {
    scientificName: 'Delphinapterus leucas',
    commonName: 'Beluga Whale',
    status: 'Least Concern'
  },
  {
    scientificName: 'Monodon monoceros',
    commonName: 'Narwhal',
    status: 'Least Concern'
  },
  {
    scientificName: 'Balaenoptera musculus',
    commonName: 'Blue Whale',
    status: 'Endangered'
  },
  {
    scientificName: 'Hydrurga leptonyx',
    commonName: 'Leopard Seal',
    status: 'Least Concern'
  },
  {
    scientificName: 'Ovibos moschatus',
    commonName: 'Muskox',
    status: 'Least Concern'
  }
];

let cachedResponse: { expiresAt: number; payload: BiomeResponse } | null = null;

function curatedSpecies(): SpeciesData[] {
  return COLD_BIOME_SPECIES.map((species) => ({
    name: species.commonName,
    scientificName: species.scientificName,
    status: species.status
  }));
}

// Fetch species data from GBIF API
async function fetchSpeciesFromGBIF(
  scientificName: string,
  commonName: string,
  status: string
): Promise<SpeciesData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GBIF_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(scientificName)}&limit=1`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      console.error(`GBIF API error for ${scientificName}: ${response.status}`);
      return null;
    }

    const data = await response.json() as GBIFSearchResult;

    // Get the first result from search
    const firstResult = data.results?.[0];

    if (!firstResult) {
      console.error(`No results found for ${scientificName}`);
      return null;
    }

    return {
      name: commonName,
      scientificName: firstResult.scientificName || scientificName,
      status,
      taxonomy: {
        kingdom: firstResult.kingdom,
        phylum: firstResult.phylum,
        class: firstResult.class,
        order: firstResult.order,
        family: firstResult.family,
        genus: firstResult.genus
      }
    };
  } catch (error) {
    console.error(`Error fetching ${scientificName} from GBIF:`, error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// GET /api/biomes/cold - Returns cold biome species from GBIF
router.get('/', async (req: Request, res: Response) => {
  try {
    const now = Date.now();

    if (cachedResponse && cachedResponse.expiresAt > now) {
      return res.json(cachedResponse.payload);
    }

    const speciesPromises = COLD_BIOME_SPECIES.map(species => 
      fetchSpeciesFromGBIF(species.scientificName, species.commonName, species.status)
    );

    const results = await Promise.all(speciesPromises);
    const species = results.filter((s): s is SpeciesData => s !== null);
    const dataSource: DataSource = species.length === COLD_BIOME_SPECIES.length
      ? 'gbif-live'
      : 'curated-fallback';
    const responseSpecies = dataSource === 'gbif-live' ? species : curatedSpecies();

    const payload: BiomeResponse = {
      biome: 'Cold Biome',
      source: dataSource === 'gbif-live'
        ? 'GBIF taxonomy enriched with curated conservation statuses'
        : 'Curated fallback species list',
      statusSource: 'Conservation statuses are curated for this demo.',
      dataSource,
      totalSpecies: responseSpecies.length,
      generatedAt: new Date().toISOString(),
      species: responseSpecies
    };

    cachedResponse = {
      expiresAt: now + CACHE_TTL_MS,
      payload
    };

    res.json(payload);
  } catch (error) {
    console.error('Error in cold biome route:', error);
    const species = curatedSpecies();

    res.json({
      biome: 'Cold Biome',
      source: 'Curated fallback species list',
      statusSource: 'Conservation statuses are curated for this demo.',
      dataSource: 'curated-fallback',
      totalSpecies: species.length,
      generatedAt: new Date().toISOString(),
      species
    } satisfies BiomeResponse);
  }
});

export default router;
