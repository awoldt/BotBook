//all the data stored for the word generated
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

/* 
All the data needed for the [word].tsx dynamic route
contains data on word along with pagination data
*/
export interface WordPageData {
  wordData: Word;
  paginationLinks: string[];
}
