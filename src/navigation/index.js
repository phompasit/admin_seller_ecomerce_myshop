//ເງືອນໄຂ ສ້າງເຂົ້າ

import { all_routes } from "./all_routes";

// ສົ່ງຄ່າ role ມາ ຖ້າ role==admin ໃຫ້ໂຊຫນ້າແອດມິນ  ຖ້າ ຜູ້ຂາຍໃຫ້ໂຊ link seller
export const get_all_link_routes = (role) => {
  const data = [];
  for (let i = 0; i < all_routes.length; i++) {
    if (role === all_routes[i].role) {
      data.push(all_routes[i]);
    }
  }
  return data;
};
