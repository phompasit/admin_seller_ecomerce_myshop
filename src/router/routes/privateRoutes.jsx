import { admin_routes } from "./privateRoutes/admin_routes";
import { seller_routes } from "./privateRoutes/seller_routes";

export const privateRoutes = [...seller_routes, ...admin_routes];
