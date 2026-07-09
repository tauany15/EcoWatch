const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface HealthResponse {
  ok: boolean;
}

export interface Species {
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

export interface BiomeData {
  biome: string;
  source: string;
  statusSource: string;
  dataSource: 'gbif-live' | 'curated-fallback';
  totalSpecies: number;
  generatedAt: string;
  species: Species[];
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

export async function getColdBiome(): Promise<BiomeData> {
  return request<BiomeData>('/api/biomes/cold');
}
