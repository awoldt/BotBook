import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", ".env") });
import express from "express";
import compression from "compression";
import { engine, create } from "express-handlebars";
import {
  FetchWordData,
  GenerateExampleSentences,
  GenerateImage,
  GenerateNewWord,
  GenerateSitemap,
  GenerateSynonymsAndAntonyms,
  GenerateWordDefinition,
  GenerateWordHistory,
  GetRecentlyAddedWords,
  SaveWordToDb,
  wordsCollection,
} from "./functions";
import { Word, WordPageData } from "./types";

const customHelpers = create({
  helpers: {
    //capitalized the first letter of any string
    capitalize(word: string) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    },
  },
});

const app = express();
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "..", "views", "layouts"),
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "..", "views", "partials"),
    helpers: customHelpers.helpers,
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(compression());

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "index.html"));
});

app.get("/word", async (req, res) => {
  const n: number = (await wordsCollection.find().toArray()).length;
  const r: Word[] | null = await GetRecentlyAddedWords();
  res.render("wordExplore", {
    title: "word page",
    numOfWords: n,
    recentlyAddedWords: r,
  });
});

app.get("/word/:_WORD", async (req, res) => {
  const w: WordPageData | null = await FetchWordData(req.params._WORD);
  if (w !== null) {
    res.status(200).render("wordPage", {
      title: `${
        w.wordData.name.charAt(0).toUpperCase() + w.wordData.name.slice(1)
      } - Word Definition, Synonyms, Antonyms,
      and Examples`,
      word: w,
      wordpageHeaderTags: true,
    });
  } else {
    res
      .status(404)
      .send(`Could not find definition for the word ${req.params._WORD}`);
  }
});

app.get("/api/generate-definition", async (req, res) => {
  console.log(req.headers.generation_key);
  console.log(process.env.GENERATION_KEY);

  //request needs to have generation key in header
  if (
    req.headers.generation_key !== undefined &&
    req.headers.generation_key === process.env.GENERATION_KEY
  ) {
    /* 
      Make sure database does not already store all
      words that exists from api (178186 words)
    */
    const allWords = await wordsCollection.find().toArray();
    if (allWords.length === 178186) {
      res.status(500).json({ msg: "All words have already been generated" });
    } else {
      /* 
        Keep attempting to generate words until
        there are no errors thrown (word has a definition)
        There is a set number of attempts for this to
        work as there will be a timeout if not
        able to find word to use amongst thousands of 
        words to filter through
        loop until word is found that has not been defined
    */
      let attempts: number = 0;
      while (attempts !== 25) {
        //1. generate word to be defined
        const word = await GenerateNewWord();
        if (word !== null) {
          //2. see if this word has a definition
          const definition = await GenerateWordDefinition(word);
          if (definition !== null) {
            //3. generate exmaple sentences using the word
            const exampleSentences = await GenerateExampleSentences(word);
            if (exampleSentences !== null) {
              //4. generate history and use of the word
              const history = await GenerateWordHistory(word); //this is allowed to be null
              //5. generate syn and anto
              const synAndAnto = await GenerateSynonymsAndAntonyms(word);
              if (synAndAnto !== null) {
                //6. generate images
                const images: string[] | null = await GenerateImage(word);
                if (images !== null) {
                  //7. save data to database
                  const savedWord = await SaveWordToDb(
                    word,
                    definition,
                    exampleSentences,
                    history,
                    synAndAnto,
                    images
                  );

                  if (savedWord !== null) {
                    console.log("\nsuccessfully generated word " + word);
                    res
                      .status(200)
                      .json({ msg: "successfully saved new word to database" });
                    break;
                  } else {
                    console.log(
                      "error while saving word to database\nattempting to generate save word again word...."
                    );
                    attempts++;
                  }
                } else {
                  console.log(
                    "error while generating images\nattempting to generate images again...."
                  );
                  attempts++;
                }
              } else {
                console.log(
                  "error while generating syn and anto for word\nattempting to generate new syn and anto...."
                );
                attempts++;
              }
            } else {
              console.log(
                "error while generating examples for word\nattempting to generate new examples...."
              );
              attempts++;
            }
          } else {
            console.log(
              "error while generating definition for word\nattempting to generate new definition...."
            );
            attempts++;
          }
        } else {
          console.log(
            "error while generating new word\nattempting to generate new word...."
          );
          attempts++;
        }
      }
      if (attempts === 25) {
        res.status(500).json({
          msg: "The server was not able to generate word within 25 attempts",
        });
      }
    }
  } else {
    res.status(401).json({ msg: "Unauthorized access" });
  }
});

app.get("/sitemap.xml", async (req, res) => {
  const x: string | null = await GenerateSitemap();
  if (x !== null) {
    res.set("Content-Type", "text/xml");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${x}
    </urlset>`);
  } else {
    res.status(500).send("Error while generating sitemap");
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`\nServer listening on port ${process.env.PORT || 8080}`);
});
