import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { buses } from "./buses";
import { camiones } from "./camiones";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { motoresPenta } from "./motores-penta";
import { navbar } from "./navbar";
import { page } from "./page";
import { repuestos } from "./repuestos";
import { repuestosIndex } from "./repuestos-index";
import { settings } from "./settings";
import { formulariosType } from "./formularios";
import { sucursales } from "./sucursales";
import { cursos } from "./cursos";

export const singletons = [homePage, blogIndex, repuestosIndex, settings, footer, navbar];

export const documents = [blog, page, faq, author, formulariosType, camiones, buses, motoresPenta, sucursales, cursos, repuestos, ...singletons];
