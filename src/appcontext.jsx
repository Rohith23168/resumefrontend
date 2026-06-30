import { useEffect, useState } from "react";
import { UserContext } from "./context/usercontext";

console.log("AppContext loaded");

function AppContext({ children }) {
    const backendURL =
        import.meta.env.VITE_API_URL + "/resumeAnalyser/entry/v1";

    const serviceURL =
        import.meta.env.VITE_API_URL + "/resumeAnalyserCore/service/v1";

    const [islogged, setislogged] = useState(false);
    const [isprevious, setisprevious] = useState(false);
    const [username, setusername] = useState("");
    const [isauthenticated, setisauthenticated] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");
        if (urlToken) {
            localStorage.setItem("token", urlToken);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        fetch(`${serviceURL}/isValid`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
            .then((res) => res.ok ? res.json() : null)
            .then((data) => {
                if (data) {
                    setusername(data.username);
                    setisprevious(data.isPrevious);
                    setislogged(true);
                }
                setisauthenticated(true);
            })
            .catch(() => setisauthenticated(true));
    }, [serviceURL]);

    return (
        <UserContext.Provider
            value={{
                islogged,
                setislogged,
                isprevious,
                setisprevious,
                username,
                setusername,
                backendURL,
                serviceURL,
                isauthenticated,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default AppContext;