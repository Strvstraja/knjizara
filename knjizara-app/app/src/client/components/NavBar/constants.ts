import { routes } from "wasp/client/router";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "nav.books", to: routes.BooksRoute.to },
  { name: "nav.createListing", to: routes.CreateListingRoute.to },
  { name: "nav.myListings", to: routes.MyListingsRoute.to },
  { name: "nav.mySales", to: routes.SellerOrdersRoute.to },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "nav.books", to: routes.BooksRoute.to },
  { name: "nav.createListing", to: routes.CreateListingRoute.to },
  { name: "nav.myListings", to: routes.MyListingsRoute.to },
  { name: "nav.mySales", to: routes.SellerOrdersRoute.to },
] as const;
