import { Router, Request, Response } from 'express';

const router = Router();

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

// Fetch species data from GBIF API
async function fetchSpeciesFromGBIF(
  scientificName: string,
  commonName: string,
  status: string
): Promise<SpeciesData | null> {
  try {
    const response = await fetch(
      `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(scientificName)}`
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
      status: status
    };
  } catch (error) {
    console.error(`Error fetching ${scientificName} from GBIF:`, error);
    return null;
  }
}

// GET /api/biomes/cold - Returns cold biome species from GBIF
router.get('/', async (req: Request, res: Response) => {
  try {
    // Fetch all species in parallel
    const speciesPromises = COLD_BIOME_SPECIES.map(species => 
      fetchSpeciesFromGBIF(species.scientificName, species.commonName, species.status)
    );

    const results = await Promise.all(speciesPromises);

    // Filter out any null results (failed fetches)
    const species = results.filter((s): s is SpeciesData => s !== null);

    if (species.length === 0) {
      return res.status(503).json({ 
        error: 'Failed to fetch species data from GBIF',
        message: 'Unable to retrieve biodiversity data at this time'
      });
    }

    res.json({
      biome: 'Cold Biome',
      source: 'GBIF (Global Biodiversity Information Facility)',
      totalSpecies: species.length,
      species
    });
  } catch (error) {
    console.error('Error in cold biome route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch biome data',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router;