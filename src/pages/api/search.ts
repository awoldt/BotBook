import { DbConnect, Search } from "@/functions";
import type { NextApiRequest, NextApiResponse } from "next";
import { SearchResults } from "@/types";

type Data = {
  msg: string;
  searchResults?: SearchResults[] | undefined | null;
};

DbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.query.q !== undefined && req.query.q !== "") {
    const data = await Search(String(req.query.q));
    if (data !== undefined) {
      res.status(200).json({ msg: "ok", searchResults: data });
    } else if (data === undefined) {
      res.status(404).json({ msg: "no results" });
    } else {
      res.status(500).json({ msg: "error while searching" });
    }
  } else {
    res.status(400).json({ msg: "Bad request" });
  }
}
