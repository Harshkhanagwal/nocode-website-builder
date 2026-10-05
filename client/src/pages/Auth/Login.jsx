import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../redux/slices/authSlice";

import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(login(formData)).unwrap();

      navigate("/dashboard");
    } catch (error) {
      // Error is already stored in Redux
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">

        <div className="login-header">
          <div className="login-logo">L</div>

          <h1 className="login-title">
            Welcome back
          </h1>

          <p className="login-description">
            Sign in to continue building with AI.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-field">
            <label className="login-label">
              Email
            </label>

            <input
              type="email"
              name="email"
              className="login-input"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="login-field">
            <div className="login-password-header">
              <label className="login-label">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="login-forgot-link"
              >
                Forgot password?
              </Link>
            </div>

            <input
              type="password"
              name="password"
              className="login-input"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <span>Don't have an account?</span>

          <Link
            to="/register"
            className="login-register-link"
          >
            Create account
          </Link>
        </div>

      </section>
    </main>
  );
};

export default Login;