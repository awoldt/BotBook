import { SearchResults, Word } from "./types";
import { MongoClient } from "mongodb";
import { search } from "fast-fuzzy";
const DbClient = new MongoClient(process.env.MONGODB_CONNECTION_KEY!);
export const wordsCollection = DbClient.db(process.env.DB).collection<Word>(
  "words"
);

export async function DbConnect() {
  try {
    await DbClient.connect();
    console.log("successfully connected to database!");
  } catch (e) {
    console.log("could not connect to database");
  }
}

export async function GenerateNewWord(): Promise<string | null> {
  /* 
        This function fetches a random word from
        random word api

        will also check to make sure that word is
        not already stored in database
    */
  try {
    const data = await fetch("https://random-word-api.herokuapp.com/word");
    if (data.status === 200) {
      const word = await data.json();

      //make sure word is not already stored in database
      const w = await wordsCollection.find({ name: word[0] }).toArray();
      if (w.length === 0) {
        console.log(`the word ${word[0]} has been selected`);
        return word[0];
      } else {
        console.log("the word " + w + " is already stored in database");
        return null;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log("error while generating random word");
    return null;
  }
}

export async function GenerateWordDefinition(
  word: string
): Promise<string | null> {
  try {
    const data = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "Write a short detailed definition for the word " + word,
        max_tokens: 4000,
      }),
    });

    if (data.status === 200) {
      console.log(`generating definition for the word ${word}`);
      //return text with \n remvoed
      const definition = await data.json();

      /* 
      sometimes definitions generated have word with colon
      before the actual definition 

      ex - Distorted: pulled or twisted out of shape

      remove colon if it is present
      */

      if (definition.choices[0].text.split(":").length === 2) {
        return definition.choices[0].text
          .split("\n")
          .filter((x: string) => {
            return x !== "";
          })[0]
          .split(":")[1];
      } else {
        return definition.choices[0].text.split("\n").filter((x: string) => {
          return x !== "";
        })[0];
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function GenerateExampleSentences(
  word: string
): Promise<string[] | null> {
  /* 
    This function will generate 3 random
    example sentences using the word generated
  */
  try {
    const data = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "Write 3 sentences using using the word " + word,
        max_tokens: 4000,
      }),
    });
    if (data.status === 200) {
      console.log(`generating example sentences for the word ${word}`);
      const exampleSentenceData = await data.json();

      //return only the example sentences
      return exampleSentenceData.choices[0].text
        .split("\n")
        .filter((x: string) => {
          return x !== "";
        })
        .map((y: string) => {
          return y.substring(3, y.length);
        });
    } else {
      console.log(
        "error while generating exmaple sentences using the word " + word
      );
      return null;
    }
  } catch (e) {
    console.log(e);
    console.log(
      "error while generating exmaple sentences using the word " + word
    );
    return null;
  }
}

export async function SaveWordToDb(
  w: string,
  def: string,
  exampleSentences: string[],
  historyAndUse: string[] | null,
  synAndAnto: string[][],
  generatedImgs: string[]
): Promise<Word | null> {
  /* 
    This function will save word 
    along with definitions and exmaples to
    mongodb
  */
  try {
    let d = new Date().toISOString();

    const newWord: Word = {
      name: w,
      definition: def,
      examples: exampleSentences,
      synonyms: synAndAnto[0],
      antonyms: synAndAnto[1],
      history: historyAndUse,
      lastUpdated:
        d.substring(0, 10).split("-")[1] +
        "/" +
        d.substring(0, 10).split("-")[2] +
        "/" +
        d.substring(0, 10).split("-")[0],
      createdOn: Date.now(),
      imgs: generatedImgs,
      model: "text-davinci-003",
    };

    await wordsCollection.insertOne(newWord);

    return newWord;
  } catch (e) {
    console.log(e);
    console.log("error while saving word to database");
    return null;
  }
}

export async function GenerateSynonymsAndAntonyms(
  word: string
): Promise<string[][] | null> {
  try {
    const s = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "Write a comma seperated list of synonyms for the word " + word,
        max_tokens: 4000,
      }),
    });
    const a = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "Write a comma seperated list of antonyms for the word " + word,
        max_tokens: 4000,
      }),
    });

    if (s.status === 200 && a.status === 200) {
      console.log(`generating syn and anto for the word ${word}`);
      const sData = await s.json();
      const aData = await a.json();

      return [
        sData.choices[0].text
          .split("\n")
          .filter((x: string) => {
            return x !== "";
          })
          .join("")
          .split(",")

          .sort()
          .map((x: string) => {
            return x.charAt(0).toLowerCase() + x.slice(1);
          }),
        aData.choices[0].text
          .split("\n")
          .filter((x: string) => {
            return x !== "";
          })
          .join("")
          .split(",")

          .sort()
          .map((x: string) => {
            return x.charAt(0).toLowerCase() + x.slice(1);
          }),
      ];
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function FetchWordData(w: string): Promise<Word | null> {
  /* 
    This function will see if word user 
    is accessing through route (/word/[whatever_word])
    exists in database
  */
  try {
    const x = await wordsCollection.find({ name: w }).toArray();

    if (x.length !== 0) {
      //need to remove _id propery from mongo document (avoid serilization issues)
      const word: any = { ...x[0] };
      delete word._id;

      return word;
    } else {
      console.log("The word " + w + " does not exist in database");
      return null;
    }
  } catch (e) {
    console.log(e);
    console.log(
      "There was an error while searching for the word " +
        w +
        " in the database"
    );
    return null;
  }
}

export async function GenerateWordHistory(w: string): Promise<string[] | null> {
  /* 
    This function will generate a short description 
    on the history of the current word
  */
  try {
    const data = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "write about the history and use of the word " + w,
        max_tokens: 4000,
      }),
    });
    if (data.status === 200) {
      console.log(`generating history and use of the word ${w}`);
      const history: any = await data.json();
      return history.choices[0].text.split("\n").filter((x: string) => {
        return x !== "";
      });
    } else {
      console.log("error while generating history and use of the word " + w);
      return null;
    }
  } catch (e) {
    console.log(
      "there was an error while generating the history for the word " + w
    );
    return null;
  }
}

export async function Search(
  q: string
): Promise<SearchResults[] | undefined | null> {
  /* 
    This function will search for words
    in database based on user's query
  */
  try {
    //get entire collections of words to filter through
    const words = await wordsCollection.find().toArray();
    const results = search(q, words, { keySelector: (obj) => obj.name });

    //only want to return word name and part of speech
    const returnedResults = results.map((x) => {
      return {
        name: x.name,
      };
    });

    if (returnedResults.length === 0) {
      return undefined;
    } else {
      return returnedResults;
    }
  } catch (e) {
    console.log(e);
    console.log("error while searching for words with query " + q);
    return null;
  }
}

export async function GetRecentlyAddedWords(): Promise<Word[] | null> {
  try {
    const words = await wordsCollection
      .find({}, { projection: { _id: 0 } })
      .limit(5)
      .sort({ _id: -1 })
      .toArray();

    return words;
  } catch (e) {
    console.log(e);
    console.log("error, could not get recently added words");
    return null;
  }
}

export async function GenerateImage(word: string): Promise<string[] | null> {
  /* 
    This function will generate an image
    based on the word 

    This image will then be uploaded to 
    google cloud storage bucket and 
    connected to a load balancer that
    can access these images through our 
    custom domain
  */
  try {
    //this will generate 3 images
    const data = await fetch("https://api.openai.com/v1/images/generations", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: word,
        n: 3,
        size: "256x256",
      }),
    });
    if (data.status === 200) {
      console.log(
        `generating images for the word ${word} and storing in google cloud`
      );
      const imageData = await data.json();

      /* 
      Once image has been successfully generated, 
      upload image to google cloud storage
      
      */
      try {
        for (let i = 0; i < imageData.data.length; ++i) {
          const googleUploadImage = await fetch(process.env.IMAGE_UPLOAD_URL!, {
            method: "post",
            body: JSON.stringify({
              url: imageData.data[i].url,
              word: `${word}_${i}`,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (googleUploadImage.status === 200) {
            console.log("successfully uploded image to google cloud");
          } else {
            console.log("could not upload image to google cloud :(");
          }
        }

        return imageData.data.map((x: any, index: number) => {
          return `https://cdn.botbook.dev/${word}_${index}.png`;
        });
      } catch (e) {
        console.log(e);
        console.log("could not upload image to google cloud storage");
        return null;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    console.log("error while generating image");
    return null;
  }
}

export async function GenerateSitemap(): Promise<string | null> {
  try {
    //get all words in database
    const words = await await wordsCollection
      .find()
      .sort({ name: 1 })
      .toArray();

    //make custom xml string
    let xmlStr: string = "";
    for (let index = 0; index < words.length; index++) {
      xmlStr += `<url><loc>https://botbook.dev/word/${words[index].name}</loc></url>`;
    }

    return xmlStr;
  } catch (e) {
    console.log(e);
    console.log("error while generating sitemap");
    return null;
  }
}
