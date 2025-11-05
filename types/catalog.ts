export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  poster?: string;
  streamUrl: string;
  duration: number | string;
  genre?: string;
}

export interface Catalog {
  catalog: CatalogItem[];
}
