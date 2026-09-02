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