//all the data stored on the word generated
export interface Word {
    name: string;
    definition: string;
    examples: string[];
    synonyms: string[];
    antonyms: string[];
    history: string[] | null;
    lastUpdated: string;
    createdOn: number;
    imgs: string[]; //urls of all the images
    model: string;
  }
  
  export interface SearchResults {
    name: string;
  }
  
 //all data needed to render /word/{WORD} route
  export interface WordPageData {
    wordData: Word;
    paginationLinks: string[];
  }