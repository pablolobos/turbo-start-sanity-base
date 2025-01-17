import { blog } from "./blog";
import { homePage } from "./home-page";
import { page } from "./page";
import { blogIndex } from "./blog-index";
import { faq } from "./faq";
import { author } from "./author";
import { settings } from "./settings";
import { footer } from "./footer";

export const singletons = [homePage, blogIndex, settings, footer];

export const documents = [blog, page, faq, author, ...singletons];
