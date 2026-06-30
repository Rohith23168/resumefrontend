import { useEffect, useState } from "react";
import { UserContext } from "./context/usercontext";

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
        fetch(serviceURL + "/isValid", {
            method: "POST",
            credentials: "include",
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data) {
                    setusername(data.username);
                    setisprevious(data.isPrevious);
                    setislogged(true);
                }

                setisauthenticated(true);
            })
            .catch(() => {
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