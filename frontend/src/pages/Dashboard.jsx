import { Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    return (
        <Layout>

            <style>{`
                /* DASHBOARD STYLES */
                .dashboard-page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 30px;
                    padding: 20px 0;
                    border-bottom: 1px solid #e5e7eb;
                }

                .dashboard-page-header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin: 0;
                }

                .dashboard-page-header p {
                    color: #6b7280;
                    margin: 5px 0 0;
                    font-size: 14px;
                }

                .role-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 16px;
                    border-radius: 8px;
                    background: #eff6ff;
                    color: #2563eb;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .role-section {
                    display: flex;
                    align-items: flex-start;
                    gap: 24px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 30px;
                    margin-top: 20px;
                    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
                }

                .section-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .viewer-icon {
                    background: #eff6ff;
                    color: #2563eb;
                }

                .editor-icon {
                    background: #f5f3ff;
                    color: #7c3aed;
                }

                .section-content {
                    flex: 1;
                }

                .section-content h2 {
                    margin: 0 0 8px;
                    font-size: 20px;
                    font-weight: 700;
                    color: #111827;
                }

                .section-content > p {
                    margin: 0 0 16px;
                    color: #6b7280;
                    font-size: 14px;
                }

                .permission-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6px 20px;
                    margin: 12px 0 16px;
                    padding: 0;
                    list-style: none;
                }

                .permission-list div {
                    color: #374151;
                    font-size: 13px;
                    padding: 4px 0;
                }

                .restricted-note {
                    padding: 12px 16px;
                    border-radius: 8px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #b91c1c;
                    font-size: 13px;
                    margin: 12px 0 18px;
                }

                .primary-button {
                    border: none;
                    background: #2563eb;
                    color: white;
                    border-radius: 8px;
                    padding: 12px 24px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.2s;
                    display: inline-block;
                }

                .primary-button:hover {
                    background: #1d4ed8;
                    transform: translateY(-1px);
                }

                @media (max-width: 640px) {
                    .role-section {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .permission-list {
                        grid-template-columns: 1fr;
                        text-align: left;
                    }

                    .dashboard-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                }
            `}</style>

            {/* PAGE HEADER */}

            <div className="dashboard-page-header">

                <div>
                    <h1>
                        Welcome back, {user.name}
                    </h1>

                    <p>
                        Manage and track your material lots
                        from one place.
                    </p>
                </div>

                <div className="role-badge">
                    {user.role}
                </div>

            </div>


            {/* ROLE CARD */}

            {user.role === "VIEWER" && (

                <section className="role-section">

                    <div className="section-icon viewer-icon">
                        <Eye size={24} />
                    </div>

                    <div className="section-content">

                        <h2>
                            Viewer Access
                        </h2>

                        <p>
                            You have read-only access to
                            the Lot Tracker system.
                        </p>

                        <div className="permission-list">

                            <div>
                                ✓ View lots
                            </div>

                            <div>
                                ✓ Search and filter lots
                            </div>

                            <div>
                                ✓ View lot details
                            </div>

                            <div>
                                ✓ View status history
                            </div>

                        </div>

                        <div className="restricted-note">

                            You cannot create, edit, delete,
                            or change the status of lots.

                        </div>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/lots")
                            }
                        >
                            View Lots
                        </button>

                    </div>

                </section>

            )}


            {/* EDITOR */}

            {user.role === "EDITOR" && (

                <section className="role-section">

                    <div className="section-icon editor-icon">
                        <Pencil size={24} />
                    </div>

                    <div className="section-content">

                        <h2>
                            Editor Access
                        </h2>

                        <p>
                            You have full lot management
                            access.
                        </p>

                        <div className="permission-list">

                            <div>
                                ✓ View lots
                            </div>

                            <div>
                                ✓ Search and filter lots
                            </div>

                            <div>
                                ✓ Create new lots
                            </div>

                            <div>
                                ✓ Edit lot information
                            </div>

                            <div>
                                ✓ Update lot status
                            </div>

                            <div>
                                ✓ Delete lots
                            </div>

                            <div>
                                ✓ View audit history
                            </div>

                        </div>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/lots")
                            }
                        >
                            Manage Lots
                        </button>

                    </div>

                </section>

            )}

        </Layout>
    );
}

export default Dashboard;