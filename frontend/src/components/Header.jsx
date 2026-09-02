import {
    Menu,
    Bell,
    LogOut,
    X
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ onMenuClick }) {

    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] =
        useState(false);

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <>
            {/* =========================
                HEADER CSS
            ========================= */}

            <style>{`

                /* HEADER */

                .app-header {
                    height: 72px;

                    background: #ffffff;

                    border-bottom:
                        1px solid #e5e7eb;

                    display: flex;

                    align-items: center;

                    justify-content:
                        space-between;

                    padding: 0 30px;

                    position: sticky;

                    top: 0;

                    z-index: 900;

                    box-shadow:
                        0 2px 10px
                        rgba(15, 23, 42, 0.03);
                }


                /* HEADER LEFT */

                .header-left {
                    display: flex;

                    align-items: center;

                    gap: 15px;
                }


                /* PAGE TITLE */

                .header-page-title {
                    display: flex;

                    flex-direction: column;

                    gap: 3px;
                }


                .header-small-title {
                    font-size: 9px;

                    font-weight: 700;

                    color: #2563eb;

                    letter-spacing: 0.08em;
                }


                .header-page-title h1 {
                    font-size: 16px;

                    color: #111827;

                    font-weight: 700;
                }


                /* MOBILE MENU */

                .mobile-menu-button {
                    display: none;

                    width: 38px;

                    height: 38px;

                    border:
                        1px solid #e5e7eb;

                    border-radius: 8px;

                    background: white;

                    color: #374151;

                    align-items: center;

                    justify-content: center;

                    cursor: pointer;
                }


                .mobile-menu-button:hover {
                    background: #f9fafb;

                    color: #2563eb;
                }


                /* HEADER RIGHT */

                .header-right {
                    display: flex;

                    align-items: center;

                    gap: 16px;
                }


                /* NOTIFICATION BUTTON */

                .header-icon-button {
                    position: relative;

                    width: 38px;

                    height: 38px;

                    border:
                        1px solid #e5e7eb;

                    border-radius: 9px;

                    background: white;

                    color: #6b7280;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    cursor: pointer;

                    transition: 0.2s;
                }


                .header-icon-button:hover {
                    background: #f9fafb;

                    color: #2563eb;
                }


                /* NOTIFICATION DOT */

                .notification-dot {
                    position: absolute;

                    top: 8px;

                    right: 8px;

                    width: 6px;

                    height: 6px;

                    background: #2563eb;

                    border-radius: 50%;
                }


                /* USER */

                .header-user {
                    display: flex;

                    align-items: center;

                    gap: 9px;

                    padding-left: 5px;
                }


                /* AVATAR */

                .header-avatar {
                    width: 36px;

                    height: 36px;

                    border-radius: 50%;

                    background: #172554;

                    color: white;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 12px;

                    font-weight: 700;
                }


                /* USER INFO */

                .header-user-info {
                    display: flex;

                    flex-direction: column;

                    gap: 3px;
                }


                .header-user-info strong {
                    font-size: 12px;

                    color: #111827;
                }


                .header-user-info span {
                    font-size: 9px;

                    color: #2563eb;

                    font-weight: 700;
                }


                /* LOGOUT BUTTON */

                .header-logout {
                    height: 38px;

                    padding: 0 15px;

                    border: none;

                    border-radius: 8px;

                    background: #dc2626;

                    color: white;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 7px;

                    cursor: pointer;

                    font-size: 12px;

                    font-weight: 600;

                    transition: 0.2s;
                }


                .header-logout:hover {
                    background: #b91c1c;

                    transform:
                        translateY(-1px);
                }


                .header-logout:active {
                    transform:
                        translateY(0);
                }


                /* =========================
                   LOGOUT MODAL
                ========================= */

                .logout-modal-overlay {
                    position: fixed;

                    inset: 0;

                    background:
                        rgba(15, 23, 42, 0.45);

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    padding: 20px;

                    z-index: 2000;
                }


                .logout-modal {
                    width: 100%;

                    max-width: 400px;

                    background: white;

                    border-radius: 16px;

                    padding: 30px;

                    position: relative;

                    box-shadow:
                        0 25px 70px
                        rgba(15, 23, 42, 0.18);

                    animation:
                        logoutModalIn
                        0.18s
                        ease-out;
                }


                @keyframes logoutModalIn {

                    from {
                        opacity: 0;

                        transform:
                            translateY(8px)
                            scale(0.98);
                    }

                    to {
                        opacity: 1;

                        transform:
                            translateY(0)
                            scale(1);
                    }

                }


                /* MODAL CLOSE */

                .logout-modal-close {
                    position: absolute;

                    top: 15px;

                    right: 15px;

                    width: 32px;

                    height: 32px;

                    border: none;

                    border-radius: 7px;

                    background: #f9fafb;

                    color: #6b7280;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    cursor: pointer;
                }


                .logout-modal-close:hover {
                    background: #f3f4f6;

                    color: #111827;
                }


                /* MODAL ICON */

                .logout-modal-icon {
                    width: 48px;

                    height: 48px;

                    border-radius: 12px;

                    background: #fef2f2;

                    color: #dc2626;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    margin-bottom: 18px;
                }


                /* MODAL TITLE */

                .logout-modal h2 {
                    font-size: 21px;

                    color: #111827;

                    margin-bottom: 8px;
                }


                /* MODAL TEXT */

                .logout-modal p {
                    color: #6b7280;

                    font-size: 13px;

                    line-height: 1.6;

                    margin-bottom: 25px;
                }


                /* MODAL ACTIONS */

                .logout-modal-actions {
                    display: flex;

                    justify-content: flex-end;

                    gap: 10px;
                }


                .logout-cancel,
                .logout-confirm {
                    height: 40px;

                    padding: 0 17px;

                    border-radius: 8px;

                    font-size: 13px;

                    font-weight: 600;

                    cursor: pointer;

                    transition: 0.2s;
                }


                /* CANCEL */

                .logout-cancel {
                    border:
                        1px solid #e5e7eb;

                    background: white;

                    color: #374151;
                }


                .logout-cancel:hover {
                    background: #f9fafb;
                }


                /* CONFIRM */

                .logout-confirm {
                    border: none;

                    background: #dc2626;

                    color: white;
                }


                .logout-confirm:hover {
                    background: #b91c1c;
                }


                /* =========================
                   TABLET
                ========================= */

                @media (max-width: 800px) {

                    .app-header {
                        padding: 0 20px;
                    }

                    .mobile-menu-button {
                        display: flex;
                    }

                }


                /* =========================
                   MOBILE
                ========================= */

                @media (max-width: 600px) {

                    .header-page-title {
                        display: none;
                    }


                    .header-user-info {
                        display: none;
                    }


                    .header-right {
                        gap: 8px;
                    }


                    .header-logout {
                        padding: 0 11px;
                    }


                    .header-logout span {
                        display: none;
                    }


                    .logout-modal {
                        padding: 25px;

                        max-width: 360px;
                    }


                    .logout-modal-actions {
                        width: 100%;
                    }


                    .logout-cancel,
                    .logout-confirm {
                        flex: 1;
                    }

                }


                /* =========================
                   SMALL MOBILE
                ========================= */

                @media (max-width: 400px) {

                    .app-header {
                        padding: 0 14px;
                    }


                    .header-user {
                        display: none;
                    }

                }

            `}</style>


            {/* =========================
                HEADER
            ========================= */}

            <header className="app-header">

                <div className="header-left">

                    {/* MOBILE MENU */}

                    <button
                        className="mobile-menu-button"
                        onClick={onMenuClick}
                        aria-label="Open menu"
                    >
                        <Menu size={22} />
                    </button>


                    {/* PAGE TITLE */}

                    <div className="header-page-title">

                        <span className="header-small-title">
                            LOT TRACKER
                        </span>

                        <h1>
                            Management System
                        </h1>

                    </div>

                </div>


                <div className="header-right">

                    {/* NOTIFICATIONS */}

                    <button
                        className="header-icon-button"
                        title="Notifications"
                        aria-label="Notifications"
                    >
                        <Bell size={19} />

                        <span
                            className="notification-dot"
                        />
                    </button>


                    {/* USER */}

                    <div className="header-user">

                        <div className="header-avatar">

                            {user.name
                                ? user.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}

                        </div>


                        <div className="header-user-info">

                            <strong>
                                {user.name || "User"}
                            </strong>

                            <span>
                                {user.role || "VIEWER"}
                            </span>

                        </div>

                    </div>


                    {/* LOGOUT */}

                    <button
                        className="header-logout"
                        onClick={() =>
                            setShowLogoutModal(true)
                        }
                    >
                        <LogOut size={17} />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </header>


            {/* =========================
                LOGOUT CONFIRMATION
            ========================= */}

            {showLogoutModal && (

                <div
                    className="logout-modal-overlay"
                    onClick={() =>
                        setShowLogoutModal(false)
                    }
                >

                    <div
                        className="logout-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* CLOSE */}

                        <button
                            className="logout-modal-close"
                            onClick={() =>
                                setShowLogoutModal(false)
                            }
                            aria-label="Close"
                        >
                            <X size={19} />
                        </button>


                        {/* ICON */}

                        <div className="logout-modal-icon">

                            <LogOut size={22} />

                        </div>


                        {/* TITLE */}

                        <h2>
                            Confirm Logout
                        </h2>


                        {/* MESSAGE */}

                        <p>
                            Are you sure you want to log
                            out of Lot Tracker?
                        </p>


                        {/* BUTTONS */}

                        <div className="logout-modal-actions">

                            <button
                                className="logout-cancel"
                                onClick={() =>
                                    setShowLogoutModal(false)
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="logout-confirm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}

export default Header;