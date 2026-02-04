import { Heart, Package, MapPin, Settings, Shield } from "lucide-react";
import { routes } from "wasp/client/router";

export const userMenuItems = [
  {
    name: "Moje porudžbine",
    to: routes.MyOrdersRoute.to,
    icon: Package,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: "Lista želja",
    to: routes.WishlistRoute.to,
    icon: Heart,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: "Moje adrese",
    to: routes.AddressManagementRoute.to,
    icon: MapPin,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: "Podešavanja naloga",
    to: routes.AccountRoute.to,
    icon: Settings,
    isAuthRequired: false,
    isAdminOnly: false,
  },
] as const;
