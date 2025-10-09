import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../../api/api";
export const getFinanceSummary = createAsyncThunk(
  "finance/getFinanceSummary",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/finance/getFinanceSummary", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//getTransactions
export const getTransactions = createAsyncThunk(
  "finance/getTransactions",
  async (statusFilter, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/finance/transactions?${statusFilter}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
///
export const getAnalytics = createAsyncThunk(
  "finance/getAnalytics",
  async (period, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/finance/analytics?period=${period}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const dashbord_seller = createAsyncThunk(
  "finance/dashbord_seller",
  async ({ period }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/finance/dashbord?period=${period}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
///dashbord_seller
export const withdraw = createAsyncThunk(
  "finance/withdraw",
  async ({ amount, note }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/finance/withdraw`,
        { amount, note },
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
///dashbord_seller
export const withdraw_requests = createAsyncThunk(
  "finance/withdraw_requests",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/finance/withdraw-requests`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
/// get_balance
export const get_balance = createAsyncThunk(
  "finance/get_balance",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/finance/get_balance`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
///Approving_withdrawal
export const Approving_withdrawal = createAsyncThunk(
  "finance/Approving_withdrawal",
  async (
    { selectedRequest, status },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.patch(
        `/finance/Approving_withdrawal/${selectedRequest._id}`,
        { status },
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
export const financeReducer = createSlice({
  name: "finance",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    financeSummary: null,
    transactions: [],
    analytics: null,
    dashbord_data: null,
    get_withdraw_requests: null,
    get_balances: null,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFinanceSummary.pending, (state) => {
        state.loader = true;
      })
      .addCase(getFinanceSummary.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(getFinanceSummary.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.financeSummary = payload.data;
      })
      .addCase(getTransactions.pending, (state) => {
        state.loader = true;
      })
      .addCase(getTransactions.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(getTransactions.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.transactions = payload.data;
      })
      // getAnalytics
      .addCase(getAnalytics.pending, (state) => {
        state.loader = true;
      })
      .addCase(getAnalytics.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(getAnalytics.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.analytics = payload.data;
      })
      //dashbord_seller
      .addCase(dashbord_seller.pending, (state) => {
        state.loader = true;
      })
      .addCase(dashbord_seller.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(dashbord_seller.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.dashbord_data = payload.data;
      })
      //withdraw
      .addCase(withdraw.pending, (state) => {
        state.loader = true;
      })
      .addCase(withdraw.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(withdraw.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      ///withdraw_requests
      .addCase(withdraw_requests.pending, (state) => {
        state.loader = true;
      })
      .addCase(withdraw_requests.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(withdraw_requests.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.get_withdraw_requests = payload;
      })
      ///get_balance
      .addCase(get_balance.pending, (state) => {
        state.loader = true;
      })
      .addCase(get_balance.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(get_balance.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.get_balances = payload.data;
      })
      //Approving_withdrawal
      .addCase(Approving_withdrawal.pending, (state) => {
        state.loader = true;
      })
      .addCase(Approving_withdrawal.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(Approving_withdrawal.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      });
  },
});
export const { messageClear } = financeReducer.actions;
export default financeReducer.reducer;
