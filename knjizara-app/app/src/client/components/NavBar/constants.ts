import { routes } from "wasp/client/router";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "Knjige", to: routes.BooksRoute.to },
  { name: "Objavi knjigu", to: routes.CreateListingRoute.to },
  { name: "Moji oglasi", to: routes.MyListingsRoute.to },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Knjige", to: routes.BooksRoute.to },
  { name: "Objavi knjigu", to: routes.CreateListingRoute.to },
  { name: "Moji oglasi", to: routes.MyListingsRoute.to },
] as const;
