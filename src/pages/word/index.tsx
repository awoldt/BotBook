import { GetRecentlyAddedWords, wordsCollection } from "@/functions";
import { Word } from "@/types";
import { GetServerSideProps } from "next";

export default function Index({
  numOfWords,
  recentWords,
}: {
  numOfWords: number;
  recentWords: Word[] | null;
}) {
  return (
    <div className="container">
      <h1>There are currently {numOfWords} words stored in our database</h1>
      {recentWords !== null && (
        <div id="recently-added-words-section">
          <h2>Recently Added</h2>
          {recentWords.map((x, index) => {
            return (
              <div key={index} className="recently-added-words-link-div">
                <a href={`/word/${x.name}`} className="link-no-decoration">
                  <span className="recently-added-word-name">
                    {x.name.charAt(0).toUpperCase() + x.name.slice(1)}
                  </span>
                  <p>{x.definition}</p>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const numberOfWords = (await wordsCollection.find().toArray()).length;
  const recentlyAddedWords = await GetRecentlyAddedWords();

  return {
    props: {
      numOfWords: numberOfWords,
      recentWords: recentlyAddedWords,
    },
  };
};
