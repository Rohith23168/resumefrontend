import Styles from "./home.module.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/usercontext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
    const navigate = useNavigate();

    const {
        islogged,
        username,
        isprevious,
        serviceURL,
        setusername,
        setislogged,
        setisprevious,
    } = useContext(UserContext);

    const [isshow, setshow] = useState(false);
    const [isloading, setisloading] = useState(false);
    const [delloading, setdelloading] = useState(false);

    useEffect(() => {
        const func = (event) => {
            if (event.target.id !== "menu") {
                setshow(false);
            }
        };

        window.addEventListener("click", func);

        return () => window.removeEventListener("click", func);
    }, []);

    const toggle = () => {
        setshow(!isshow);
    };

    const logout = () => {
        setisloading(true);

        fetch(`${serviceURL}/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
            .then((response) => {
                if (response.ok) {
                    localStorage.removeItem("token");
                    setusername("");
                    setislogged(false);
                    setisprevious(false);
                    toast.success("Successfully Logged out");
                    navigate("/login");
                } else {
                    toast.error("unauthorised access");
                }
            })
            .catch(() => toast.error("Network Error"))
            .finally(() => setisloading(false));
    };

    const upnavigate = () => {
        if (islogged) {
            navigate("/uploaddoc");
        } else {
            navigate("/login");
        }
    };

    const confirmagain = () => {
        document.getElementById("confirmdivdel").style.display = "flex";
    };

    const closedeldiv = () => {
        document.getElementById("confirmdivdel").style.display = "none";
    };

    const delaccount = () => {
        setdelloading(true);

        fetch(`${serviceURL}/delete`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
            .then((res) => {
                if (res.ok) {
                    localStorage.removeItem("token");
                    toast.success("Account deleted");
                    setusername("");
                    setislogged(false);
                    setisprevious(false);
                    navigate("/login");
                } else {
                    toast.error("Failed to delete account");
                }
            })
            .catch(() => toast.error("Network Error"))
            .finally(() => setdelloading(false));
    };

    return (
        <div className={Styles.container}>
            <div className={Styles.nav}>
                <h1>Resume Analyser</h1>

                {!islogged ? (
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                ) : (
                    <h3 id="menu" onClick={toggle} className={Styles.profile}>
                        {username?.[0]?.toUpperCase()}
                    </h3>
                )}
            </div>

            {isshow && islogged ? (
                <div id="menu" className={Styles.profilemenu}>
                    <h2 id="menu">{username}</h2>
                    <hr id="menu" />

                    <div id="menu" className={Styles.pmenusec}>
                        <button id="menu" onClick={logout} disabled={isloading}>
                            Logout
                        </button>

                        <button id="menu" onClick={confirmagain} disabled={isloading}>
                            <span className={Styles.del}>Delete account</span>
                        </button>
                    </div>
                </div>
            ) : null}

            <img
                className={Styles.bg}
                src="https://cdn.jsdelivr.net/gh/Mohamed-Imran-34/Datahub@main/Analysis.png"
                alt="AnalysisBg"
            />

            <div className={Styles.core}>
                <h1>Hello Welcome!</h1>
                <p>
                    Boost your career with our Resume Analyser. Upload your resume and get
                    instant insights on ATS score, keywords, skills, and formatting.
                </p>

                <div className={Styles.btncontainer}>
                    <button disabled={isloading} onClick={upnavigate}>
                        Analyse Resume
                    </button>

                    {isprevious ? (
                        <button disabled={isloading} onClick={() => navigate("/analysereport")}>
                            Previous Analysis
                        </button>
                    ) : null}
                </div>
            </div>

            <div className={Styles.delcontainer} id="confirmdivdel">
                <div className={Styles.confirmcontainer}>
                    <p>
                        Are you sure want to delete your account ?
                        <br />
                        <br />
                        It will permanently removes all your data and can't be recovered.
                    </p>

                    <div className={Styles.confirmationbtns}>
                        <button
                            className={Styles.confirmdel}
                            disabled={delloading}
                            onClick={delaccount}
                        >
                            {delloading ? "Deleting ..." : "Delete"}
                        </button>

                        <button
                            className={Styles.notnow}
                            disabled={delloading}
                            onClick={closedeldiv}
                        >
                            Not now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;