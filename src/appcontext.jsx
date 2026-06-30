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
        console.log("useEffect running");
        console.log("serviceURL =", serviceURL);

        fetch(`${serviceURL}/isValid`, {
            method: "POST",
            credentials: "include",
        })
            .then((res) => {
                console.log("Response status:", res.status);

                if (res.ok) {
                    return res.json();
                }

                return null;
            })
            .then((data) => {
                console.log("Response data:", data);

                if (data) {
                    setusername(data.username);
                    setisprevious(data.isPrevious);
                    setislogged(true);

                    console.log("User authenticated");
                } else {
                    console.log("User not logged in");
                }

                console.log("Setting isauthenticated = true");
                setisauthenticated(true);
            })
            .catch((err) => {
                console.error("Fetch error:", err);

                console.log("Setting isauthenticated = true from catch");
                setisauthenticated(true);
            });
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