import { SearchResults } from "@/types";
import { useState } from "react";

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [serachResults, setSearchResults] = useState<SearchResults[]>([]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href={"/"} title="Homepage">
            <img src="/icons/book.svg" />
            <span id="nav_brand">BotBook</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href={"/word"}>
                  Explore
                </a>
              </li>
            </ul>
            <div className="d-flex">
              <input
                className="form-control me-sm-2"
                type="search"
                placeholder="Search any word"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    try {
                      if (searchQuery !== "") {
                        const data = await fetch(
                          "/api/search?q=" + searchQuery
                        );
                        if (data.status === 200) {
                          const searchData = await data.json();

                          setSearchResults(searchData.searchResults);
                        }
                        if (data.status === 404) {
                          alert("No results");
                        }
                      }
                    } catch (e) {
                      alert("error while searching");
                    }
                  }
                }}
              />
              <button
                className="btn btn-light my-2 my-sm-0"
                type="submit"
                onClick={async () => {
                  try {
                    if (searchQuery !== "") {
                      const data = await fetch("/api/search?q=" + searchQuery);
                      if (data.status === 200) {
                        const searchData = await data.json();

                        setSearchResults(searchData.searchResults);
                      }
                      if (data.status === 404) {
                        alert("No results");
                      }
                    }
                  } catch (e) {
                    alert("error while searching");
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </nav>
      {serachResults.length !== 0 && (
        <div className="container">
          <span id="search_results_title">Search results</span>
          {serachResults.map((x, index) => {
            return (
              <div key={index}>
                <a href={"/word/" + x.name} className="search-results-text">
                  {x.name}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
