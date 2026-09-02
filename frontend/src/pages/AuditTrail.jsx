import { useEffect, useState } from "react";
import axios from "axios";

import {
    History,
    Search,
    Eye,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    X,
    Package,
    Clock,
    ArrowRight
} from "lucide-react";

import Layout from "../components/Layout";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

function AuditTrail() {

    /*
    ========================================================
    USER
    ========================================================
    */

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const token =
        localStorage.getItem("token");


    /*
    ========================================================
    STATE
    ========================================================
    */

    const [lots, setLots] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const limit = 10;

    const [pagination, setPagination] =
        useState({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
        });


    /*
    ========================================================
    SELECTED LOT / HISTORY
    ========================================================
    */

    const [selectedLot, setSelectedLot] =
        useState(null);

    const [history, setHistory] =
        useState([]);

    const [historyLoading, setHistoryLoading] =
        useState(false);


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
    FETCH LOTS
    ========================================================
    */

    const fetchLots = async (
        requestedPage = page,
        requestedSearch = search
    ) => {

        try {

            setLoading(true);

            setError("");

            const response =
                await axios.get(
                    `${API_URL}/lots`,
                    {
                        ...getConfig(),

                        params: {
                            page: requestedPage,
                            limit,
                            search:
                                requestedSearch.trim() ||
                                undefined
                        }
                    }
                );


            console.log(
                "Audit Trail - Lots response:",
                response.data
            );


            setLots(
                response.data.data || []
            );


            setPagination(
                response.data.pagination || {
                    page: requestedPage,
                    limit,
                    total: 0,
                    totalPages: 0
                }
            );

        } catch (err) {

            console.error(
                "Failed to fetch lots:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load lots."
            );

        } finally {

            setLoading(false);

        }

    };


    /*
    ========================================================
    LOAD LOTS WHEN PAGE CHANGES
    ========================================================
    */

    useEffect(() => {

        fetchLots(page, search);

    }, [page]);


    /*
    ========================================================
    SEARCH
    ========================================================
    */

    const handleSearch = (e) => {

        e.preventDefault();

        setPage(1);

        fetchLots(1, search);

    };


    /*
    ========================================================
    CLEAR SEARCH
    ========================================================
    */

    const clearSearch = () => {

        setSearch("");

        setPage(1);

        fetchLots(1, "");

    };


    /*
    ========================================================
    VIEW AUDIT HISTORY
    ========================================================
    */

    const viewAudit = async (lot) => {

        try {

            /*
            -----------------------------------------------
            Open modal immediately
            -----------------------------------------------
            */

            setSelectedLot(lot);

            setHistory([]);

            setHistoryLoading(true);

            setError("");


            /*
            -----------------------------------------------
            API REQUEST
            -----------------------------------------------
            */

            const url =
                `${API_URL}/lots/${lot.id}/track`;


            console.log(
                "Fetching audit history:",
                url
            );


            const response =
                await axios.get(
                    url,
                    getConfig()
                );


            console.log(
                "Audit history response:",
                response.data
            );


            /*
            -----------------------------------------------
            BACKEND RESPONSE
            -----------------------------------------------

            Expected:

            {
                lot: {...},
                history: [...]
            }

            -----------------------------------------------
            */


            const responseLot =
                response.data?.lot;

            const responseHistory =
                response.data?.history;


            /*
            -----------------------------------------------
            Validate response
            -----------------------------------------------
            */

            if (
                !response.data ||
                !Array.isArray(responseHistory)
            ) {

                throw new Error(
                    "Invalid audit history response from server."
                );

            }


            /*
            -----------------------------------------------
            Use backend lot data
            -----------------------------------------------
            */

            if (responseLot) {

                setSelectedLot(
                    responseLot
                );

            }


            /*
            -----------------------------------------------
            Set history
            -----------------------------------------------
            */

            setHistory(
                responseHistory
            );


        } catch (err) {

            console.error(
                "Failed to load audit history:",
                err
            );


            setHistory([]);


            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load audit history."
            );

        } finally {

            setHistoryLoading(false);

        }

    };


    /*
    ========================================================
    CLOSE HISTORY
    ========================================================
    */

    const closeHistory = () => {

        setSelectedLot(null);

        setHistory([]);

        setHistoryLoading(false);

    };


    /*
    ========================================================
    FORMAT DATE
    ========================================================
    */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleString(
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
            return "audit-status initial";
        }

        return `
            audit-status
            audit-status-${status.toLowerCase()}
        `;

    };


    /*
    ========================================================
    PAGE
    ========================================================
    */

    return (

        <Layout>

            <style>{`

                .audit-page {
                    width: 100%;
                }

                .audit-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 25px;
                }

                .audit-title {
                    display: flex;
                    align-items: flex-start;
                    gap: 14px;
                }

                .audit-title-icon {
                    width: 45px;
                    height: 45px;
                    border-radius: 11px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .audit-title h1 {
                    margin: 0;
                    font-size: 27px;
                    font-weight: 700;
                    color: #111827;
                }

                .audit-title p {
                    margin: 7px 0 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .audit-role {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 10px;
                    border-radius: 6px;
                    background: #eff6ff;
                    color: #2563eb;
                    font-size: 10px;
                    font-weight: 700;
                }

                .audit-info {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 17px 20px;
                    margin-bottom: 18px;
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    box-shadow:
                        0 2px 8px
                        rgba(15, 23, 42, 0.03);
                }

                .audit-info-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 9px;
                    background: #f1f5f9;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .audit-info strong {
                    display: block;
                    color: #111827;
                    font-size: 13px;
                    margin-bottom: 3px;
                }

                .audit-info span {
                    color: #6b7280;
                    font-size: 12px;
                }

                .audit-toolbar {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 18px;
                    box-shadow:
                        0 2px 8px
                        rgba(15, 23, 42, 0.03);
                }

                .audit-search {
                    flex: 1;
                    position: relative;
                }

                .audit-search-icon {
                    position: absolute;
                    left: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                }

                .audit-search input {
                    width: 100%;
                    height: 42px;
                    box-sizing: border-box;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 0 40px;
                    outline: none;
                    font-size: 13px;
                    color: #111827;
                }

                .audit-search input:focus {
                    border-color: #2563eb;
                    box-shadow:
                        0 0 0 3px
                        rgba(37, 99, 235, 0.10);
                }

                .audit-clear {
                    position: absolute;
                    right: 11px;
                    top: 50%;
                    transform: translateY(-50%);
                    border: none;
                    background: transparent;
                    color: #9ca3af;
                    cursor: pointer;
                    display: flex;
                }

                .audit-refresh {
                    width: 42px;
                    height: 42px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    background: white;
                    color: #4b5563;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .audit-refresh:hover {
                    color: #2563eb;
                    background: #f8fafc;
                }

                .audit-table-container {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow-x: auto;
                    box-shadow:
                        0 2px 8px
                        rgba(15, 23, 42, 0.03);
                }

                .audit-table {
                    width: 100%;
                    min-width: 900px;
                    border-collapse: collapse;
                }

                .audit-table th {
                    background: #f8fafc;
                    color: #64748b;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    font-weight: 700;
                    padding: 14px 16px;
                    text-align: left;
                    border-bottom: 1px solid #e5e7eb;
                }

                .audit-table td {
                    padding: 15px 16px;
                    font-size: 13px;
                    color: #374151;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: middle;
                }

                .audit-table tbody tr:hover {
                    background: #fafcff;
                }

                .audit-lot-number {
                    font-weight: 700;
                    color: #111827;
                }

                .audit-supplier {
                    color: #6b7280;
                }

                .audit-status {
                    display: inline-flex;
                    align-items: center;
                    padding: 5px 9px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 700;
                }

                .audit-status-received {
                    background: #eff6ff;
                    color: #2563eb;
                }

                .audit-status-processing {
                    background: #fff7ed;
                    color: #c2410c;
                }

                .audit-status-completed {
                    background: #ecfdf5;
                    color: #047857;
                }

                .audit-status-rejected {
                    background: #fef2f2;
                    color: #dc2626;
                }

                .audit-status.initial {
                    background: #f1f5f9;
                    color: #64748b;
                }

                .audit-view-button {
                    height: 34px;
                    border: 1px solid #dbeafe;
                    border-radius: 7px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 0 10px;
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 600;
                }

                .audit-view-button:hover {
                    background: #dbeafe;
                }

                .audit-pagination {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 2px;
                }

                .audit-pagination-info {
                    color: #6b7280;
                    font-size: 12px;
                }

                .audit-pagination-buttons {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .audit-page-button {
                    min-width: 34px;
                    height: 34px;
                    border: 1px solid #e5e7eb;
                    border-radius: 7px;
                    background: white;
                    color: #4b5563;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                }

                .audit-page-button:hover:not(:disabled) {
                    border-color: #2563eb;
                    color: #2563eb;
                }

                .audit-page-button.active {
                    background: #2563eb;
                    border-color: #2563eb;
                    color: white;
                }

                .audit-page-button:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }

                .audit-message {
                    min-height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 10px;
                    color: #6b7280;
                    font-size: 13px;
                }

                .audit-spinner {
                    animation:
                        audit-spin 1s linear infinite;
                }

                @keyframes audit-spin {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }

                .audit-error {
                    background: #fef2f2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                    border-radius: 9px;
                    padding: 12px 14px;
                    margin-bottom: 16px;
                    font-size: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .audit-error button {
                    border: none;
                    background: transparent;
                    color: #b91c1c;
                    cursor: pointer;
                }

                .audit-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background:
                        rgba(15, 23, 42, 0.55);
                    backdrop-filter: blur(2px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    z-index: 2000;
                }

                .audit-modal {
                    width: 100%;
                    max-width: 800px;
                    max-height: 90vh;
                    background: white;
                    border-radius: 14px;
                    box-shadow:
                        0 20px 60px
                        rgba(15, 23, 42, 0.20);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .audit-modal-header {
                    padding: 18px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-shrink: 0;
                }

                .audit-modal-heading {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                }

                .audit-modal-heading-icon {
                    width: 37px;
                    height: 37px;
                    border-radius: 9px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .audit-modal-header h2 {
                    margin: 0;
                    font-size: 16px;
                    color: #111827;
                }

                .audit-modal-header p {
                    margin: 4px 0 0;
                    font-size: 11px;
                    color: #6b7280;
                }

                .audit-modal-close {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: #f8fafc;
                    color: #64748b;
                    border-radius: 7px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .audit-modal-body {
                    padding: 20px;
                    overflow-y: auto;
                }

                .lot-summary {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);
                    gap: 10px;
                    margin-bottom: 22px;
                }

                .lot-summary-item {
                    border: 1px solid #e5e7eb;
                    border-radius: 9px;
                    padding: 11px;
                    background: #fafafa;
                }

                .lot-summary-item span {
                    display: block;
                    font-size: 9px;
                    color: #9ca3af;
                    text-transform: uppercase;
                    font-weight: 700;
                    margin-bottom: 5px;
                }

                .lot-summary-item strong {
                    font-size: 12px;
                    color: #111827;
                }

                .history-title {
                    margin: 0 0 15px;
                    color: #111827;
                    font-size: 14px;
                }

                .history-timeline {
                    position: relative;
                    padding-left: 28px;
                }

                .history-timeline::before {
                    content: "";
                    position: absolute;
                    left: 8px;
                    top: 8px;
                    bottom: 8px;
                    width: 2px;
                    background: #e5e7eb;
                }

                .history-item {
                    position: relative;
                    margin-bottom: 18px;
                }

                .history-item:last-child {
                    margin-bottom: 0;
                }

                .history-dot {
                    position: absolute;
                    left: -28px;
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

                .history-card {
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 13px 15px;
                    background: white;
                }

                .history-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    margin-bottom: 10px;
                }

                .history-transition {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    flex-wrap: wrap;
                }

                .history-arrow {
                    color: #9ca3af;
                }

                .history-date {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #9ca3af;
                    font-size: 10px;
                    white-space: nowrap;
                }

                .history-user {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding-top: 9px;
                    border-top: 1px solid #f1f5f9;
                }

                .history-user-avatar {
                    width: 27px;
                    height: 27px;
                    border-radius: 7px;
                    background: #eff6ff;
                    color: #2563eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: 700;
                }

                .history-user-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .history-user-info strong {
                    color: #374151;
                    font-size: 11px;
                }

                .history-user-info span {
                    color: #9ca3af;
                    font-size: 10px;
                }

                .initial-history {
                    background: #f8fafc;
                }

                @media (max-width: 800px) {

                    .audit-header {
                        flex-direction: column;
                    }

                    .audit-toolbar {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .audit-refresh {
                        width: 100%;
                    }

                    .lot-summary {
                        grid-template-columns:
                            1fr 1fr;
                    }

                }

                @media (max-width: 600px) {

                    .audit-pagination {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .lot-summary {
                        grid-template-columns:
                            1fr;
                    }

                    .history-top {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                }

            `}</style>


            <div className="audit-page">

                {/* HEADER */}

                <div className="audit-header">

                    <div className="audit-title">

                        <div className="audit-title-icon">

                            <History size={23} />

                        </div>

                        <div>

                            <h1>
                                Audit Trail
                            </h1>

                            <p>
                                Track every status change
                                made to your material lots.
                            </p>

                        </div>

                    </div>

                    <span className="audit-role">

                        {user.role || "VIEWER"}

                    </span>

                </div>


                {/* INFO */}

                <div className="audit-info">

                    <div className="audit-info-icon">

                        <History size={19} />

                    </div>

                    <div>

                        <strong>
                            Immutable Status History
                        </strong>

                        <span>
                            Every status change is recorded
                            with the user, previous status,
                            new status and timestamp.
                        </span>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="audit-error">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            <X size={16} />
                        </button>

                    </div>

                )}


                {/* SEARCH */}

                <div className="audit-toolbar">

                    <form
                        className="audit-search"
                        onSubmit={handleSearch}
                    >

                        <Search
                            size={17}
                            className="audit-search-icon"
                        />

                        <input
                            type="text"
                            placeholder="Search lot number, supplier or material..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        {search && (

                            <button
                                type="button"
                                className="audit-clear"
                                onClick={clearSearch}
                            >
                                <X size={15} />
                            </button>

                        )}

                    </form>


                    <button
                        className="audit-refresh"
                        onClick={() =>
                            fetchLots(
                                page,
                                search
                            )
                        }
                        title="Refresh"
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "audit-spinner"
                                    : ""
                            }
                        />

                    </button>

                </div>


                {/* TABLE */}

                <div className="audit-table-container">

                    {loading ? (

                        <div className="audit-message">

                            <RefreshCw
                                size={25}
                                className="audit-spinner"
                            />

                            Loading lots...

                        </div>

                    ) : lots.length === 0 ? (

                        <div className="audit-message">

                            <Package size={30} />

                            <strong>
                                No lots found
                            </strong>

                            <span>
                                Try changing your search.
                            </span>

                        </div>

                    ) : (

                        <table className="audit-table">

                            <thead>

                                <tr>

                                    <th>
                                        Lot Number
                                    </th>

                                    <th>
                                        Supplier
                                    </th>

                                    <th>
                                        Material
                                    </th>

                                    <th>
                                        Current Status
                                    </th>

                                    <th>
                                        Version
                                    </th>

                                    <th>
                                        Audit
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {lots.map(
                                    (lot) => (

                                    <tr
                                        key={lot.id}
                                    >

                                        <td>

                                            <span className="audit-lot-number">

                                                {
                                                    lot.lot_number
                                                }

                                            </span>

                                        </td>

                                        <td className="audit-supplier">

                                            {
                                                lot.supplier
                                            }

                                        </td>

                                        <td className="audit-supplier">

                                            {
                                                lot.material_type
                                            }

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    getStatusClass(
                                                        lot.status
                                                    )
                                                }
                                            >
                                                {
                                                    lot.status
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            v{
                                                lot.version
                                            }

                                        </td>

                                        <td>

                                            <button
                                                className="audit-view-button"
                                                onClick={() =>
                                                    viewAudit(
                                                        lot
                                                    )
                                                }
                                            >

                                                <Eye size={14} />

                                                View History

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>


                {/* PAGINATION */}

                {!loading &&
                    pagination.totalPages > 0 && (

                    <div className="audit-pagination">

                        <div className="audit-pagination-info">

                            Showing page{" "}

                            <strong>
                                {pagination.page}
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {pagination.totalPages}
                            </strong>

                            {" "}(
                            {pagination.total} lots
                            )

                        </div>


                        <div className="audit-pagination-buttons">

                            <button
                                className="audit-page-button"
                                disabled={
                                    page <= 1
                                }
                                onClick={() =>
                                    setPage(
                                        page - 1
                                    )
                                }
                            >

                                <ChevronLeft
                                    size={16}
                                />

                            </button>


                            {Array.from(
                                {
                                    length:
                                        pagination.totalPages
                                },
                                (_, index) =>
                                    index + 1
                            )
                            .filter(
                                (pageNumber) => {

                                    if (
                                        pagination.totalPages <=
                                        7
                                    ) {
                                        return true;
                                    }

                                    return (
                                        pageNumber === 1 ||
                                        pageNumber ===
                                            pagination.totalPages ||
                                        Math.abs(
                                            pageNumber - page
                                        ) <= 1
                                    );

                                }
                            )
                            .map(
                                (pageNumber) => (

                                <button
                                    key={
                                        pageNumber
                                    }
                                    className={`
                                        audit-page-button
                                        ${
                                            pageNumber === page
                                                ? "active"
                                                : ""
                                        }
                                    `}
                                    onClick={() =>
                                        setPage(
                                            pageNumber
                                        )
                                    }
                                >

                                    {
                                        pageNumber
                                    }

                                </button>

                            ))}


                            <button
                                className="audit-page-button"
                                disabled={
                                    page >=
                                    pagination.totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        page + 1
                                    )
                                }
                            >

                                <ChevronRight
                                    size={16}
                                />

                            </button>

                        </div>

                    </div>

                )}


                {/* AUDIT HISTORY MODAL */}

                {selectedLot && (

                    <div
                        className="audit-modal-overlay"
                        onClick={closeHistory}
                    >

                        <div
                            className="audit-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            {/* MODAL HEADER */}

                            <div className="audit-modal-header">

                                <div className="audit-modal-heading">

                                    <div className="audit-modal-heading-icon">

                                        <History size={19} />

                                    </div>

                                    <div>

                                        <h2>
                                            Audit History
                                        </h2>

                                        <p>
                                            {
                                                selectedLot.lot_number
                                            }
                                        </p>

                                    </div>

                                </div>


                                <button
                                    className="audit-modal-close"
                                    onClick={
                                        closeHistory
                                    }
                                >

                                    <X size={17} />

                                </button>

                            </div>


                            {/* MODAL BODY */}

                            <div className="audit-modal-body">

                                {historyLoading ? (

                                    <div className="audit-message">

                                        <RefreshCw
                                            size={25}
                                            className="audit-spinner"
                                        />

                                        Loading audit history...

                                    </div>

                                ) : (

                                    <>

                                        {/* LOT SUMMARY */}

                                        <div className="lot-summary">

                                            <div className="lot-summary-item">

                                                <span>
                                                    Lot Number
                                                </span>

                                                <strong>
                                                    {
                                                        selectedLot.lot_number
                                                    }
                                                </strong>

                                            </div>


                                            <div className="lot-summary-item">

                                                <span>
                                                    Supplier
                                                </span>

                                                <strong>
                                                    {
                                                        selectedLot.supplier
                                                    }
                                                </strong>

                                            </div>


                                            <div className="lot-summary-item">

                                                <span>
                                                    Current Status
                                                </span>

                                                <strong>
                                                    {
                                                        selectedLot.status
                                                    }
                                                </strong>

                                            </div>


                                            <div className="lot-summary-item">

                                                <span>
                                                    Version
                                                </span>

                                                <strong>
                                                    v{
                                                        selectedLot.version
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        {/* HISTORY TITLE */}

                                        <h3 className="history-title">

                                            Status Timeline

                                        </h3>


                                        {/* HISTORY */}

                                        {history.length === 0 ? (

                                            <div className="audit-message">

                                                <History size={28} />

                                                No audit records found.

                                            </div>

                                        ) : (

                                            <div className="history-timeline">

                                                {history.map(
                                                    (item) => (

                                                    <div
                                                        className="history-item"
                                                        key={item.id}
                                                    >

                                                        <div className="history-dot" />


                                                        <div
                                                            className={`
                                                                history-card
                                                                ${
                                                                    !item.from_status
                                                                        ? "initial-history"
                                                                        : ""
                                                                }
                                                            `}
                                                        >

                                                            <div className="history-top">

                                                                <div className="history-transition">

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
                                                                                className="history-arrow"
                                                                            />

                                                                        </>

                                                                    ) : (

                                                                        <span
                                                                            style={{
                                                                                fontSize: "10px",
                                                                                color: "#64748b",
                                                                                fontWeight: "600"
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


                                                                <div className="history-date">

                                                                    <Clock size={12} />

                                                                    {
                                                                        formatDate(
                                                                            item.changed_at
                                                                        )
                                                                    }

                                                                </div>

                                                            </div>


                                                            {/* USER */}

                                                            <div className="history-user">

                                                                <div className="history-user-avatar">

                                                                    {
                                                                        item.user_name
                                                                            ? item.user_name
                                                                                .charAt(0)
                                                                                .toUpperCase()
                                                                            : "U"
                                                                    }

                                                                </div>


                                                                <div className="history-user-info">

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

                                    </>

                                )}

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </Layout>

    );

}

export default AuditTrail;