export default function ShareBtns({ word }: { word: string }) {
  return (
    <div id="social_share_div">
      <span>Share</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fbotbook.dev%2Fword%2F${word}`}
        title="Share to facebook"
        target={"_blank"}
        className="social-btn-link"
      >
        {" "}
        <img
          src="/icons/facebook.svg"
          alt="facebook logo"
          className="social-media-share-btn"
        />
      </a>
      <a
        href={`http://twitter.com/share?url=https%3A%2F%2Fbotbook.dev%2Fword%2F${word}`}
        title="Share to twitter"
        target={"_blank"}
        className="social-btn-link"
      >
        <img
          src="/icons/twitter.svg"
          alt="twitter logo"
          className="social-media-share-btn"
        />
      </a>
      <a
        href={`http://www.reddit.com/submit?url=https%3A%2F%2Fbotbook.dev%2Fword%2F${word}`}
        title="Share to reddit"
        target={"_blank"}
        className="social-btn-link"
      >
        <img
          src="/icons/reddit.svg"
          alt="reddit logo"
          className="social-media-share-btn"
        />
      </a>
    </div>
  );
}
