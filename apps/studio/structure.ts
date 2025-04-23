import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  BookMarked,
  CogIcon,
  File,
  FileText,
  HomeIcon,
  type LucideIcon,
  MessageCircleQuestion,
  PanelBottomIcon,
  PanelTopDashedIcon,
  Settings2,
  User,
  NotepadText,
  Truck,
  Bus,
  Box,
  MapPin,
  GraduationCap,
  Wrench,
} from "lucide-react";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

import type { SchemaType, SingletonType } from "./schemaTypes";
import { getTitleCase } from "./utils/helper";

type Base<T = SchemaType> = {
  id?: string;
  type: T;
  preview?: boolean;
  title?: string;
  icon?: LucideIcon;
};

type CreateSingleTon = {
  S: StructureBuilder;
} & Base<SingletonType>;

const createSingleTon = ({ S, type, title, icon }: CreateSingleTon) => {
  const newTitle = title ?? getTitleCase(type);
  return S.listItem()
    .title(newTitle)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type));
};

type CreateList = {
  S: StructureBuilder;
} & Base;

// This function creates a list item for a type. It takes a StructureBuilder instance (S),
// a type, an icon, and a title as parameters. It generates a title for the type if not provided,
// and uses a default icon if not provided. It then returns a list item with the generated or
// provided title and icon.

const createList = ({ S, type, icon, title, id }: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  return S.documentTypeListItem(type)
    .id(id ?? type)
    .title(newTitle)
    .icon(icon ?? File);
};

type CreateIndexList = {
  S: StructureBuilder;
  list: Base;
  index: Base<SingletonType>;
  context: StructureResolverContext;
};

const createIndexListWithOrderableItems = ({
  S,
  index,
  list,
  context,
}: CreateIndexList) => {
  const indexTitle = index.title ?? getTitleCase(index.type);
  const listTitle = list.title ?? getTitleCase(list.type);
  return S.listItem()
    .title(listTitle)
    .icon(index.icon ?? File)
    .child(
      S.list()
        .title(indexTitle)
        .items([
          S.listItem()
            .title(indexTitle)
            .icon(index.icon ?? File)
            .child(
              S.document()
                .views([S.view.form()])
                .schemaType(index.type)
                .documentId(index.type),
            ),
          orderableDocumentListDeskItem({
            type: list.type,
            S,
            context,
            icon: list.icon ?? File,
            title: `${listTitle}`,
          }),
        ]),
    );
};

export const structure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  return S.list()
    .title("Content")
    .items([
      createSingleTon({ S, type: "homePage", icon: HomeIcon }),
      S.divider(),
      createList({ S, type: "page", title: "Páginas" }),
      createIndexListWithOrderableItems({
        S,
        index: { type: "blogIndex", icon: BookMarked },
        list: { type: "blog", title: "Artículos", icon: FileText },
        context,
      }),
      createIndexListWithOrderableItems({
        S,
        index: { type: "repuestosIndex", icon: Wrench },
        list: { type: "repuestos", title: "Repuestos", icon: Wrench },
        context,
      }),
      S.listItem()
        .title("Nuestros productos")
        .icon(Truck)
        .child(
          S.list()
            .title("Nuestros productos")
            .items([
              createList({ S, type: "camiones", title: "Camiones", icon: Truck }),
              createList({ S, type: "buses", title: "Buses", icon: Bus }),
              createList({ S, type: "motoresPenta", title: "Motores Penta", icon: Box }),
            ])
        ),
      createList({ S, type: "sucursales", title: "Sucursales", icon: MapPin }),
      createList({ S, type: "cursos", title: "Cursos", icon: GraduationCap }),
      S.divider(),
      S.listItem()
        .title("Configuración del sitio")
        .icon(Settings2)
        .child(
          S.list()
            .title("Configuración del sitio")
            .items([
              createSingleTon({
                S,
                type: "navbar",
                title: "Navegación",
                icon: PanelTopDashedIcon,
              }),
              createSingleTon({
                S,
                type: "footer",
                title: "Footer",
                icon: PanelBottomIcon,
              }),
              createSingleTon({
                S,
                type: "settings",
                title: "Configuración global",
                icon: CogIcon,
              }),
              createList({ S, type: "formularios", title: "Formularios", icon: NotepadText }),
              createList({ S, type: "author", title: "Autores", icon: User }),
            ]),
        ),
    ]);
};
