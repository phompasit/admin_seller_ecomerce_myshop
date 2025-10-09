import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../../api/api";

export const add_product = createAsyncThunk(
  "sellers/add_product",
  async (productData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("status", productData.status);
      formData.append("low_stock_threshold", productData.low_stock_threshold);
      formData.append("categoryId", productData.categoryId);
      formData.append("brand", productData.brand);
      formData.append("sku", productData.sku);
      formData.append("is_featured", productData.is_featured);
      formData.append(" orginalPrice", productData.orginalPrice);

      // ✅ แนบ array เช่น tags, size, colors
      productData.tags.forEach((tag) => formData.append("tags[]", tag));
      productData.size.forEach((s) => formData.append("size[]", s));
      productData.colors.forEach((c) => formData.append("colors[]", c));

      // ✅ แนบข้อมูล shipping
      formData.append(
        "shipping_info[weight]",
        productData.shipping_info.weight
      );
      formData.append(
        "shipping_info[dimensions][length]",
        productData.shipping_info.dimensions.length
      );
      formData.append(
        "shipping_info[dimensions][width]",
        productData.shipping_info.dimensions.width
      );
      formData.append(
        "shipping_info[dimensions][height]",
        productData.shipping_info.dimensions.height
      );
      formData.append(
        "shipping_info[shipping_fee]",
        productData.shipping_info.shipping_fee
      );

      // ✅ แนบไฟล์ภาพ
      productData.images.forEach((file) => {
        formData.append("images", file); // ไม่ต้องตั้งชื่อ `images[]` ก็ได้ ขึ้นกับ backend
      });

      const { data } = await api.post("/sellers/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const update_product = createAsyncThunk(
  "sellers/update_product",
  async (productData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("status", productData.status);
      formData.append("low_stock_threshold", productData.low_stock_threshold);
      formData.append("categoryId", productData?.categoryId || "no category");
      formData.append("brand", productData.brand);
      formData.append("sku", productData.sku);
      formData.append("is_featured", productData.is_featured);
      formData.append("orginalPrice", productData.orginalPrice);

      // ✅ แนบ array เช่น tags, size, colors  
      productData.tags.forEach((tag) => formData.append("tags[]", tag));
      productData.size.forEach((s) => formData.append("size[]", s));
      productData.colors.forEach((c) => formData.append("colors[]", c));

      // ✅ แนบข้อมูล shipping
      formData.append(
        "shipping_info[weight]",
        productData.shipping_info.weight
      );
      formData.append(
        "shipping_info[dimensions][length]",
        productData.shipping_info.dimensions.length
      );
      formData.append(
        "shipping_info[dimensions][width]",
        productData.shipping_info.dimensions.width
      );
      formData.append(
        "shipping_info[dimensions][height]",
        productData.shipping_info.dimensions.height
      );
      formData.append(
        "shipping_info[shipping_fee]",
        productData.shipping_info.shipping_fee
      );

      const existingImageUrls = productData.images.filter(
        (img) => typeof img === "string"
      ); // เก็บเฉพาะ URL
      formData.append("existingImages", JSON.stringify(existingImageUrls));
      // ✅ แนบไฟล์ภาพ
      productData.images.forEach((img) => {
        if (typeof img !== "string") {
          formData.append("images", img); // แนบเฉพาะไฟล์ใหม่
        }
      });
       for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
       }
      const { data } = await api.patch(
        `/sellers/update-products/${productData?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const get_product = createAsyncThunk(
  "sellers/get_product",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/sellers/get-products`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//delete images products
export const delete_images_products = createAsyncThunk(
  "sellers/delete_images_products",
  async ({ index, id }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/sellers/delete_images_products/${id}/${index}`,
        {
          withCredentials: true,
        }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//update_status products
export const update_status = createAsyncThunk(
  "sellers/update_status",
  async ({ id, status }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/sellers/update-status/${id}`,
        { status },
        {
          withCredentials: true,
        }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//notication
export const notication = createAsyncThunk(
  "sellers/notication",
  async ({ subscription }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/sellers/notication`,
        { subscription },
        {
          withCredentials: true,
        }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
///get_order
export const get_order = createAsyncThunk(
  "sellers/get_order",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/sellers/get_order`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
///update status shipping
export const update_tracking = createAsyncThunk(
  "sellers/update_tracking",
  async (data_tracking, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("trackingNumber", data_tracking.trackingNumber);
      formData.append("imagesShipping", data_tracking.imagesShipping);
      const { data } = await api.patch(
        `/sellers/update_tracking/${data_tracking.orderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
///update_tracking
export const update_status_shipping = createAsyncThunk(
  "sellers/update_status_shipping",
  async (
    { id, shipping_status, step, note },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.patch(
        `/sellers/update-status-shipping/${id}`,
        {
          shipping_status,
          step,
          note,
        },
        {
          withCredentials: true,
        }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const provider_sellers = createSlice({
  name: "provider_sellers",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    product: [],
    get_orders: [],
    seller_data_orders: {},
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_product.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_product.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      .addCase(add_product.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(get_product.fulfilled, (state, action) => {
        state.loader = false;
        state.product = action.payload.data;
      })
      //update_product
      .addCase(update_product.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_product.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      .addCase(update_product.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      //delete_images_products
      .addCase(delete_images_products.pending, (state) => {
        state.loader = true;
      })
      .addCase(delete_images_products.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      .addCase(delete_images_products.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      //update_status
      .addCase(update_status.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_status.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(update_status.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      //notication
      .addCase(notication.pending, (state) => {
        state.loader = true;
      })
      .addCase(notication.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(notication.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      // get_order
      .addCase(get_order.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_order.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(get_order.fulfilled, (state, action) => {
        state.loader = false;
        state.get_orders = action.payload.data;
        state.seller_data_orders = action.payload.seller_data_order;
      })
      ///shipping_status
      .addCase(update_status_shipping.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_status_shipping.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(update_status_shipping.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      ///update_tracking
      .addCase(update_tracking.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_tracking.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(update_tracking.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      });
  },
});
export const { messageClear } = provider_sellers.actions;
export default provider_sellers.reducer;
