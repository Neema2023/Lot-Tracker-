import { useState } from "react";
import axios from "axios";
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ============================================================
// API URL - Hardcoded for production
// ============================================================

const API_URL = "https://lot-tracker-urg2.onrender.com/api";

function Login() {
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    // =========================
    // HANDLE REGISTER / LOGIN
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {

            // =========================
            // REGISTER
            // =========================

            if (isRegister) {

                const response = await axios.post(
                    `${API_URL}/auth/register`,
                    {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    }
                );

                console.log(
                    "Register response:",
                    response.data
                );

                // Show success message
                setSuccess(
                    "Registration successful! Please sign in."
                );

                // Switch to Login
                setIsRegister(false);

                // Keep email so user does not need to type it again
                setFormData({
                    name: "",
                    email: formData.email,
                    password: ""
                });

                return;
            }

            // =========================
            // LOGIN
            // =========================

            const response = await axios.post(
                `${API_URL}/auth/login`,
                {
                    email: formData.email,
                    password: formData.password
                }
            );

            console.log(
                "Login response:",
                response.data
            );

            // =========================
            // GET TOKEN + USER
            // =========================

            const { token, user } = response.data;

            // =========================
            // SAVE AUTH DATA
            // =========================

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // =========================
            // GO TO DASHBOARD
            // =========================

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Authentication error:",
                error
            );

            // Backend returned an error
            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Something went wrong."
                );

            } else if (error.request) {

                setError(
                    "Cannot connect to the server. Make sure the backend is running."
                );

            } else {

                setError(
                    "An unexpected error occurred. Please try again."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // SWITCH LOGIN / REGISTER
    // =========================

    const switchMode = () => {

        setIsRegister((previousMode) => !previousMode);

        setFormData({
            name: "",
            email: "",
            password: ""
        });

        setError("");
        setSuccess("");
        setShowPassword(false);
    };

    return (
        <div className="auth-page">

            <div className="auth-container">

                {/* =========================
                    LEFT BRAND SIDE
                ========================= */}

                <div className="auth-brand">

                    <div className="brand-icon">
                        <Package size={30} />
                    </div>

                    <h1>
                        Lot Tracker
                    </h1>

                    <p>
                        Manage and track your material lots
                        through every processing stage.
                    </p>

                    <div className="brand-info">

                        <div>
                            <strong>
                                Track
                            </strong>

                            <span>
                                Every lot in one place
                            </span>
                        </div>

                        <div>
                            <strong>
                                Monitor
                            </strong>

                            <span>
                                Processing status
                            </span>
                        </div>

                        <div>
                            <strong>
                                Audit
                            </strong>

                            <span>
                                Complete status history
                            </span>
                        </div>

                    </div>

                </div>


                {/* =========================
                    RIGHT FORM SIDE
                ========================= */}

                <div className="auth-form-section">

                    <div className="auth-form-wrapper">

                        {/* MOBILE BRAND */}

                        <div className="mobile-brand">

                            <div className="brand-icon">

                                <Package size={25} />

                            </div>

                            <span>
                                Lot Tracker
                            </span>

                        </div>


                        {/* =========================
                            HEADING
                        ========================= */}

                        <div className="auth-heading">

                            <h2>
                                {isRegister
                                    ? "Create your account"
                                    : "Welcome back"
                                }
                            </h2>

                            <p>
                                {isRegister
                                    ? "Create an account to access Lot Tracker."
                                    : "Sign in to continue to your dashboard."
                                }
                            </p>

                        </div>


                        {/* =========================
                            ERROR MESSAGE
                        ========================= */}

                        {error && (
                            <div className="auth-message error-message">
                                {error}
                            </div>
                        )}


                        {/* =========================
                            SUCCESS MESSAGE
                        ========================= */}

                        {success && (
                            <div className="auth-message success-message">
                                {success}
                            </div>
                        )}


                        {/* =========================
                            FORM
                        ========================= */}

                        <form onSubmit={handleSubmit}>

                            {/* =========================
                                NAME
                            ========================= */}

                            {isRegister && (

                                <div className="form-group">

                                    <label htmlFor="name">
                                        Full Name
                                    </label>

                                    <div className="input-wrapper">

                                        <User size={18} />

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                </div>

                            )}


                            {/* =========================
                                EMAIL
                            ========================= */}

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="input-wrapper">

                                    <Mail size={18} />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* =========================
                                PASSWORD
                            ========================= */}

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="input-wrapper">

                                    <Lock size={18} />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* =========================
                                VIEWER ROLE NOTE
                            ========================= */}

                            {isRegister && (

                                <p className="role-note">

                                    New accounts are created as{" "}

                                    <strong>
                                        VIEWER
                                    </strong>

                                    . Editor access is managed by
                                    authorized administrators.

                                </p>

                            )}


                            {/* =========================
                                SUBMIT BUTTON
                            ========================= */}

                            <button
                                type="submit"
                                className="auth-submit"
                                disabled={loading}
                            >

                                {loading
                                    ? "Please wait..."
                                    : isRegister
                                        ? "Create Account"
                                        : "Sign In"
                                }

                            </button>

                        </form>


                        {/* =========================
                            SWITCH LOGIN / REGISTER
                        ========================= */}

                        <div className="auth-switch">

                            <span>
                                {isRegister
                                    ? "Already have an account?"
                                    : "Don't have an account?"
                                }
                            </span>

                            <button
                                type="button"
                                onClick={switchMode}
                            >

                                {isRegister
                                    ? "Sign In"
                                    : "Create Account"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;