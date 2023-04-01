export default function Highlights() {
  return (
    <div className="row" id="highlights-row">
      <div className="col-md-4 text-center highlight-col">
        <img src="/icons/robot.svg" />
        <p>
          Every word definition along with images were generated using artificial intelligence
        </p>
      </div>
      <div className="col-md-4 text-center highlight-col">
        <img src="/icons/refresh.svg" />
        <p>
          New words are added every day to our database
        </p>
      </div>
      <div className="col-md-4 text-center highlight-col">
        <img src="/icons/world-magnifying-glass.svg" />
        <p>
          Data is generated using <a href="https://platform.openai.com/docs/guides/completion" title="Visit official OpenAI Text Completion documentation" target={"_blank"}>OpenAI Text Completion</a>
        </p>
      </div>
    </div>
  );
}
