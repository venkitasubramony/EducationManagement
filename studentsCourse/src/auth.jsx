import { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router";
const Auth = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const url = isLogin
                ? `${import.meta.env.VITE_API_URL}/api/auth/login`
                : `${import.meta.env.VITE_API_URL}/api/auth/register`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (!response.ok) {
                setError(result.msg);
                return;
            }
            //console.log(isLogin ? "Logged in" : "Student created:", result);
            alert(result.msg);

            // Clear form
            setFormData({
                email: "",
                password: ""
            });
            if (result.msg == 'successfully logged') {
                localStorage.setItem("token", result.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(result.userInfo)
                );
                navigate('/dashboard')
            }

        } catch (error) {
            console.log("Error:", error);
            alert("something went wrong");
        } finally {
            setLoading(false);
        }

        // console.log(
        //     isLogin ? "Login Data:" : "Register Data:",
        //     formData
        // );
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* HEADER */}

                <div className="auth-header">

                    <div className="auth-logo">
                        SC
                    </div>

                    <h1>
                        {isLogin
                            ? "Welcome Back"
                            : "Create Account"}
                    </h1>

                    <p>
                        {isLogin
                            ? "Login to manage your student courses."
                            : "Register to start managing student courses."}
                    </p>

                </div>


                {/* FORM */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    {/* EMAIL */}

                    <div className="form-group">

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* FORGOT PASSWORD */}

                    {/* {isLogin && (
                        <div className="forgot-password">
                            <button
                                type="button"
                                onClick={() =>
                                    console.log(
                                        "Forgot password"
                                    )
                                }
                            >
                                Forgot password?
                            </button>
                        </div>
                    )} */}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="auth-submit-btn" disabled={loading}
                    >
                        {loading ? "Submitting..." :isLogin
                            ?  "Login"
                            : "Register"}
                    </button>

                </form>


                {/* SWITCH LOGIN / REGISTER */}

                <div className="auth-switch">

                    <span>
                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}
                    </span>

                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);

                            setFormData({
                                email: "",
                                password: ""
                            });
                        }}
                    >
                        {isLogin
                            ? "Register"
                            : "Login"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Auth;