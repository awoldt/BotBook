import { GetRecentlyAddedWords, wordsCollection } from "@/functions";
import { Word } from "@/types";
import { GetServerSideProps } from "next";
import Image from "next/image";

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
          <h2 className="mb-3">
            <u>Recently Added</u>
          </h2>
          {recentWords.map((x, index) => {
            return (
              <a
                href={`/word/${x.name}`}
                className="link-no-decoration"
                key={index}
              >
                <div className="recently-added-words-link-div row">
                  <div className="col-md-1">
                    <Image
                      src={`https://cdn.botbook.dev/${x.name}_0.png`}
                      width={100}
                      height={100}
                      alt={`${x.name}`}
                      className="img-fluid recently-added-word-img"
                    />
                  </div>
                  <div className="col-md-11">
                    <span className="recently-added-word-name">
                      {x.name.charAt(0).toUpperCase() + x.name.slice(1)}
                    </span>
                    <p>
                      {x.definition.length > 200 && (
                        <>
                          {x.definition.slice(0, 200)}...
                          <span className="read-more-tag">Read more</span>
                        </>
                      )}
                      {x.definition.length <= 200 && <>{x.definition}</>}
                    </p>
                  </div>
                </div>
              </a>
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
