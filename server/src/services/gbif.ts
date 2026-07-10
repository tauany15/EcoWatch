import { SpeciesConfig } from '../data/biomes';

const GBIF_TIMEOUT_MS = Number(process.env.GBIF_TIMEOUT_MS || 4000);

interface GBIFSearchResult {
  results?: Array<{
    scientificName?: string;
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
  }>;
}

export interface SpeciesData {
  id: string;
  name: string;
  scientificName: string;
  status: string;
  populationTrend: string;
  habitat: string;
  region: string;
  diet: string;
  threats: string[];
  taxonomy?: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
  };
}

export function toCuratedSpecies(species: SpeciesConfig): SpeciesData {
  return {
    id: species.id,
    name: species.commonName,
    scientificName: species.scientificName,
    status: species.status,
    populationTrend: species.populationTrend,
    habitat: species.habitat,
    region: species.region,
    diet: species.diet,
    threats: species.threats
  };
}

export async function fetchSpeciesFromGBIF(species: SpeciesConfig): Promise<SpeciesData | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GBIF_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(species.scientificName)}&limit=1`,
      { signal: controller.signal }
    );

    if (!response.ok) {
      console.error(`GBIF API error for ${species.scientificName}: ${response.status}`);
      return null;
    }

    const data = await response.json() as GBIFSearchResult;
    const firstResult = data.results?.[0];

    if (!firstResult) {
      console.error(`No GBIF result found for ${species.scientificName}`);
      return null;
    }

    return {
      ...toCuratedSpecies(species),
      scientificName: firstResult.scientificName || species.scientificName,
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
    console.error(`Error fetching ${species.scientificName} from GBIF:`, error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
