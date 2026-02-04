import { routes } from "wasp/client/router";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "Knjige", to: routes.BooksRoute.to },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Knjige", to: routes.BooksRoute.to },
] as const;
