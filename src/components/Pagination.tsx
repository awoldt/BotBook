import { Word } from "@/types";

export default function Pagination({
  pageLinks,
  w,
}: {
  pageLinks: string[];
  w: Word;
}) {
  return (
    <>
      {pageLinks.length === 1 && w.name < pageLinks[0] && (
        <a
          className="btn pagination-link pagination-rightside"
          href={`/w/${pageLinks[0]}`}
        >
          {pageLinks[0].charAt(0).toUpperCase() + pageLinks[0].slice(1)}{" "}
          <img src="/icons/caret-right-fill.svg" />
        </a>
      )}
      {pageLinks.length === 1 && w.name > pageLinks[0] && (
        <a
          className="btn pagination-link pagination-leftside"
          href={`/w/${pageLinks[0]}`}
        >
          <img src="/icons/caret-left-fill.svg" />{" "}
          {pageLinks[0].charAt(0).toUpperCase() + pageLinks[0].slice(1)}{" "}
        </a>
      )}
      {pageLinks.length > 1 && (
        <>
          <a
            className="btn pagination-link pagination-leftside"
            href={`/w/${pageLinks[0]}`}
          >
            <img src="/icons/caret-left-fill.svg" />{" "}
            {pageLinks[0].charAt(0).toUpperCase() + pageLinks[0].slice(1)}{" "}
          </a>
          <a
            className="btn pagination-link pagination-rightside"
            href={`/w/${pageLinks[1]}`}
          >
            {pageLinks[1].charAt(0).toUpperCase() + pageLinks[1].slice(1)}{" "}
            <img src="/icons/caret-right-fill.svg" />
          </a>
        </>
      )}
    </>
  );
}
