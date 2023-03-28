//what is stored in mongodb
export interface Word {
  name: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  history: string[] | null;
  lastUpdated: string;
  createdOn: number;
  imgs: string[];
  model: string;
}

export interface SearchResults {
  name: string;
}
