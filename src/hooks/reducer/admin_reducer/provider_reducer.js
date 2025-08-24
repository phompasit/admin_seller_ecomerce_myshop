import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../../api/api";
export const add_category = createAsyncThunk(
  "provider/add_category",
  async (categoryData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/admin/add-category",
        categoryData,
        {
          withCredentials: true,
        },
        {}
      );
      console.log("Category added successfully:", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
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
      console.log("Categories retrieved successfully:", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
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
      console.log("Category updated successfully:", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
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
      console.log("Category deleted successfully:", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
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
      console.log(error.response.data);
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
      console.log("Coupon added successfully:", data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
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
      console.log(error.response.data);
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
      console.log(error.response.data);
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
      console.log(error.response.data);
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
      console.log(error.response.data);
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
      console.log(error.response.data);
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
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
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
      });
  },
});
export const { messageClear } = provider_reducer.actions;
export default provider_reducer.reducer;
