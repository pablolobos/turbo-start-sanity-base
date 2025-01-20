import { blog } from "./blog";
import { homePage } from "./home-page";
import { page } from "./page";
import { blogIndex } from "./blog-index";
import { faq } from "./faq";
import { author } from "./author";
import { settings } from "./settings";
import { footer } from "./footer";
import { navbar } from "./navbar";

export const singletons = [
  homePage,
  blogIndex,
  settings,
  footer,
  navbar,
];

export const documents = [blog, page, faq, author, ...singletons];
