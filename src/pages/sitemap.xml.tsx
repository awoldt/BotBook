import { GenerateSitemap } from "@/functions";
import { GetServerSideProps } from "next";

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  if (res) {
    const sitemapString = await GenerateSitemap();

    res.setHeader("Content-Type", "text/xml");
    res.write(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapString}
    </urlset>`);
    res.end();
  }

  return {
    props: {},
  };
};
