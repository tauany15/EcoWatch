import { Router, Request, Response } from 'express';
import { BIOMES, BiomeConfig, getBiomeBySlug } from '../data/biomes';
import { fetchSpeciesFromGBIF, SpeciesData, toCuratedSpecies } from '../services/gbif';

const router = Router();
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 1000 * 60 * 30);

type DataSource = 'gbif-live' | 'curated-fallback';

interface BiomeSummary {
  slug: string;
  name: string;
  summary: string;
  climate: string;
  totalSpecies: number;
}

interface BiomeResponse extends BiomeSummary {
  source: string;
  statusSource: string;
  dataSource: DataSource;
  generatedAt: string;
  species: SpeciesData[];
}

const cachedResponses = new Map<string, { expiresAt: number; payload: BiomeResponse }>();

function summarizeBiome(biome: BiomeConfig): BiomeSummary {
  return {
    slug: biome.slug,
    name: biome.name,
    summary: biome.summary,
    climate: biome.climate,
    totalSpecies: biome.species.length
  };
}

function curatedSpeciesForBiome(biome: BiomeConfig): SpeciesData[] {
  return biome.species.map(toCuratedSpecies);
}

async function buildBiomeResponse(biome: BiomeConfig): Promise<BiomeResponse> {
  const now = Date.now();
  const cached = cachedResponses.get(biome.slug);

  if (cached && cached.expiresAt > now) {
    return cached.payload;
  }

  const liveResults = await Promise.all(biome.species.map(fetchSpeciesFromGBIF));
  const liveSpecies = liveResults.filter((species): species is SpeciesData => species !== null);
  const dataSource: DataSource = liveSpecies.length === biome.species.length
    ? 'gbif-live'
    : 'curated-fallback';
  const species = dataSource === 'gbif-live' ? liveSpecies : curatedSpeciesForBiome(biome);

  const payload: BiomeResponse = {
    ...summarizeBiome(biome),
    source: dataSource === 'gbif-live'
      ? 'GBIF taxonomy enriched with curated conservation details'
      : 'Curated fallback species list',
    statusSource: 'Conservation statuses and ecological details are curated for this app.',
    dataSource,
    generatedAt: new Date().toISOString(),
    species
  };

  cachedResponses.set(biome.slug, {
    expiresAt: now + CACHE_TTL_MS,
    payload
  });

  return payload;
}

router.get('/', (req: Request, res: Response) => {
  res.json({
    totalBiomes: BIOMES.length,
    biomes: BIOMES.map(summarizeBiome)
  });
});

router.get('/:slug', async (req: Request, res: Response) => {
  const biome = getBiomeBySlug(req.params.slug);

  if (!biome) {
    return res.status(404).json({
      error: 'Biome not found',
      availableBiomes: BIOMES.map((item) => item.slug)
    });
  }

  try {
    res.json(await buildBiomeResponse(biome));
  } catch (error) {
    console.error(`Error building ${biome.slug} biome response:`, error);

    res.json({
      ...summarizeBiome(biome),
      source: 'Curated fallback species list',
      statusSource: 'Conservation statuses and ecological details are curated for this app.',
      dataSource: 'curated-fallback',
      generatedAt: new Date().toISOString(),
      species: curatedSpeciesForBiome(biome)
    } satisfies BiomeResponse);
  }
});

export default router;
