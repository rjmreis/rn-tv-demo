export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  poster?: string;
  streamUrl: string;
  duration: number;
  genre?: string;
}

export interface Catalog {
  catalog: CatalogItem[];
}
