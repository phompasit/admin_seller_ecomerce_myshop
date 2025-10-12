import { useEffect, useState } from "react";
import "./App.css";
import { getRoutes } from "./router/routes";
import Router from "./router/route";
import publicRoutes from "./router/routes/publicRoutes";
import { registerPush } from "./pages/notification/registerPush";
function App() {
  ///ດືງ router link ສາທາລະນະມາ
  const [allRoutes, setAllRoutes] = useState([...publicRoutes]);
  useEffect(() => {
    const routes = getRoutes();
    setAllRoutes((prevRoutes) => [...prevRoutes, routes]);
  }, []);
  useEffect(() => {
    registerPush();
  }, []);
  return <Router allRoutes={allRoutes} />;
}

export default App;
