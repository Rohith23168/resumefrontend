import { useContext, useState, useEffect } from "react";
import Styles from "./login.module.css";
import { toast } from "react-toastify";
import { usercontext } from "../appcontext";
import { useNavigate, Link } from "react-router-dom";
import GoogleButton from "../googlebtn.jsx";

function Login() {
    const navigate = useNavigate();
    const [islogin, setislogin] = useState(true);
    const { backendURL, setisprevious, setusername, setislogged, islogged } = useContext(usercontext);
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const [isloading, setisloading] = useState(false);
    const [showpass, setshowpass] = useState(false);
    const [showconfirmpass, setshowconfirmpass] = useState(false);

    useEffect(() => {
        if (islogged) navigate("/");
    }, [islogged]);

    function validateEmail(email) {
        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailregex.test(email);
    }

    const submit = (event) => {
        event.preventDefault();

        if (!islogin) {
            // Signup flow — direct register, no OTP
            if (name.trim() === "") { toast.warn("Username must not be empty"); return; }
            if (email.trim() === "") { toast.warn("Email must not be empty"); return; }
            if (!validateEmail(email.trim())) { toast.warn("Invalid Email"); return; }
            if (password.length < 6) { toast.warn("Password at least 6 characters"); return; }
            if (password !== confirmpassword) { toast.warn("Passwords don't match"); return; }

            setisloading(true);
            fetch(`${backendURL}/register`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: name.trim(),
                    email: email.trim(),
                    password: password
                })
            })
                .then(response => {
                    if (response.ok) {
                        toast.success("Account created successfully! Please login.");
                        setname("");
                        setemail("");
                        setpassword("");
                        setconfirmpassword("");
                        setshowpass(false);
                        setshowconfirmpass(false);
                        setislogin(true);
                        setisloading(false);
                    } else if (response.status === 409) {
                        toast.error("Email already registered");
                        setisloading(false);
                    } else {
                        toast.error("Registration failed. Please try again.");
                        setisloading(false);
                    }
                })
                .catch(() => {
                    toast.error("Network error. Please check your connection.");
                    setisloading(false);
                });

        } else {
            // Login flow — unchanged
            if (email.trim() === "") { toast.warn("Email must not be empty"); return; }
            if (!validateEmail(email.trim())) { toast.warn("Invalid Email"); return; }
            if (password.length < 6) { toast.warn("Password at least 6 characters"); return; }

            setisloading(true);
            fetch(`${backendURL}/login`, {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password: password }),
                credentials: "include"
            })
                .then(response => {
                    if (response.ok) {
                        setemail("");
                        setpassword("");
                        setshowpass(false);
                        setisloading(false);
                        toast.success("Successfully logged in");
                        return response.json();
                    } else {
                        setisloading(false);
                        toast.error("Invalid credentials");
                        return null;
                    }
                })
                .then(data => {
                    if (data != null) {
                        setislogged(true);
                        setusername(data.username);
                        setisprevious(data.isPrevious);
                        navigate("/");
                    }
                })
                .catch(() => {
                    toast.error("Login failed");
                    setisloading(false);
                });
        }
    };

    function switchmth() {
        setname(""); setemail(""); setpassword("");
        setconfirmpassword(""); setshowpass(false); setshowconfirmpass(false);
        setislogin(!islogin);
    }

    return (
        <div className={Styles.container}>
            <div className={Styles.nav}>
                <h1>Resume Analyser</h1>
            </div>
            <div className={Styles.logincontainer}>
                <h1>{islogin ? "Login" : "Signup"}</h1>
                {!islogin &&
                    <input
                        className={Styles.logincontainerinput}
                        onChange={(e) => setname(e.target.value)}
                        type="text" name="username" maxLength={20}
                        autoComplete="off" value={name} placeholder="Username"
                    />
                }
                <input
                    type="email"
                    className={Styles.logincontainerinput}
                    onChange={(e) => setemail(e.target.value)}
                    name="email" value={email} autoComplete="off" placeholder="Email"
                />
                <div className={Styles.passdiv}>
                    <input
                        type={showpass ? "text" : "password"}
                        onChange={(e) => setpassword(e.target.value)}
                        name="password" value={password} autoComplete="off" placeholder="Password"
                    />
                    <i className={`fa-solid ${showpass ? "fa-eye-slash" : "fa-eye"}`}
                       onClick={() => setshowpass(!showpass)} />
                </div>
                {!islogin &&
                    <div className={Styles.passdiv}>
                        <input
                            type={showconfirmpass ? "text" : "password"}
                            onChange={(e) => setconfirmpassword(e.target.value)}
                            name="confirmpassword" autoComplete="off"
                            value={confirmpassword} placeholder="Confirm password"
                        />
                        <i className={`fa-solid ${showconfirmpass ? "fa-eye-slash" : "fa-eye"}`}
                           onClick={() => setshowconfirmpass(!showconfirmpass)} />
                    </div>
                }
                {islogin &&
                    <Link className={Styles.linkdis} to="/forgotpassword">
                        <p className={Styles.forgetpass}>Forgot password?</p>
                    </Link>
                }
                <button
                    className={Styles.logincontainerbutton}
                    onClick={submit}
                    disabled={isloading}
                >
                    {isloading ? "Loading..." : islogin ? "Login" : "Signup"}
                </button>
                <p>
                    {islogin ? "Doesn't have an account? " : "Already have an account? "}
                    <span className={Styles.logincontainerspan} onClick={switchmth}>
                        {islogin ? "Signup" : "Login"}
                    </span>
                </p>
                <hr className={Styles.ghr} />
                <GoogleButton />
            </div>
        </div>
    );
}

export default Login;