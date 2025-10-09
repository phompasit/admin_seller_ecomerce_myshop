import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../../api/api";
export const add_category = createAsyncThunk(
  "provider/add_category",
  async (categoryData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/admin/add-category", categoryData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//get_category
export const get_category = createAsyncThunk(
  "provider/get_category",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/admin/get-category", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const update_category = createAsyncThunk(
  "provider/update_category",
  async ({ id, categoryData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/admin/update-category/${id}`,
        categoryData,
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
export const delete_category = createAsyncThunk(
  "provider/delete_category",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/admin/delete-category/${id}`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
////coupon
export const add_coupon = createAsyncThunk(
  "provider/add_coupon",
  async (couponData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/admin/add-coupon", couponData, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//get_products
export const get_product = createAsyncThunk(
  "provider/get_products",
  async (couponData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/admin/get_products_admin", {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//get_sellers
export const get_sellers = createAsyncThunk(
  "provider/get_sellers",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/admin/get_seller", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_coupon = createAsyncThunk(
  "provider/get_coupon",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/admin/get_coupon", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//update_coupons
export const update_coupons = createAsyncThunk(
  "provider/update_coupons",
  async (couponData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(
        `/admin/update_coupons/${couponData.id}`,
        couponData,
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
///reject_seller
export const reject_seller = createAsyncThunk(
  "provider/reject_seller ",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(
        `/admin/reject_seller/${info.id}`,
        {
          verificationStatus: info.verificationStatus,
          rejectionReason: info.rejectionReason,
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

///toggleFeatured is_featured

export const toggleFeatured = createAsyncThunk(
  "provider/toggleFeatured",
  async (productId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(
        `/admin/toggleFeatured/${productId}`,
        {
          is_featured: true,
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
///approve_seller
export const approve_seller = createAsyncThunk(
  "provider/approve_seller",
  async (productId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(
        `/admin/approve_seller/${productId}`,
        {},
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
//update_seller_fee
export const update_seller_fee = createAsyncThunk(
  "provider/update_seller_fee",
  async ({ id, fee_system, vat }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(
        `/admin/update_seller_fee/${id}`,
        {
          fee_system,
          vat,
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
///reject products ສິນຄ້າບໍ່ຜ່ານມາດຕະຖານກະລຸນາເພີ່ມຂໍ້ມູນໃຫ້ຄົບຖ້ວນ
export const reject_product = createAsyncThunk(
  "provider/reject_product",
  async ({ id, sanitizedReason }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(
        `/admin/reject_products/${id}`,
        { sanitizedReason },
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
///edit seller ແກ້ໄຂໂປຣໄຟລ User Model ກໍລະນີ້ທີ່ ຜູ້ຂາຍຕ້ອງການປ່ຽນ
export const edit_update_user = createAsyncThunk(
  "provider/edit_update_user",
  async (formData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(
        `/admin/edit_update_user/${formData.id}`,
        {
          username: formData.username,
          phone: formData.phone,
          email: formData.email,
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
///bulk_approve_products
export const bulk_approve_products = createAsyncThunk(
  "provider/bulk_approve_products",
  async ({ ids, status }, { rejectWithValue, fulfillWithValue }) => {
    try {
      // ถ้าเป็น array → join ด้วย ","
      const idsParam = Array.isArray(ids) ? ids.join(",") : ids;

      const { data } = await api.patch(
        `/admin/bulk_approve_products/${idsParam}`,
        { status: status },
        { withCredentials: true }
      );

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error occurred" }
      );
    }
  }
);
//get_order
export const get_order_for = createAsyncThunk(
  "provider/get_order_for",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/admin/order`, {
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error occurred" }
      );
    }
  }
);
///report_admin

// ✅ วิธีที่ 2: ใช้ axios params (แนะนำวิธีนี้)
export const report_admin = createAsyncThunk(
  "provider/report_admin",
  async (params = {}, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/admin/report_admin", {
        params: {
          dateFilter: params.dateFilter || null,
          startDate: params.startDate || null,
          endDate: params.endDate || null,
        },
        withCredentials: true,
      });

      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Error occurred" }
      );
    }
  }
);

export const provider_reducer = createSlice({
  name: "provider_reducer",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    categoryList: [],
    get_products: [],
    get_seller: [],
    all_sellers: [],
    get_coupons: [],
    get_order_admin: [],
    report_admin_data: null,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(add_category.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_category.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      .addCase(add_category.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.details
          .map((item) => item)
          .join(", ");
      })

      .addCase(get_category.fulfilled, (state, action) => {
        state.loader = false;
        state.categoryList = action.payload.data;
      })
      .addCase(get_category.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(update_category.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_category.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(update_category.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      .addCase(delete_category.pending, (state) => {
        state.loader = true;
      })
      .addCase(delete_category.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(delete_category.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      .addCase(add_coupon.pending, (state) => {
        state.loader = true;
      })
      .addCase(add_coupon.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(add_coupon.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      ///get_products
      .addCase(get_product.fulfilled, (state, action) => {
        state.loader = false;
        state.get_products = action.payload.data;
      })
      //get_sellers
      .addCase(get_sellers.fulfilled, (state, action) => {
        state.loader = false;
        state.get_seller = action.payload.data;
        state.all_sellers = action.payload.all_seller;
      })
      //get_coupon
      .addCase(get_coupon.fulfilled, (state, action) => {
        state.loader = false;
        state.get_coupons = action.payload.data;
      })
      .addCase(update_coupons.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_coupons.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(update_coupons.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      //reject_seller
      .addCase(reject_seller.pending, (state) => {
        state.loader = true;
      })
      .addCase(reject_seller.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(reject_seller.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      //toggleFeatured
      .addCase(toggleFeatured.pending, (state) => {
        state.loader = true;
      })
      .addCase(toggleFeatured.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(toggleFeatured.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      ///approve_seller
      .addCase(approve_seller.pending, (state) => {
        state.loader = true;
      })
      .addCase(approve_seller.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(approve_seller.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      //update_seller_fee
      .addCase(update_seller_fee.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_seller_fee.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(update_seller_fee.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      ///reject_product
      .addCase(reject_product.pending, (state) => {
        state.loader = true;
      })
      .addCase(reject_product.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(reject_product.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      //edit_update_user
      .addCase(edit_update_user.pending, (state) => {
        state.loader = true;
      })
      .addCase(edit_update_user.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(edit_update_user.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      ///bulk_approve_products
      .addCase(bulk_approve_products.pending, (state) => {
        state.loader = true;
      })
      .addCase(bulk_approve_products.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(bulk_approve_products.fulfilled, (state, action) => {
        state.loader = false;
        state.successMessage = action.payload.message;
      })
      //get_order
      .addCase(get_order_for.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_order_for.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(get_order_for.fulfilled, (state, action) => {
        state.loader = false;
        state.get_order_admin = action.payload.data;
      })
      ///report_admin
      .addCase(report_admin.pending, (state) => {
        state.loader = true;
      })
      .addCase(report_admin.rejected, (state, action) => {
        state.loader = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(report_admin.fulfilled, (state, action) => {
        state.loader = false;
        state.report_admin_data = action.payload.data;
      });
  },
});
export const { messageClear } = provider_reducer.actions;
export default provider_reducer.reducer;
