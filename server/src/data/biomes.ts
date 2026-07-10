export type PopulationTrend = 'Increasing' | 'Stable' | 'Decreasing' | 'Unknown';

export interface SpeciesConfig {
  id: string;
  scientificName: string;
  commonName: string;
  status: string;
  populationTrend: PopulationTrend;
  habitat: string;
  region: string;
  diet: string;
  threats: string[];
}

export interface BiomeConfig {
  slug: string;
  name: string;
  summary: string;
  climate: string;
  species: SpeciesConfig[];
}

export const BIOMES: BiomeConfig[] = [
  {
    slug: 'cold',
    name: 'Cold Biome',
    summary: 'Polar and subpolar ecosystems shaped by ice, seasonal extremes, and highly specialized wildlife.',
    climate: 'Long winters, short summers, low temperatures, and strong seasonal light shifts.',
    species: [
      {
        id: 'polar-bear',
        scientificName: 'Ursus maritimus',
        commonName: 'Polar Bear',
        status: 'Vulnerable',
        populationTrend: 'Decreasing',
        habitat: 'Arctic sea ice and coastal tundra',
        region: 'Arctic Circle',
        diet: 'Seals and marine mammals',
        threats: ['Sea ice loss', 'Climate change', 'Pollution']
      },
      {
        id: 'arctic-fox',
        scientificName: 'Vulpes lagopus',
        commonName: 'Arctic Fox',
        status: 'Least Concern',
        populationTrend: 'Stable',
        habitat: 'Tundra and coastal ice edges',
        region: 'Arctic tundra',
        diet: 'Small mammals, birds, eggs, and carrion',
        threats: ['Warming climate', 'Habitat shifts', 'Competition from red foxes']
      },
      {
        id: 'snowy-owl',
        scientificName: 'Bubo scandiacus',
        commonName: 'Snowy Owl',
        status: 'Vulnerable',
        populationTrend: 'Decreasing',
        habitat: 'Open tundra and winter grasslands',
        region: 'Arctic tundra and northern temperate zones',
        diet: 'Lemmings, small mammals, and birds',
        threats: ['Prey decline', 'Climate change', 'Collisions']
      },
      {
        id: 'emperor-penguin',
        scientificName: 'Aptenodytes forsteri',
        commonName: 'Emperor Penguin',
        status: 'Near Threatened',
        populationTrend: 'Decreasing',
        habitat: 'Antarctic sea ice',
        region: 'Antarctica',
        diet: 'Fish, krill, and squid',
        threats: ['Sea ice loss', 'Ocean warming', 'Food web disruption']
      },
      {
        id: 'walrus',
        scientificName: 'Odobenus rosmarus',
        commonName: 'Walrus',
        status: 'Vulnerable',
        populationTrend: 'Unknown',
        habitat: 'Shallow Arctic seas and ice floes',
        region: 'Arctic Ocean',
        diet: 'Clams and benthic invertebrates',
        threats: ['Sea ice loss', 'Shipping disturbance', 'Industrial activity']
      },
      {
        id: 'beluga-whale',
        scientificName: 'Delphinapterus leucas',
        commonName: 'Beluga Whale',
        status: 'Least Concern',
        populationTrend: 'Unknown',
        habitat: 'Arctic and subarctic coastal waters',
        region: 'Arctic and northern seas',
        diet: 'Fish, squid, and crustaceans',
        threats: ['Noise pollution', 'Contaminants', 'Habitat disturbance']
      },
      {
        id: 'narwhal',
        scientificName: 'Monodon monoceros',
        commonName: 'Narwhal',
        status: 'Least Concern',
        populationTrend: 'Unknown',
        habitat: 'Deep Arctic waters and pack ice',
        region: 'Canadian Arctic, Greenland, and Russia',
        diet: 'Fish, squid, and shrimp',
        threats: ['Sea ice change', 'Noise pollution', 'Shipping']
      },
      {
        id: 'muskox',
        scientificName: 'Ovibos moschatus',
        commonName: 'Muskox',
        status: 'Least Concern',
        populationTrend: 'Stable',
        habitat: 'Arctic tundra and rocky uplands',
        region: 'Greenland, Canada, and Alaska',
        diet: 'Grasses, sedges, mosses, and lichens',
        threats: ['Disease', 'Extreme weather', 'Habitat change']
      }
    ]
  },
  {
    slug: 'rainforest',
    name: 'Tropical Rainforest',
    summary: 'Dense, humid forests with exceptional biodiversity and complex canopy layers.',
    climate: 'Warm, wet, and humid year-round with high annual rainfall.',
    species: [
      {
        id: 'jaguar',
        scientificName: 'Panthera onca',
        commonName: 'Jaguar',
        status: 'Near Threatened',
        populationTrend: 'Decreasing',
        habitat: 'Rainforests, wetlands, and dense woodland',
        region: 'Central and South America',
        diet: 'Deer, capybara, caiman, and fish',
        threats: ['Deforestation', 'Habitat fragmentation', 'Human conflict']
      },
      {
        id: 'orangutan',
        scientificName: 'Pongo pygmaeus',
        commonName: 'Bornean Orangutan',
        status: 'Critically Endangered',
        populationTrend: 'Decreasing',
        habitat: 'Lowland and peat swamp forests',
        region: 'Borneo',
        diet: 'Fruit, leaves, bark, and insects',
        threats: ['Palm oil expansion', 'Logging', 'Illegal hunting']
      },
      {
        id: 'harpy-eagle',
        scientificName: 'Harpia harpyja',
        commonName: 'Harpy Eagle',
        status: 'Vulnerable',
        populationTrend: 'Decreasing',
        habitat: 'Mature tropical forests',
        region: 'Central and South America',
        diet: 'Sloths, monkeys, and large birds',
        threats: ['Forest loss', 'Hunting', 'Low reproductive rate']
      },
      {
        id: 'poison-dart-frog',
        scientificName: 'Dendrobates tinctorius',
        commonName: 'Dyeing Poison Dart Frog',
        status: 'Least Concern',
        populationTrend: 'Stable',
        habitat: 'Humid forest floors near streams',
        region: 'Guiana Shield',
        diet: 'Ants, termites, and tiny arthropods',
        threats: ['Habitat loss', 'Disease', 'Pet trade pressure']
      },
      {
        id: 'three-toed-sloth',
        scientificName: 'Bradypus variegatus',
        commonName: 'Brown-Throated Sloth',
        status: 'Least Concern',
        populationTrend: 'Stable',
        habitat: 'Canopy forests',
        region: 'Central and South America',
        diet: 'Leaves and shoots',
        threats: ['Deforestation', 'Road collisions', 'Forest fragmentation']
      },
      {
        id: 'green-anaconda',
        scientificName: 'Eunectes murinus',
        commonName: 'Green Anaconda',
        status: 'Least Concern',
        populationTrend: 'Unknown',
        habitat: 'Swamps, marshes, and slow rivers',
        region: 'Amazon and Orinoco basins',
        diet: 'Fish, birds, mammals, and reptiles',
        threats: ['Wetland degradation', 'Persecution', 'Illegal trade']
      },
      {
        id: 'scarlet-macaw',
        scientificName: 'Ara macao',
        commonName: 'Scarlet Macaw',
        status: 'Least Concern',
        populationTrend: 'Decreasing',
        habitat: 'Tall tropical forests and forest edges',
        region: 'Central and South America',
        diet: 'Seeds, nuts, fruit, and flowers',
        threats: ['Pet trade', 'Nest poaching', 'Forest loss']
      },
      {
        id: 'okapi',
        scientificName: 'Okapia johnstoni',
        commonName: 'Okapi',
        status: 'Endangered',
        populationTrend: 'Decreasing',
        habitat: 'Dense lowland rainforest',
        region: 'Democratic Republic of the Congo',
        diet: 'Leaves, buds, grasses, and fungi',
        threats: ['Habitat loss', 'Mining pressure', 'Poaching']
      }
    ]
  },
  {
    slug: 'desert',
    name: 'Desert',
    summary: 'Dry landscapes where species survive heat, water scarcity, and dramatic day-night swings.',
    climate: 'Very low rainfall, intense sun, and large temperature changes between day and night.',
    species: [
      {
        id: 'fennec-fox',
        scientificName: 'Vulpes zerda',
        commonName: 'Fennec Fox',
        status: 'Least Concern',
        populationTrend: 'Stable',
        habitat: 'Sandy deserts and dunes',
        region: 'Sahara and North Africa',
        diet: 'Insects, rodents, birds, eggs, and fruit',
        threats: ['Pet trade', 'Habitat disturbance', 'Human expansion']
      },
      {
        id: 'addax',
        scientificName: 'Addax nasomaculatus',
        commonName: 'Addax',
        status: 'Critically Endangered',
        populationTrend: 'Decreasing',
        habitat: 'Sahara desert grasslands and dunes',
        region: 'Sahara',
        diet: 'Desert grasses, herbs, and shrubs',
        threats: ['Hunting', 'Oil exploration', 'Drought']
      },
      {
        id: 'dromedary',
        scientificName: 'Camelus dromedarius',
        commonName: 'Dromedary Camel',
        status: 'Domesticated',
        populationTrend: 'Stable',
        habitat: 'Arid and semi-arid lands',
        region: 'North Africa, Middle East, and Australia',
        diet: 'Dry grasses, thorny plants, and shrubs',
        threats: ['Water scarcity', 'Overgrazing pressure', 'Heat stress']
      },
      {
        id: 'gila-monster',
        scientificName: 'Heloderma suspectum',
        commonName: 'Gila Monster',
        status: 'Near Threatened',
        populationTrend: 'Decreasing',
        habitat: 'Desert scrub and rocky foothills',
        region: 'Southwestern United States and northern Mexico',
        diet: 'Eggs, small mammals, birds, and reptiles',
        threats: ['Habitat loss', 'Road mortality', 'Illegal collection']
      },
      {
        id: 'meerkat',
        scientificName: 'Suricata suricatta',
        commonName: 'Meerkat',
        status: 'Least Concern',
        populationTrend: 'Stable',
        habitat: 'Dry savanna and desert plains',
        region: 'Southern Africa',
        diet: 'Insects, scorpions, small reptiles, and roots',
        threats: ['Drought', 'Predation', 'Habitat change']
      },
      {
        id: 'desert-tortoise',
        scientificName: 'Gopherus agassizii',
        commonName: 'Mojave Desert Tortoise',
        status: 'Critically Endangered',
        populationTrend: 'Decreasing',
        habitat: 'Creosote scrub and desert washes',
        region: 'Mojave and Sonoran deserts',
        diet: 'Wildflowers, grasses, and cactus pads',
        threats: ['Habitat fragmentation', 'Disease', 'Vehicle strikes']
      },
      {
        id: 'sidewinder',
        scientificName: 'Crotalus cerastes',
        commonName: 'Sidewinder',
        status: 'Least Concern',
        populationTrend: 'Stable',
        habitat: 'Loose desert sand and dunes',
        region: 'Southwestern United States and Mexico',
        diet: 'Lizards, rodents, and small birds',
        threats: ['Habitat disturbance', 'Road mortality', 'Persecution']
      },
      {
        id: 'kangaroo-rat',
        scientificName: 'Dipodomys deserti',
        commonName: 'Desert Kangaroo Rat',
        status: 'Least Concern',
        populationTrend: 'Stable',
        habitat: 'Sandy desert flats',
        region: 'North American deserts',
        diet: 'Seeds and dry vegetation',
        threats: ['Habitat conversion', 'Drought', 'Invasive plants']
      }
    ]
  },
  {
    slug: 'ocean',
    name: 'Ocean',
    summary: 'Marine ecosystems ranging from coral reefs to open seas, driven by currents and food webs.',
    climate: 'Highly variable by depth and latitude, with salinity, currents, and temperature shaping life.',
    species: [
      {
        id: 'green-sea-turtle',
        scientificName: 'Chelonia mydas',
        commonName: 'Green Sea Turtle',
        status: 'Endangered',
        populationTrend: 'Decreasing',
        habitat: 'Seagrass beds, reefs, and coastal waters',
        region: 'Tropical and subtropical oceans',
        diet: 'Seagrass and algae',
        threats: ['Bycatch', 'Plastic pollution', 'Nesting beach loss']
      },
      {
        id: 'clownfish',
        scientificName: 'Amphiprion ocellaris',
        commonName: 'Common Clownfish',
        status: 'Least Concern',
        populationTrend: 'Stable',
        habitat: 'Coral reefs and sea anemones',
        region: 'Indo-Pacific reefs',
        diet: 'Zooplankton, algae, and small invertebrates',
        threats: ['Coral bleaching', 'Aquarium trade', 'Ocean warming']
      },
      {
        id: 'great-white-shark',
        scientificName: 'Carcharodon carcharias',
        commonName: 'Great White Shark',
        status: 'Vulnerable',
        populationTrend: 'Unknown',
        habitat: 'Coastal and offshore waters',
        region: 'Temperate oceans worldwide',
        diet: 'Fish, seals, rays, and carrion',
        threats: ['Bycatch', 'Fin trade', 'Prey decline']
      },
      {
        id: 'humpback-whale',
        scientificName: 'Megaptera novaeangliae',
        commonName: 'Humpback Whale',
        status: 'Least Concern',
        populationTrend: 'Increasing',
        habitat: 'Open oceans and coastal feeding grounds',
        region: 'Worldwide oceans',
        diet: 'Krill and schooling fish',
        threats: ['Ship strikes', 'Entanglement', 'Noise pollution']
      },
      {
        id: 'blue-ringed-octopus',
        scientificName: 'Hapalochlaena lunulata',
        commonName: 'Greater Blue-Ringed Octopus',
        status: 'Not Evaluated',
        populationTrend: 'Unknown',
        habitat: 'Tide pools and shallow reefs',
        region: 'Indo-Pacific',
        diet: 'Crabs, shrimp, and small fish',
        threats: ['Reef degradation', 'Collection pressure', 'Coastal pollution']
      },
      {
        id: 'manta-ray',
        scientificName: 'Mobula birostris',
        commonName: 'Giant Manta Ray',
        status: 'Endangered',
        populationTrend: 'Decreasing',
        habitat: 'Open waters, reefs, and cleaning stations',
        region: 'Tropical and subtropical oceans',
        diet: 'Plankton',
        threats: ['Bycatch', 'Gill plate trade', 'Boat strikes']
      },
      {
        id: 'seahorse',
        scientificName: 'Hippocampus kuda',
        commonName: 'Spotted Seahorse',
        status: 'Vulnerable',
        populationTrend: 'Decreasing',
        habitat: 'Seagrass beds, mangroves, and reefs',
        region: 'Indo-Pacific coastal waters',
        diet: 'Tiny crustaceans and plankton',
        threats: ['Habitat loss', 'Curio trade', 'Bycatch']
      },
      {
        id: 'coral',
        scientificName: 'Acropora cervicornis',
        commonName: 'Staghorn Coral',
        status: 'Critically Endangered',
        populationTrend: 'Decreasing',
        habitat: 'Shallow tropical reefs',
        region: 'Caribbean and western Atlantic',
        diet: 'Photosynthetic algae and plankton',
        threats: ['Coral bleaching', 'Disease', 'Ocean acidification']
      }
    ]
  }
];

export function getBiomeBySlug(slug: string): BiomeConfig | undefined {
  return BIOMES.find((biome) => biome.slug === slug);
}
