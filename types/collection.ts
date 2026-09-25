export interface HomeCollectionItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  link: string;
  active: boolean;
  order: number;
}

export interface CollectionsSectionHeader {
  tag: string;
  title: string;
}
