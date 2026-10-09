import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/NotFound/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import Projects from "../pages/Dashboard/Projects/Projects";
import Templates from "../pages/Dashboard/Templates/Templates";
import Queries from "../pages/Dashboard/Queries/Queries";

import { getAllWebsites } from "../api/websiteApi";
import UserWebPage from "../components/UserWebPage/UserWebPage";
import EditWebsite from "../pages/EditWebsite/EditWebsite";

const AppRoutes = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);

        const data = await getAllWebsites();

        setWebsites(data.websites);
      } catch (error) {
        console.error("Failed to fetch websites:", error);
        setError("Failed to load websites");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Public */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Projects />} />
          <Route path="templates" element={<Templates />} />
          <Route path="notifications" element={<Queries />} />
        </Route>
      </Route>

      {/* User Websites */}
      {websites.map((website) => (
        <>
          <Route
            path={`/${website.slug}`}
            element={<UserWebPage website={website}  websiteId={website._id}/>}
          />

          <Route
            path={`/${website.slug}/edit`}
            element={
              <EditWebsite
                website={website}
                websiteId={website._id}
              />
            }
          />
        </>
      ))}

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;