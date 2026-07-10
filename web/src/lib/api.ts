const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface HealthResponse {
  ok: boolean;
}

export interface Species {
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

export interface BiomeData {
  slug: string;
  name: string;
  summary: string;
  climate: string;
  source: string;
  statusSource: string;
  dataSource: 'gbif-live' | 'curated-fallback';
  totalSpecies: number;
  generatedAt: string;
  species: Species[];
}

export interface BiomeSummary {
  slug: string;
  name: string;
  summary: string;
  climate: string;
  totalSpecies: number;
}

export interface BiomesResponse {
  totalBiomes: number;
  biomes: BiomeSummary[];
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>('/api/health');
}

export async function getBiomes(): Promise<BiomesResponse> {
  return request<BiomesResponse>('/api/biomes');
}

export async function getBiome(slug: string): Promise<BiomeData> {
  return request<BiomeData>(`/api/biomes/${slug}`);
}
