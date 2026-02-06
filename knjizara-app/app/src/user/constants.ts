import { Heart, Package, MapPin, Settings, Shield } from "lucide-react";
import { routes } from "wasp/client/router";

export const userMenuItems = [
  {
    name: "userMenu.myOrders",
    to: routes.MyOrdersRoute.to,
    icon: Package,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: "userMenu.wishlist",
    to: routes.WishlistRoute.to,
    icon: Heart,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: "userMenu.myAddresses",
    to: routes.AddressManagementRoute.to,
    icon: MapPin,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: "userMenu.accountSettings",
    to: routes.AccountRoute.to,
    icon: Settings,
    isAuthRequired: false,
    isAdminOnly: false,
  },
  {
    name: "userMenu.adminPanel",
    to: routes.AdminBooksRoute.to,
    icon: Shield,
    isAuthRequired: true,
    isAdminOnly: true,
  },
] as const;
