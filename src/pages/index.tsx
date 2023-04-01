import Highlights from "@/components/Highlights";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>BotBook - An Entire Dictionary Generated Using AI</title>
        <link rel="canonical" href={`https://botbook.dev`} />
      </Head>
      <div className="container">
        <h1 className="text-center" id="homepage_title_text">
          AI Generated Dictionary
        </h1>

        <Highlights />
        <hr></hr>
        <div id="homepage_about">
          <p>
            <u>
              The accuracy of this dictionary will not be as useful or
              trustworthy as each word is entierly generated by a computer
              program.
            </u>{" "}
            There is no human that goes through to make sure that everything
            looks good, whatever the AI spits out is what is saved. This can
            funny at times with some of the definitions and images being
            completely unrelated to the word being defined. We will however
            delete content that is innapropiate or offensive.
          </p>
          <h2>All of the following are generated using AI</h2>
          <ul>
            <li>Word definition</li>
            <li>Exmaple sentences using the word</li>
            <li>Synonyms and antonyms of the word</li>
            <li>The history and use of the word</li>
            <li>Images showcasing the word</li>
          </ul>
          <p>
            It is very impressive to see what this text completion model is
            capable of in its current state. Within seconds it can deliver
            high-quality definitions for any word in the English dictionary
            (most of the time). There are many instances where a word has
            multiple meanings and the AI is only able to define one of these
            instead of all of them. This will be fixed when the model gets more
            advanced with its responses.
          </p>
        </div>
        <div id="github_link_div">
          <a
            href="https://github.com/awoldt/BotBook"
            title="View source code"
            id="github_link"
            target={"_blank"}
          >
            <img src="/icons/github.svg" alt="github icon" /> View on GitHub
          </a>
        </div>
      </div>
    </>
  );
}
