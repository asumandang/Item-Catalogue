export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slug: string;
}

export type ItemCreateInput = Omit<Item, 'id'>;
