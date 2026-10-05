import "./Register.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slices/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        name: "",
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
        try {
            e.preventDefault();

            await dispatch(register(formData)).unwrap();
            navigate("/dashboard");
        } catch (err) {
            // handled by redux
        }
    };

    return (
        <main className="register-page">
            <section className="register-card">

                <div className="register-header">
                    <div className="register-logo">L</div>

                    <h1 className="register-title">
                        Create your account
                    </h1>

                    <p className="register-description">
                        Start building your website with AI.
                    </p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>

                    <div className="register-field">
                        <label className="register-label">
                            Full name
                        </label>

                        <input
                            type="text"
                            className="register-input"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            name={"name"}

                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">
                            Email
                        </label>

                        <input
                            type="email"
                            className="register-input"
                            placeholder="you@example.com"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}

                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">
                            Password
                        </label>

                        <input
                            type="password"
                            className="register-input"
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <label className="register-terms">
                        <input type="checkbox" />
                        <span>
                            I agree to the Terms and Privacy Policy
                        </span>
                    </label>

                    {error && (
                        <p className="register-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="register-button"
                    >
                        Create account
                    </button>

                </form>

                <div className="register-footer">
                    <span>Already have an account?</span>

                    <a href="/login" className="register-login-link">
                        Login
                    </a>
                </div>

            </section>
        </main>
    );
};

export default Register;