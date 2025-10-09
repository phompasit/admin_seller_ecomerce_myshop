//ເງືອນໄຂ ສ້າງເຂົ້າ

import { all_routes } from "./all_routes";


export const get_all_link_routes = (role, unreadChatCount = 0) => {
  return all_routes
    .filter((route) => route.role === role)
    .map((route) => {
      // ถ้า path เป็น /sellers/chat ให้ใส่ badge = unreadChatCount
      if (route.path === "/sellers/chat") {
        return { ...route, badge: unreadChatCount };
      }
      return route;
    });
};
