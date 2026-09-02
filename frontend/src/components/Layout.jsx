import { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    return (
        <>
            <style>{`

                .app-layout {
                    min-height: 100vh;
                    background: #f5f7fb;
                }


                .app-content {
                    min-height: 100vh;

                    margin-left: 250px;

                    transition:
                        margin-left 0.25s ease;
                }


                .layout-sidebar-collapsed
                .app-content {
                    margin-left: 78px;
                }


                .page-content {
                    width: 100%;

                    max-width: 1500px;

                    margin: 0 auto;

                    padding: 30px;
                }


                @media (max-width: 1000px) {

                    .app-content {
                        margin-left: 220px;
                    }


                    .layout-sidebar-collapsed
                    .app-content {
                        margin-left: 78px;
                    }


                    .page-content {
                        padding: 25px;
                    }

                }


                @media (max-width: 800px) {

                    .app-content,
                    .layout-sidebar-collapsed
                    .app-content {
                        margin-left: 0;
                    }

                }

            `}</style>


            <div
                className={`
                    app-layout
                    ${
                        sidebarCollapsed
                            ? "layout-sidebar-collapsed"
                            : ""
                    }
                `}
            >

                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() =>
                        setSidebarOpen(false)
                    }
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />


                <div className="app-content">

                    <Header
                        onMenuClick={() =>
                            setSidebarOpen(true)
                        }
                    />


                    <main className="page-content">

                        {children}

                    </main>

                </div>

            </div>
        </>
    );
}

export default Layout;