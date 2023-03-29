import ShareBtns from "@/components/SocialShareBtns";
import { FetchWordData } from "@/functions";
import { Word } from "@/types";
import { GetServerSideProps } from "next";
import Head from "next/head";

export default function WordDefinitionPage({
  word,
  title,
  paginationLinks,
}: {
  word: Word;
  title: string;
  paginationLinks: string[];
}) {
  return (
    <>
      {word !== null && (
        <>
          <Head>
            <title>{title}</title>
            <link
              rel="canonical"
              href={`https://botbook.dev/word/${word.name}`}
            />
            <meta
              name="description"
              content={`Learn what the word ${word.name} means along with examples, synonyms, antonyms, and images all generated using AI`}
            />
            <meta
              property="og:title"
              content={`${word.name}: Definition, images, and examples all generated using AI`}
            />
            <meta
              property="og:description"
              content={`Learn what ${word.name} means along with other relevant information all generated with AI`}
            />
            <meta
              property="og:image"
              content={`https://cdn.botbook.dev/${word.name}_0.png`}
            />
          </Head>
          <div className="container">
            <h1 id="word_title">
              {word.name.charAt(0).toUpperCase() + word.name.slice(1)}
            </h1>
            <h2 className="word-page-section">Definition</h2>
            <p>{word.definition}</p>
            <h2 className="word-page-section">Examples</h2>
            <ul>
              {word.examples.map((x, index) => {
                return (
                  <li key={index}>
                    <p>{x}</p>
                  </li>
                );
              })}
            </ul>
            {word.synonyms.length !== 0 && (
              <>
                <h2 className="word-page-section">Synonyms</h2>

                {word.synonyms.map((x, index) => {
                  return (
                    <div key={index} className="syn-anto-div">
                      <span>{x}</span>
                    </div>
                  );
                })}
              </>
            )}
            {word.antonyms.length !== 0 && (
              <>
                <h2 className="word-page-section">Antonyms</h2>

                {word.antonyms.map((x, index) => {
                  return (
                    <div key={index} className="syn-anto-div">
                      <span>{x}</span>
                    </div>
                  );
                })}
              </>
            )}

            <h2 className="word-page-section">History</h2>
            {word.history !== null && (
              <>
                {word.history.map((x, index) => {
                  return <p key={index}>{x}</p>;
                })}
              </>
            )}
            <div id="generated_imgs_div" className="row">
              {word.imgs.map((x, index) => {
                return (
                  <div key={index} className="col">
                    <img
                      src={x}
                      alt={`example of the word ${word.name}`}
                      className="img-fluid generated-img"
                    />
                  </div>
                );
              })}
            </div>

            {paginationLinks.length === 1 && word.name < paginationLinks[0] && (
              <a
                className="btn pagination-link pagination-rightside"
                href={`/word/${paginationLinks[0]}`}
              >
                {paginationLinks[0].charAt(0).toUpperCase() +
                  paginationLinks[0].slice(1)}{" "}
                <img src="/icons/caret-right-fill.svg" />
              </a>
            )}
            {paginationLinks.length === 1 && word.name > paginationLinks[0] && (
              <a
                className="btn pagination-link pagination-leftside"
                href={`/word/${paginationLinks[0]}`}
              >
                <img src="/icons/caret-left-fill.svg" />{" "}
                {paginationLinks[0].charAt(0).toUpperCase() +
                  paginationLinks[0].slice(1)}{" "}
              </a>
            )}
            {paginationLinks.length > 1 && (
              <>
                <a
                  className="btn pagination-link pagination-leftside"
                  href={`/word/${paginationLinks[0]}`}
                >
                  <img src="/icons/caret-left-fill.svg" />{" "}
                  {paginationLinks[0].charAt(0).toUpperCase() +
                    paginationLinks[0].slice(1)}{" "}
                </a>
                <a
                  className="btn pagination-link pagination-rightside"
                  href={`/word/${paginationLinks[1]}`}
                >
                  {paginationLinks[1].charAt(0).toUpperCase() +
                    paginationLinks[1].slice(1)}{" "}
                  <img src="/icons/caret-right-fill.svg" />
                </a>
              </>
            )}

            <ShareBtns word={word.name} />

            <footer id="footer">
              <div>
                <img src="/icons/clock-history.svg" />
                <p className="footer_text">
                  Last updated on {word.lastUpdated}
                </p>
              </div>
              <div>
                <p className="footer_text" id="ai_generation_claim">
                  This page was generated using AI and because of this some
                  information may be inaccurate
                </p>
              </div>
            </footer>
          </div>
        </>
      )}
      {word === null && (
        <div className="container">
          <p>This word does not exist in our database :(</p>
        </div>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const word = params!.word;

  const data = await FetchWordData(String(word));

  if (data !== null && data.wordData !== null) {
    const pageTitle = `${
      data.wordData!.name.charAt(0).toUpperCase() + data.wordData.name.slice(1)
    } - Word Definition, Synonyms, Antonyms,
  and Examples`;

    //remove _id from wordData
    const wordDataWithoutID: any = { ...data.wordData };
    delete wordDataWithoutID._id;

    return {
      props: {
        word: wordDataWithoutID,
        title: pageTitle,
        paginationLinks: data.paginationLinks,
      },
    };
  } else {
    return {
      props: {
        word: null,
      },
    };
  }
};
