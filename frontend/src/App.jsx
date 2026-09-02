import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Lots from "./pages/Lots";
import LotDetails from "./pages/LotDetails";
import AuditTrail from "./pages/AuditTrail";


function App() {

    const token =
        localStorage.getItem("token");


    return (

        <BrowserRouter>

            <Routes>

                {/* =================================================
                    LOGIN
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <Login />
                    }
                />


                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <Route
                    path="/dashboard"
                    element={
                        token ? (
                            <Dashboard />
                        ) : (
                            <Navigate
                                to="/"
                                replace
                            />
                        )
                    }
                />


                {/* =================================================
                    LOTS
                ================================================= */}

                <Route
                    path="/lots"
                    element={
                        token ? (
                            <Lots />
                        ) : (
                            <Navigate
                                to="/"
                                replace
                            />
                        )
                    }
                />


                {/* =================================================
                    LOT DETAILS
                ================================================= */}

                <Route
                    path="/lots/:id"
                    element={
                        token ? (
                            <LotDetails />
                        ) : (
                            <Navigate
                                to="/"
                                replace
                            />
                        )
                    }
                />


                {/* =================================================
                    AUDIT TRAIL
                ================================================= */}

                <Route
                    path="/audit"
                    element={
                        token ? (
                            <AuditTrail />
                        ) : (
                            <Navigate
                                to="/"
                                replace
                            />
                        )
                    }
                />


                {/* =================================================
                    UNKNOWN ROUTE
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}


export default App;