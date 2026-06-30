import { useEffect, useState } from "react";
import { UserContext } from "./context/userContext";

function AppContext({ children }) {
    const backendURL =
        import.meta.env.VITE_API_URL + "/resumeAnalyser/entry/v1";

    const serviceURL =
        import.meta.env.VITE_API_URL + "/resumeAnalyserCore/service/v1";

    const [isLogged, setIsLogged] = useState(false);
    const [isPrevious, setIsPrevious] = useState(false);
    const [username, setUsername] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        fetch(serviceURL + "/isValid", {
            method: "POST",
            credentials: "include",
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data) {
                    setUsername(data.username);
                    setIsPrevious(data.isPrevious);
                    setIsLogged(true);
                }
                setIsAuthenticated(true);
            })
            .catch(() => setIsAuthenticated(true));
    }, [serviceURL]);

    return (
        <UserContext.Provider
            value={{
                isLogged,
                setIsLogged,
                isPrevious,
                setIsPrevious,
                username,
                setUsername,
                backendURL,
                serviceURL,
                isAuthenticated,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default AppContext;