import { useEffect, useState } from "react";
import "./App.css";
// import { useDispatch } from "react-redux";
import { getRoutes } from "./router/routes";
import Router from "./router/route";
import publicRoutes from "./router/routes/publicRoutes";
import { registerPush } from "./pages/notification/registerPush";
function App() {
  ///ດືງ router link ສາທາລະນະມາ
  const [allRoutes, setAllRoutes] = useState([...publicRoutes]);
  useEffect(() => {
    ///ດືງ ເລົາ ສ່ວນຕົວມາ
    const routes = getRoutes();
    //ເອົາມາລວມໃສ່ກັນ
    setAllRoutes((prevRoutes) => [...prevRoutes, routes]);
  }, []);
  useEffect(() => {
    registerPush();
  }, []);
  //send out
  return <Router allRoutes={allRoutes} />;
}

export default App;
