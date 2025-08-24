
import { combineReducers } from "redux";
import  authReducer  from "./reducer/auth_reducer";
import  provider_reducer  from "./reducer/admin_reducer/provider_reducer";
import provider_sellers from "./reducer/sellers_reducer/provider_sellers";
const rootReducer = combineReducers({
 auth:authReducer,
 provider_reducer: provider_reducer,
 provider_sellers: provider_sellers,
});
export default rootReducer;