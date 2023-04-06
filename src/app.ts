import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", ".env") });
import express from "express";
import compression from "compression";
import { engine } from "express-handlebars";
import {
  FetchOtherWords,
  FetchWordData,
  GenerateBrowseList,
  GenerateSitemap,
  GetRecentlyAddedWords,
  wordsCollection,
} from "./functions";
import { BrowseList, Word } from "./types";
import CustomHelpers from "./helpers";
import apiRoutes from "./routes/api";

const app = express();
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "..", "views", "layouts"),
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "..", "views", "partials"),
    helpers: CustomHelpers.helpers,
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use(compression());
app.use(apiRoutes);

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "index.html"));
});

app.get("/word", async (req, res) => {
  const n: number = (await wordsCollection.find().toArray()).length;
  const r: Word[] | null = await GetRecentlyAddedWords();
  const l: BrowseList[] | null = await GenerateBrowseList();
  res.render("wordExplore", {
    title: "Explore Words",
    numOfWords: n,
    recentlyAddedWords: r,
    browseList: l,
    wordExploreHeadTag: true,
  });
});

app.get("/word/:_WORD", async (req, res) => {
  const w: Word | null = await FetchWordData(req.params._WORD);
  if (w !== null) {
    const ow: string[] | null = await FetchOtherWords(
      req.params._WORD.slice(0, 1),
      req.params._WORD
    );

    res.status(200).render("wordPage", {
      title: `${
        w.name.charAt(0).toUpperCase() + w.name.slice(1)
      } - Word Definition, Synonyms, Antonyms,
      and Examples`,
      word: w,
      wordPageHeadTag: true,
      otherWords: ow,
    });
  } else {
    res
      .status(404)
      .send(`Could not find definition for the word ${req.params._WORD}`);
  }
});

app.get("/sitemap.xml", async (req, res) => {
  const x: string | null = await GenerateSitemap();
  if (x !== null) {
    res.set("Content-Type", "text/xml");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://botbook.dev</loc>
    </url>
    <url>
      <loc>https://botbook.dev/word</loc>
    </url>
    ${x}
    </urlset>`);
  } else {
    res.status(500).send("Error while generating sitemap");
  }
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`\nServer listening on port ${process.env.PORT || 8080}`);
});
