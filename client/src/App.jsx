import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchCurrentUser } from "./redux/slices/authSlice";

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;