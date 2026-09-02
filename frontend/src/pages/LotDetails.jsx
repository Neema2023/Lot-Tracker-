import { useEffect, useState } from "react";

import axios from "axios";

import {
    ArrowLeft,
    Package,
    History,
    RefreshCw,
    Calendar,
    Weight,
    User,
    Hash,
    AlertCircle,
    CheckCircle,
    Clock,
    ArrowRight
} from "lucide-react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import Layout from "../components/Layout";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


function LotDetails() {

    const navigate = useNavigate();

    const { id } = useParams();

    const token =
        localStorage.getItem("token");


    const [lot, setLot] =
        useState(null);

    const [history, setHistory] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /*
    ========================================================
    AXIOS CONFIG
    ========================================================
    */

    const getConfig = () => {

        return {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        };

    };


    /*
    ========================================================
    FETCH LOT DETAILS
    ========================================================
    */

    const fetchLotDetails = async () => {

        try {

            setLoading(true);

            setError("");


            const lotResponse =
                await axios.get(
                    `${API_URL}/lots/${id}`,
                    getConfig()
                );


            setLot(
                lotResponse.data
            );


            const historyResponse =
                await axios.get(
                    `${API_URL}/lots/${id}/track`,
                    getConfig()
                );


            setHistory(
                historyResponse.data.history || []
            );


        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load lot details."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    ========================================================
    LOAD DATA
    ========================================================
    */

    useEffect(() => {

        fetchLotDetails();

    }, [id]);


    /*
    ========================================================
    FORMAT DATE
    ========================================================
    */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString(
            "en-GB",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };


    /*
    ========================================================
    STATUS CLASS
    ========================================================
    */

    const getStatusClass = (status) => {

        if (!status) {
            return "details-status";
        }

        return `
            details-status
            details-status-${status.toLowerCase()}
        `;

    };


    /*
    ========================================================
    LOADING
    ========================================================
    */

    if (loading) {

        return (

            <Layout>

                <style>{`

                    .details-loading {
                        min-height: 500px;

                        display: flex;

                        flex-direction: column;

                        align-items: center;

                        justify-content: center;

                        gap: 12px;

                        color: #6b7280;

                        font-size: 13px;
                    }


                    .details-spinner {
                        animation:
                            details-spin 1s linear infinite;
                    }


                    @keyframes details-spin {

                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }

                    }

                `}</style>


                <div className="details-loading">

                    <RefreshCw
                        size={30}
                        className="details-spinner"
                    />

                    Loading lot details...

                </div>

            </Layout>

        );

    }


    /*
    ========================================================
    ERROR
    ========================================================
    */

    if (error || !lot) {

        return (

            <Layout>

                <style>{`

                    .details-error-page {
                        min-height: 500px;

                        display: flex;

                        flex-direction: column;

                        align-items: center;

                        justify-content: center;

                        gap: 12px;

                        text-align: center;

                        color: #6b7280;
                    }


                    .details-error-icon {
                        width: 55px;
                        height: 55px;

                        border-radius: 50%;

                        background: #fef2f2;

                        color: #dc2626;

                        display: flex;

                        align-items: center;

                        justify-content: center;
                    }


                    .details-back-button {
                        margin-top: 8px;

                        height: 40px;

                        border: none;

                        border-radius: 8px;

                        background: #2563eb;

                        color: white;

                        padding: 0 16px;

                        cursor: pointer;

                        font-size: 12px;

                        font-weight: 600;
                    }

                `}</style>


                <div className="details-error-page">

                    <div className="details-error-icon">

                        <AlertCircle
                            size={27}
                        />

                    </div>


                    <strong>
                        {error || "Lot not found"}
                    </strong>


                    <button
                        className="details-back-button"
                        onClick={() =>
                            navigate("/lots")
                        }
                    >
                        Back to Lots
                    </button>

                </div>

            </Layout>

        );

    }


    /*
    ========================================================
    PAGE
    ========================================================
    */

    return (

        <Layout>

            <style>{`

                /* =================================================
                   PAGE
                ================================================= */

                .details-page {
                    width: 100%;
                }


                /* =================================================
                   HEADER
                ================================================= */

                .details-header {
                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 15px;

                    margin-bottom: 25px;
                }


                .details-header-left {
                    display: flex;

                    align-items: center;

                    gap: 13px;
                }


                .details-back {
                    width: 40px;

                    height: 40px;

                    border: 1px solid #e5e7eb;

                    border-radius: 9px;

                    background: white;

                    color: #4b5563;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    cursor: pointer;
                }


                .details-back:hover {
                    background: #f8fafc;

                    color: #2563eb;

                    border-color: #bfdbfe;
                }


                .details-title-icon {
                    width: 45px;

                    height: 45px;

                    border-radius: 11px;

                    background: #eff6ff;

                    color: #2563eb;

                    display: flex;

                    align-items: center;

                    justify-content: center;
                }


                .details-title h1 {
                    margin: 0;

                    font-size: 26px;

                    font-weight: 700;

                    color: #111827;
                }


                .details-title p {
                    margin: 5px 0 0;

                    color: #6b7280;

                    font-size: 13px;
                }


                /* =================================================
                   REFRESH
                ================================================= */

                .details-refresh {
                    height: 40px;

                    border: 1px solid #d1d5db;

                    border-radius: 8px;

                    background: white;

                    color: #4b5563;

                    display: flex;

                    align-items: center;

                    gap: 7px;

                    padding: 0 12px;

                    cursor: pointer;

                    font-size: 11px;

                    font-weight: 600;
                }


                .details-refresh:hover {
                    color: #2563eb;

                    background: #f8fafc;
                }


                /* =================================================
                   STATUS CARD
                ================================================= */

                .details-status-card {
                    background: white;

                    border: 1px solid #e5e7eb;

                    border-radius: 12px;

                    padding: 20px;

                    margin-bottom: 18px;

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 20px;

                    box-shadow:
                        0 2px 8px
                        rgba(15, 23, 42, 0.03);
                }


                .details-status-info {
                    display: flex;

                    align-items: center;

                    gap: 13px;
                }


                .details-package-icon {
                    width: 45px;

                    height: 45px;

                    border-radius: 10px;

                    background: #f1f5f9;

                    color: #475569;

                    display: flex;

                    align-items: center;

                    justify-content: center;
                }


                .details-status-info span {
                    display: block;

                    color: #9ca3af;

                    font-size: 10px;

                    text-transform: uppercase;

                    font-weight: 700;

                    margin-bottom: 5px;
                }


                .details-status {
                    display: inline-flex;

                    align-items: center;

                    padding: 6px 11px;

                    border-radius: 20px;

                    font-size: 11px;

                    font-weight: 700;
                }


                .details-status-received {
                    background: #eff6ff;

                    color: #2563eb;
                }


                .details-status-processing {
                    background: #fff7ed;

                    color: #c2410c;
                }


                .details-status-completed {
                    background: #ecfdf5;

                    color: #047857;
                }


                .details-status-rejected {
                    background: #fef2f2;

                    color: #dc2626;
                }


                .details-version {
                    text-align: right;
                }


                .details-version span {
                    display: block;

                    color: #9ca3af;

                    font-size: 10px;

                    text-transform: uppercase;

                    font-weight: 700;

                    margin-bottom: 4px;
                }


                .details-version strong {
                    color: #111827;

                    font-size: 14px;
                }


                /* =================================================
                   INFORMATION GRID
                ================================================= */

                .details-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(2, 1fr);

                    gap: 18px;

                    margin-bottom: 20px;
                }


                .details-card {
                    background: white;

                    border: 1px solid #e5e7eb;

                    border-radius: 12px;

                    padding: 20px;

                    box-shadow:
                        0 2px 8px
                        rgba(15, 23, 42, 0.03);
                }


                .details-card-title {
                    display: flex;

                    align-items: center;

                    gap: 8px;

                    margin-bottom: 18px;

                    padding-bottom: 13px;

                    border-bottom:
                        1px solid #f1f5f9;
                }


                .details-card-title svg {
                    color: #2563eb;
                }


                .details-card-title h2 {
                    margin: 0;

                    color: #111827;

                    font-size: 14px;

                    font-weight: 700;
                }


                .details-info-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(2, 1fr);

                    gap: 16px;
                }


                .details-info-item {
                    display: flex;

                    align-items: flex-start;

                    gap: 10px;
                }


                .details-info-icon {
                    width: 31px;

                    height: 31px;

                    border-radius: 7px;

                    background: #f8fafc;

                    color: #64748b;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    flex-shrink: 0;
                }


                .details-info-item span {
                    display: block;

                    color: #9ca3af;

                    font-size: 9px;

                    text-transform: uppercase;

                    font-weight: 700;

                    margin-bottom: 4px;
                }


                .details-info-item strong {
                    display: block;

                    color: #374151;

                    font-size: 12px;
                }


                /* =================================================
                   HISTORY
                ================================================= */

                .details-history-card {
                    background: white;

                    border: 1px solid #e5e7eb;

                    border-radius: 12px;

                    padding: 20px;

                    box-shadow:
                        0 2px 8px
                        rgba(15, 23, 42, 0.03);
                }


                .details-history-title {
                    display: flex;

                    align-items: center;

                    gap: 8px;

                    margin-bottom: 20px;

                    padding-bottom: 13px;

                    border-bottom:
                        1px solid #f1f5f9;
                }


                .details-history-title svg {
                    color: #2563eb;
                }


                .details-history-title h2 {
                    margin: 0;

                    color: #111827;

                    font-size: 14px;
                }


                .details-timeline {
                    position: relative;

                    padding-left: 30px;
                }


                .details-timeline::before {
                    content: "";

                    position: absolute;

                    left: 8px;

                    top: 8px;

                    bottom: 8px;

                    width: 2px;

                    background: #e5e7eb;
                }


                .details-history-item {
                    position: relative;

                    margin-bottom: 18px;
                }


                .details-history-item:last-child {
                    margin-bottom: 0;
                }


                .details-history-dot {
                    position: absolute;

                    left: -30px;

                    top: 5px;

                    width: 18px;

                    height: 18px;

                    border-radius: 50%;

                    background: #eff6ff;

                    border: 3px solid white;

                    box-shadow:
                        0 0 0 1px #bfdbfe;

                    z-index: 1;
                }


                .details-history-box {
                    border: 1px solid #e5e7eb;

                    border-radius: 9px;

                    padding: 13px;

                    background: #fafafa;
                }


                .details-history-top {
                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 15px;

                    margin-bottom: 10px;
                }


                .details-transition {
                    display: flex;

                    align-items: center;

                    gap: 7px;

                    flex-wrap: wrap;
                }


                .details-arrow {
                    color: #9ca3af;
                }


                .details-history-date {
                    display: flex;

                    align-items: center;

                    gap: 5px;

                    color: #9ca3af;

                    font-size: 10px;

                    white-space: nowrap;
                }


                .details-history-user {
                    display: flex;

                    align-items: center;

                    gap: 8px;

                    padding-top: 9px;

                    border-top:
                        1px solid #e5e7eb;
                }


                .details-user-avatar {
                    width: 28px;

                    height: 28px;

                    border-radius: 7px;

                    background: #eff6ff;

                    color: #2563eb;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    font-size: 10px;

                    font-weight: 700;
                }


                .details-user-info strong {
                    display: block;

                    color: #374151;

                    font-size: 11px;
                }


                .details-user-info span {
                    display: block;

                    color: #9ca3af;

                    font-size: 10px;

                    margin-top: 2px;
                }


                /* =================================================
                   EMPTY HISTORY
                ================================================= */

                .details-empty-history {
                    padding: 35px;

                    text-align: center;

                    color: #9ca3af;

                    font-size: 12px;
                }


                /* =================================================
                   RESPONSIVE
                ================================================= */

                @media (max-width: 800px) {

                    .details-header {
                        align-items: flex-start;
                    }


                    .details-status-card {
                        align-items: flex-start;

                        flex-direction: column;
                    }


                    .details-version {
                        text-align: left;
                    }


                    .details-grid {
                        grid-template-columns: 1fr;
                    }

                }


                @media (max-width: 550px) {

                    .details-header {
                        flex-direction: column;
                    }


                    .details-refresh {
                        width: 100%;

                        justify-content: center;
                    }


                    .details-title h1 {
                        font-size: 21px;
                    }


                    .details-info-grid {
                        grid-template-columns: 1fr;
                    }


                    .details-history-top {
                        flex-direction: column;

                        align-items: flex-start;
                    }

                }

            `}</style>


            <div className="details-page">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="details-header">

                    <div className="details-header-left">

                        <button
                            className="details-back"
                            onClick={() =>
                                navigate("/lots")
                            }
                            title="Back to lots"
                        >
                            <ArrowLeft
                                size={18}
                            />
                        </button>


                        <div className="details-title-icon">

                            <Package
                                size={23}
                            />

                        </div>


                        <div className="details-title">

                            <h1>
                                Lot Details
                            </h1>

                            <p>
                                {lot.lot_number}
                            </p>

                        </div>

                    </div>


                    <button
                        className="details-refresh"
                        onClick={
                            fetchLotDetails
                        }
                    >

                        <RefreshCw
                            size={15}
                        />

                        Refresh

                    </button>

                </div>


                {/* =================================================
                    STATUS
                ================================================= */}

                <div className="details-status-card">

                    <div className="details-status-info">

                        <div className="details-package-icon">

                            <Package
                                size={21}
                            />

                        </div>


                        <div>

                            <span>
                                Current Status
                            </span>

                            <div
                                className={
                                    getStatusClass(
                                        lot.status
                                    )
                                }
                            >
                                {lot.status}
                            </div>

                        </div>

                    </div>


                    <div className="details-version">

                        <span>
                            Record Version
                        </span>

                        <strong>
                            v{lot.version}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    INFORMATION
                ================================================= */}

                <div className="details-grid">


                    {/* BASIC INFORMATION */}

                    <div className="details-card">

                        <div className="details-card-title">

                            <Package
                                size={17}
                            />

                            <h2>
                                Lot Information
                            </h2>

                        </div>


                        <div className="details-info-grid">


                            <div className="details-info-item">

                                <div className="details-info-icon">

                                    <Hash
                                        size={15}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Lot Number
                                    </span>

                                    <strong>
                                        {
                                            lot.lot_number
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="details-info-item">

                                <div className="details-info-icon">

                                    <User
                                        size={15}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Supplier
                                    </span>

                                    <strong>
                                        {
                                            lot.supplier
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="details-info-item">

                                <div className="details-info-icon">

                                    <Package
                                        size={15}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Material Type
                                    </span>

                                    <strong>
                                        {
                                            lot.material_type
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="details-info-item">

                                <div className="details-info-icon">

                                    <Weight
                                        size={15}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Weight
                                    </span>

                                    <strong>
                                        {
                                            lot.weight
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* DATES */}

                    <div className="details-card">

                        <div className="details-card-title">

                            <Calendar
                                size={17}
                            />

                            <h2>
                                Record Information
                            </h2>

                        </div>


                        <div className="details-info-grid">


                            <div className="details-info-item">

                                <div className="details-info-icon">

                                    <Calendar
                                        size={15}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Received Date
                                    </span>

                                    <strong>
                                        {
                                            lot.received_date
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="details-info-item">

                                <div className="details-info-icon">

                                    <Clock
                                        size={15}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Created At
                                    </span>

                                    <strong>
                                        {
                                            formatDate(
                                                lot.created_at
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="details-info-item">

                                <div className="details-info-icon">

                                    <RefreshCw
                                        size={15}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Last Updated
                                    </span>

                                    <strong>
                                        {
                                            formatDate(
                                                lot.updated_at
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="details-info-item">

                                <div className="details-info-icon">

                                    <Hash
                                        size={15}
                                    />

                                </div>


                                <div>

                                    <span>
                                        Lot ID
                                    </span>

                                    <strong>
                                        #{lot.id}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    HISTORY
                ================================================= */}

                <div className="details-history-card">

                    <div className="details-history-title">

                        <History
                            size={17}
                        />

                        <h2>
                            Status History
                        </h2>

                    </div>


                    {history.length === 0 ? (

                        <div className="details-empty-history">

                            No status history
                            available for this lot.

                        </div>

                    ) : (

                        <div className="details-timeline">

                            {history.map(
                                (item) => (

                                <div
                                    className="details-history-item"
                                    key={item.id}
                                >

                                    <div className="details-history-dot" />


                                    <div className="details-history-box">


                                        <div className="details-history-top">

                                            <div className="details-transition">

                                                {item.from_status ? (

                                                    <>

                                                        <span
                                                            className={
                                                                getStatusClass(
                                                                    item.from_status
                                                                )
                                                            }
                                                        >
                                                            {
                                                                item.from_status
                                                            }
                                                        </span>


                                                        <ArrowRight
                                                            size={15}
                                                            className="details-arrow"
                                                        />

                                                    </>

                                                ) : (

                                                    <span
                                                        style={{
                                                            color:
                                                                "#64748b",
                                                            fontSize:
                                                                "10px",
                                                            fontWeight:
                                                                "700"
                                                        }}
                                                    >
                                                        INITIAL STATUS
                                                    </span>

                                                )}


                                                <span
                                                    className={
                                                        getStatusClass(
                                                            item.to_status
                                                        )
                                                    }
                                                >
                                                    {
                                                        item.to_status
                                                    }
                                                </span>

                                            </div>


                                            <div className="details-history-date">

                                                <Clock
                                                    size={12}
                                                />

                                                {
                                                    formatDate(
                                                        item.changed_at
                                                    )
                                                }

                                            </div>

                                        </div>


                                        <div className="details-history-user">

                                            <div className="details-user-avatar">

                                                {item.user_name
                                                    ? item.user_name
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()
                                                    : "U"}

                                            </div>


                                            <div className="details-user-info">

                                                <strong>
                                                    {
                                                        item.user_name ||
                                                        "Unknown user"
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        item.user_email ||
                                                        "-"
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </Layout>

    );

}


export default LotDetails;