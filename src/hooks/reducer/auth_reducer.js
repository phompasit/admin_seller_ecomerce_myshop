import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";
export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/auth/check-auth", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
export const seller_register = createAsyncThunk(
  "auth/seller_reigster",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/auth/register",
        {
          username: info.username,
          password: info.password,
          email: info?.email,
          role: "sellers",
          phone: info?.phone,
          agreeTerms: info?.agreeTerms,
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

export const getVerifyUser = createAsyncThunk(
  "auth/getVerifyUser",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/auth/get-verify-user", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/auth/login",
        {
          phone: info?.phone,
          password: info.password,
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
export const get_user = createAsyncThunk(
  "auth/get_user ",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/auth/get-user", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//verifyUserCreate
export const verifyUserCreate = createAsyncThunk(
  "auth/verifyUserCreate",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("verificationData", info.verificationData);
      formData.append("idCardImage", info.idCardImage);
      formData.append("selfieImage", info.selfieImage);
      formData.append("verificationStatus", info.verificationStatus);
      const { data } = await api.post("/auth/verify-user", info, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
///update seller when reject verification ຜູ່ຂາຍຢືນຢັນບໍ່ຜ່ານໃຫ້ມາແກ້ໄຂຂອງຕົນເອງໃໝ່
export const updateSellerReject = createAsyncThunk(
  "auth/updateSellerReject",
  async ({ formData, id }, { rejectWithValue, fulfillWithValue }) => {
    try {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }

      const { data } = await api.put(
        `/auth/update-seller-fix/${id}`,
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
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//update seller when verify
export const updateSeller = createAsyncThunk(
  "auth/updateSeller",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log("info.store_images", info); // 👉 ควรเป็น File หรือ Blob

      const formData = new FormData();
      formData.append("store_name", info?.store_name);
      formData.append("store_code", info?.store_code);
      formData.append("store_images", info.store_images); // ✅ ไม่มีช่องว่าง
      formData.append("address", info.address);
      formData.append("description", info.description);
      formData.append("bank_account_name", info.bank_account_name);
      formData.append("bank_account_number", info.bank_account_number); // ✅
      formData.append("bank_account_images", info.bank_account_images); // ✅
      formData.append("bank_name", info.bank_name); // ✅ ใช้ชื่อที่ถูกต้อง
      const { data } = await api.put(`/auth/update-seller`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
export const update_access_seller = createAsyncThunk(
  "auth/update_access_seller",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put(
        `/auth/update_access_seller/${info?.id}`,
        {
          verificationStatus: info?.verificationStatus,
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
//unsubscribeNotification
export const unsubscribeNotification = createAsyncThunk(
  "auth/unsubscribeNotification",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/auth/unsubscribeNotification/${info}`,
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
export const remove_logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/auth/remove_logout`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    userInfo: {},
    token: null,
    exp: {},
    user: null,
    sellerInfo_data: {},
    isInitialized: false, // เพิ่ม field นี้
    isAuthenticated: false, // เพิ่มเพื่อความชัดเจน
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
    user_reset: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.get_profile = {};
      // เนื่องจากใช้ cookies ไม่ต้องจัดการ localStorage ที่นี่
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(seller_register.pending, (state) => {
        state.loader = true;
      })
      .addCase(seller_register.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(seller_register.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      .addCase(verifyToken.pending, (state) => {
        state.loader = true;
        state.errorMessage = "";
      })
      .addCase(verifyToken.rejected, (state, { payload }) => {
        state.loader = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.errorMessage = payload?.message || "Authentication failed";
      })
      .addCase(verifyToken.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.token = payload.authenticated;
        state.exp = payload.user;
        state.isInitialized = true;
        if (payload?.authenticated && payload?.user) {
          state.token = payload.token || "cookie-based"; // เก็บ token หรือ indicator
          state.user = payload.user;
          state.isAuthenticated = true;
          state.errorMessage = "";
        } else {
          state.token = null;
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      ///login
      .addCase(login.pending, (state) => {
        state.loader = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        if (payload?.user) {
          state.user = payload.user;
          state.token = "cookie-based";
          state.isAuthenticated = true;
        }
      })
      /// get_user
      .addCase(get_user.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.data;
      })
      ///verfy user
      .addCase(verifyUserCreate.pending, (state) => {
        state.loader = true;
      })
      .addCase(verifyUserCreate.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(verifyUserCreate.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      ///get verify user
      .addCase(getVerifyUser.pending, (state) => {
        state.loader = true;
      })
      .addCase(getVerifyUser.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(getVerifyUser.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.sellerInfo_data = payload.data;
      })
      ///update seller when reject verification
      .addCase(updateSellerReject.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateSellerReject.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(updateSellerReject.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      ///update seller when verify
      .addCase(updateSeller.pending, (state) => {
        state.loader = true;
      })
      .addCase(updateSeller.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(updateSeller.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      //update_access_seller
      .addCase(update_access_seller.pending, (state) => {
        state.loader = true;
      })
      .addCase(update_access_seller.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(update_access_seller.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      ///unsubscribeNotification
      .addCase(unsubscribeNotification.pending, (state) => {
        state.loader = true;
      })
      .addCase(unsubscribeNotification.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(unsubscribeNotification.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      ///logout
      // ============= LOGOUT =============
      .addCase(remove_logout.pending, (state) => {
        state.loader = true;
      })
      .addCase(remove_logout.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "remove_logout failed";
      })
      .addCase(remove_logout.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "Logged out successfully";

        // // Clear all auth data
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});
export const { messageClear, user_reset } = authReducer.actions;
export default authReducer.reducer;
