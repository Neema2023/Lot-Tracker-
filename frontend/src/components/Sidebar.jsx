import {
    LayoutDashboard,
    Package,
    History,
    X,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import {
    useLocation,
    useNavigate
} from "react-router-dom";

function Sidebar({
    isOpen,
    onClose,
    collapsed,
    setCollapsed
}) {

    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );


    /*
    ========================================================
    SIDEBAR MENU
    ========================================================
    */

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },

        {
            name: "Lots",
            path: "/lots",
            icon: Package
        },

        {
            name: "Audit Trail",
            path: "/audit",
            icon: History
        }
    ];


    /*
    ========================================================
    NAVIGATION
    ========================================================
    */

    const handleNavigation = (path) => {

        navigate(path);

        onClose();
    };


    /*
    ========================================================
    CHECK ACTIVE MENU
    ========================================================
    */

    const isMenuActive = (path) => {

        if (path === "/lots") {

            return (
                location.pathname === "/lots" ||
                location.pathname.startsWith("/lots/")
            );

        }

        return location.pathname === path;
    };


    return (
        <>
            <style>{`

                /* =================================================
                   SIDEBAR
                ================================================= */

                .sidebar {
                    position: fixed;

                    top: 0;
                    left: 0;

                    width: 255px;
                    height: 100vh;

                    background:
                        linear-gradient(
                            180deg,
                            #111827 0%,
                            #172554 100%
                        );

                    color: white;

                    display: flex;

                    flex-direction: column;

                    z-index: 1000;

                    overflow: hidden;

                    transition:
                        width 0.25s ease,
                        transform 0.25s ease;

                    box-shadow:
                        8px 0 30px
                        rgba(15, 23, 42, 0.12);
                }


                /* =================================================
                   SIDEBAR HEADER
                ================================================= */

                .sidebar-header {
                    height: 82px;

                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    padding: 0 20px;

                    border-bottom:
                        1px solid
                        rgba(255, 255, 255, 0.08);

                    flex-shrink: 0;
                }


                /* =================================================
                   LOGO
                ================================================= */

                .sidebar-logo {
                    display: flex;

                    align-items: center;

                    gap: 12px;

                    color: white;

                    font-size: 18px;

                    font-weight: 700;

                    white-space: nowrap;
                }


                .sidebar-logo-icon {
                    width: 40px;

                    height: 40px;

                    border-radius: 11px;

                    background:
                        linear-gradient(
                            135deg,
                            #3b82f6,
                            #2563eb
                        );

                    color: white;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    flex-shrink: 0;

                    box-shadow:
                        0 5px 15px
                        rgba(37, 99, 235, 0.35);
                }


                /* =================================================
                   MOBILE CLOSE
                ================================================= */

                .sidebar-close {
                    display: none;

                    width: 34px;

                    height: 34px;

                    border: none;

                    border-radius: 8px;

                    background:
                        rgba(255, 255, 255, 0.08);

                    color:
                        rgba(255, 255, 255, 0.75);

                    cursor: pointer;

                    align-items: center;

                    justify-content: center;
                }


                .sidebar-close:hover {
                    background:
                        rgba(255, 255, 255, 0.14);

                    color: white;
                }


                /* =================================================
                   NAVIGATION
                ================================================= */

                .sidebar-nav {
                    flex: 1;

                    padding: 28px 14px;

                    overflow-y: auto;
                }


                .sidebar-nav::-webkit-scrollbar {
                    width: 4px;
                }


                .sidebar-nav::-webkit-scrollbar-thumb {
                    background:
                        rgba(255, 255, 255, 0.15);

                    border-radius: 10px;
                }


                /* =================================================
                   SECTION TITLE
                ================================================= */

                .sidebar-section-title {
                    font-size: 10px;

                    font-weight: 700;

                    letter-spacing: 0.12em;

                    color:
                        rgba(255, 255, 255, 0.38);

                    padding:
                        0 12px;

                    margin-bottom: 12px;
                }


                /* =================================================
                   MENU ITEM
                ================================================= */

                .sidebar-item {
                    position: relative;

                    width: 100%;

                    height: 48px;

                    border: none;

                    border-radius: 10px;

                    background: transparent;

                    color:
                        rgba(255, 255, 255, 0.65);

                    display: flex;

                    align-items: center;

                    gap: 13px;

                    padding: 0 13px;

                    margin-bottom: 6px;

                    cursor: pointer;

                    font-size: 13px;

                    font-weight: 500;

                    text-align: left;

                    transition:
                        background 0.2s ease,
                        color 0.2s ease,
                        transform 0.2s ease;
                }


                .sidebar-item:hover {
                    background:
                        rgba(255, 255, 255, 0.07);

                    color: white;

                    transform:
                        translateX(2px);
                }


                /* =================================================
                   ACTIVE MENU
                ================================================= */

                .sidebar-item-active {
                    background:
                        linear-gradient(
                            90deg,
                            rgba(37, 99, 235, 0.95),
                            rgba(59, 130, 246, 0.75)
                        );

                    color: white;

                    font-weight: 600;

                    box-shadow:
                        0 6px 18px
                        rgba(37, 99, 235, 0.25);
                }


                .sidebar-item-active:hover {
                    background:
                        linear-gradient(
                            90deg,
                            rgba(37, 99, 235, 1),
                            rgba(59, 130, 246, 0.85)
                        );

                    transform: none;
                }


                /* =================================================
                   ACTIVE INDICATOR
                ================================================= */

                .sidebar-item-active::before {
                    content: "";

                    position: absolute;

                    left: 0;

                    top: 10px;

                    width: 3px;

                    height: 28px;

                    border-radius:
                        0 4px 4px 0;

                    background: white;
                }


                /* =================================================
                   BOTTOM AREA
                ================================================= */

                .sidebar-bottom {
                    padding:
                        16px 14px 18px;

                    border-top:
                        1px solid
                        rgba(255, 255, 255, 0.08);

                    background:
                        rgba(0, 0, 0, 0.10);
                }


                /* =================================================
                   USER
                ================================================= */

                .sidebar-user {
                    display: flex;

                    align-items: center;

                    gap: 11px;

                    padding: 9px;

                    margin-bottom: 12px;

                    min-width: 0;

                    border-radius: 10px;

                    background:
                        rgba(255, 255, 255, 0.05);
                }


                /* =================================================
                   AVATAR
                ================================================= */

                .sidebar-avatar {
                    width: 38px;

                    height: 38px;

                    border-radius: 10px;

                    background:
                        linear-gradient(
                            135deg,
                            #60a5fa,
                            #2563eb
                        );

                    color: white;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 13px;

                    font-weight: 700;

                    flex-shrink: 0;
                }


                /* =================================================
                   USER INFO
                ================================================= */

                .sidebar-user-info {
                    display: flex;

                    flex-direction: column;

                    gap: 4px;

                    min-width: 0;
                }


                .sidebar-user-info strong {
                    font-size: 12px;

                    color: white;

                    overflow: hidden;

                    text-overflow: ellipsis;

                    white-space: nowrap;
                }


                .sidebar-user-info span {
                    display: inline-flex;

                    width: fit-content;

                    font-size: 9px;

                    color: #bfdbfe;

                    font-weight: 700;

                    background:
                        rgba(59, 130, 246, 0.15);

                    border-radius: 5px;

                    padding:
                        3px 7px;
                }


                /* =================================================
                   COLLAPSE BUTTON
                ================================================= */

                .sidebar-collapse {
                    width: 100%;

                    height: 38px;

                    border:
                        1px solid
                        rgba(255, 255, 255, 0.10);

                    border-radius: 8px;

                    background:
                        rgba(255, 255, 255, 0.05);

                    color:
                        rgba(255, 255, 255, 0.65);

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 7px;

                    cursor: pointer;

                    font-size: 11px;

                    transition: 0.2s;
                }


                .sidebar-collapse:hover {
                    background:
                        rgba(255, 255, 255, 0.10);

                    color: white;
                }


                /* =================================================
                   COLLAPSED SIDEBAR
                ================================================= */

                .sidebar-collapsed {
                    width: 78px;
                }


                .sidebar-collapsed
                .sidebar-header {
                    justify-content: center;

                    padding: 0;
                }


                .sidebar-collapsed
                .sidebar-logo {
                    justify-content: center;
                }


                .sidebar-collapsed
                .sidebar-nav {
                    padding-left: 10px;

                    padding-right: 10px;
                }


                .sidebar-collapsed
                .sidebar-section-title {
                    text-align: center;

                    padding: 0;

                    height: 5px;
                }


                .sidebar-collapsed
                .sidebar-item {
                    justify-content: center;

                    padding: 0;
                }


                .sidebar-collapsed
                .sidebar-item-active::before {
                    display: none;
                }


                .sidebar-collapsed
                .sidebar-user {
                    justify-content: center;

                    padding: 8px 0;

                    background: transparent;
                }


                .sidebar-collapsed
                .sidebar-collapse {
                    padding: 0;
                }


                /* =================================================
                   MOBILE OVERLAY
                ================================================= */

                .sidebar-overlay {
                    display: none;
                }


                /* =================================================
                   TABLET
                ================================================= */

                @media (max-width: 1000px) {

                    .sidebar {
                        width: 225px;
                    }

                }


                /* =================================================
                   MOBILE
                ================================================= */

                @media (max-width: 800px) {

                    .sidebar {
                        width: 255px;

                        transform:
                            translateX(-100%);

                        box-shadow:
                            15px 0 40px
                            rgba(0, 0, 0, 0.18);
                    }


                    .sidebar-open {
                        transform:
                            translateX(0);
                    }


                    .sidebar-close {
                        display: flex;
                    }


                    .sidebar-overlay {
                        display: block;

                        position: fixed;

                        inset: 0;

                        background:
                            rgba(15, 23, 42, 0.55);

                        backdrop-filter:
                            blur(2px);

                        z-index: 999;
                    }


                    .sidebar-collapse {
                        display: none;
                    }

                }


                /* =================================================
                   SMALL MOBILE
                ================================================= */

                @media (max-width: 480px) {

                    .sidebar {
                        width: 240px;
                    }

                }

            `}</style>


            {/* =================================================
                MOBILE OVERLAY
            ================================================= */}

            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={onClose}
                />
            )}


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={`
                    sidebar
                    ${isOpen
                        ? "sidebar-open"
                        : ""
                    }
                    ${collapsed
                        ? "sidebar-collapsed"
                        : ""
                    }
                `}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="sidebar-header">

                    <div className="sidebar-logo">

                        <div className="sidebar-logo-icon">

                            <Package size={21} />

                        </div>


                        {!collapsed && (
                            <span>
                                Lot Tracker
                            </span>
                        )}

                    </div>


                    {/* MOBILE CLOSE */}

                    <button
                        className="sidebar-close"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav className="sidebar-nav">

                    {!collapsed && (
                        <p className="sidebar-section-title">
                            MAIN MENU
                        </p>
                    )}


                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        const isActive =
                            isMenuActive(
                                item.path
                            );


                        return (
                            <button
                                key={item.path}

                                className={`
                                    sidebar-item
                                    ${
                                        isActive
                                            ? "sidebar-item-active"
                                            : ""
                                    }
                                `}

                                onClick={() =>
                                    handleNavigation(
                                        item.path
                                    )
                                }

                                title={
                                    collapsed
                                        ? item.name
                                        : ""
                                }
                            >

                                <Icon size={19} />

                                {!collapsed && (
                                    <span>
                                        {item.name}
                                    </span>
                                )}

                            </button>
                        );

                    })}

                </nav>


                {/* =================================================
                    USER AREA
                ================================================= */}

                <div className="sidebar-bottom">

                    


                    {/* =================================================
                        COLLAPSE
                    ================================================= */}

                    <button
                        className="sidebar-collapse"

                        onClick={() =>
                            setCollapsed(
                                !collapsed
                            )
                        }

                        title={
                            collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >

                        {collapsed ? (

                            <ChevronRight
                                size={18}
                            />

                        ) : (

                            <>
                                <ChevronLeft
                                    size={17}
                                />

                                <span>
                                    Collapse
                                </span>
                            </>

                        )}

                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;