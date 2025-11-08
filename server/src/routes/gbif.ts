import { Router, Request, Response } from 'express';

const router = Router();

interface GBIFSpeciesResult {
  key?: number;
  scientificName?: string;
  canonicalName?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
}

interface SpeciesData {
  name: string;
  scientificName: string;
  kingdom: string;
  class: string;
}

// Species to fetch from GBIF
const COLD_BIOME_SPECIES = [
  'Ursus maritimus',      // Polar Bear
  'Vulpes lagopus',       // Arctic Fox
  'Aptenodytes forsteri'  // Emperor Penguin
];

const SPECIES_COMMON_NAMES: { [key: string]: string } = {
  'Ursus maritimus': 'Polar Bear',
  'Vulpes lagopus': 'Arctic Fox',
  'Aptenodytes forsteri': 'Emperor Penguin'
};

// Fetch species data from GBIF API
async function fetchSpeciesFromGBIF(scientificName: string): Promise<SpeciesData | null> {
  try {
    const response = await fetch(
      `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`
    );

    if (!response.ok) {
      console.error(`GBIF API error for ${scientificName}: ${response.status}`);
      return null;
    }

    const data = await response.json() as GBIFSpeciesResult;

    return {
      name: SPECIES_COMMON_NAMES[scientificName] || data.canonicalName || scientificName,
      scientificName: data.scientificName || scientificName,
      kingdom: data.kingdom || 'Unknown',
      class: data.class || 'Unknown'
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
    const speciesPromises = COLD_BIOME_SPECIES.map(scientificName => 
      fetchSpeciesFromGBIF(scientificName)
    );

    const results = await Promise.all(speciesPromises);

    // Filter out any null results (failed fetches)
    const species = results.filter((s): s is SpeciesData => s !== null);

    if (species.length === 0) {
      return res.status(503).json({ 
        error: 'Failed to fetch species data from GBIF' 
      });
    }

    res.json({
      biome: 'Cold Biome',
      source: 'GBIF (Global Biodiversity Information Facility)',
      species
    });
  } catch (error) {
    console.error('Error in GBIF route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch biome data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;