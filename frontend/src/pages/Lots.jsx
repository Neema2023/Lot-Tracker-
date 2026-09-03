import { useEffect, useState } from "react";

import axios from "axios";

import {
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    X
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";



// API URL - Hardcoded for production


const API_URL = "https://lot-tracker-urg2.onrender.com/api";


function Lots() {

    const navigate = useNavigate();


 
   
   // USER
    
   

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const token =
        localStorage.getItem("token");

    const isEditor =
        user.role === "EDITOR";


    
   
    //STATE
    
    

    const [lots, setLots] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [limit] =
        useState(10);

    const [pagination, setPagination] =
        useState({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0
        });


    
    //CREATE / EDIT MODAL
    

    const [showModal, setShowModal] =
        useState(false);

    const [modalMode, setModalMode] =
        useState("create");

    const [selectedLot, setSelectedLot] =
        useState(null);


    
    //FORM
   
  

    const [formData, setFormData] =
        useState({
            lot_number: "",
            supplier: "",
            material_type: "",
            weight: "",
            status: "RECEIVED",
            received_date: ""
        });


   
    //DELETE MODAL
    

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [lotToDelete, setLotToDelete] =
        useState(null);


   
    //STATUS MODAL
   

    const [showStatusModal, setShowStatusModal] =
        useState(false);

    const [statusLot, setStatusLot] =
        useState(null);

    const [newStatus, setNewStatus] =
        useState("");


    
    //STATUS CONFIRMATION MODAL
    
    const [showStatusConfirmModal, setShowStatusConfirmModal] =
        useState(false);


    
    //CONFLICT MODAL
    

    const [showConflictModal, setShowConflictModal] =
        useState(false);

    const [conflictLot, setConflictLot] =
        useState(null);

    const [conflictMessage, setConflictMessage] =
        useState("");

    const [conflictType, setConflictType] =
        useState("");

    const [conflictChanges, setConflictChanges] =
        useState(null);

    const [conflictVersion, setConflictVersion] =
        useState(null);

    const [conflictActionLoading, setConflictActionLoading] =
        useState(false);


   
    //AXIOS CONFIG
    

    const getConfig = () => {

        return {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        };

    };


   
    //GET LOTS
   
    const fetchLots = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await axios.get(
                    `${API_URL}/lots`,
                    {
                        ...getConfig(),

                        params: {
                            page,
                            limit,

                            status:
                                status || undefined,

                            search:
                                search.trim() ||
                                undefined
                        }
                    }
                );


            setLots(
                response.data.data || []
            );


            setPagination(
                response.data.pagination || {
                    page: 1,
                    limit: 10,
                    total: 0,
                    totalPages: 0
                }
            );

        } catch (err) {

            console.error(err);


            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                setError(
                    "You are not authorized to view lots."
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Failed to load lots."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    /*
    ========================================================
    LOAD LOTS
    ========================================================
    */

    useEffect(() => {

        fetchLots();

    }, [page, status]);


    
   // SEARCH
    
    const handleSearch = (e) => {

        e.preventDefault();

        setPage(1);

        fetchLots();

    };


    
    //CLEAR SEARCH
   

    const clearSearch = () => {

        setSearch("");

        setPage(1);

        setTimeout(() => {
            fetchLots();
        }, 0);

    };


   // OPEN CREATE
    
    const openCreateModal = () => {

        setModalMode("create");

        setSelectedLot(null);

        setFormData({
            lot_number: "",
            supplier: "",
            material_type: "",
            weight: "",
            status: "RECEIVED",
            received_date: ""
        });

        setShowModal(true);

    };


    
    //OPEN EDIT
    

    const openEditModal = (lot) => {

        setModalMode("edit");

        setSelectedLot(lot);

        setFormData({
            lot_number:
                lot.lot_number,

            supplier:
                lot.supplier,

            material_type:
                lot.material_type,

            weight:
                lot.weight,

            status:
                lot.status,

            received_date:
                lot.received_date
                    ? lot.received_date.substring(0, 10)
                    : ""
        });

        setShowModal(true);

    };


    //FORM INPUT
    
    const handleInputChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };


    
   // CREATE / UPDATE
    
    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            setError("");


            
           // CREATE
            

            if (
                modalMode === "create"
            ) {

                await axios.post(
                    `${API_URL}/lots`,
                    {
                        lot_number:
                            formData.lot_number,

                        supplier:
                            formData.supplier,

                        material_type:
                            formData.material_type,

                        weight:
                            Number(
                                formData.weight
                            ),

                        status:
                            formData.status,

                        received_date:
                            formData.received_date
                    },
                    getConfig()
                );

            }


          
            
           // UPDATE
           

            else {

                await axios.put(
                    `${API_URL}/lots/${selectedLot.id}`,
                    {
                        supplier:
                            formData.supplier,

                        material_type:
                            formData.material_type,

                        weight:
                            Number(
                                formData.weight
                            ),

                        received_date:
                            formData.received_date,

                        version:
                            selectedLot.version
                    },
                    getConfig()
                );

            }


            setShowModal(false);

            setSelectedLot(null);

            fetchLots();


        } catch (err) {

            console.error(err);


           // CONFLICT
            

            if (
                err.response?.status === 409
            ) {

                setConflictLot(
                    err.response?.data?.currentLot ||
                    selectedLot
                );

                setConflictMessage(
                    err.response?.data?.message ||
                    "This lot was modified by another user."
                );

                setConflictType("edit");

                setConflictVersion(
                    selectedLot?.version || null
                );

                setConflictChanges({
                    supplier: formData.supplier,
                    material_type: formData.material_type,
                    weight: Number(formData.weight),
                    received_date: formData.received_date
                });

                setShowModal(false);

                setShowConflictModal(true);

                return;

            }


            setError(
                err.response?.data?.message ||
                "Failed to save lot."
            );

        }

    };


   
    //DELETE
   

    const openDeleteModal = (lot) => {

        setLotToDelete(lot);

        setShowDeleteModal(true);

    };


    const handleDelete = async () => {

        if (!lotToDelete) {
            return;
        }


        try {

            await axios.delete(
                `${API_URL}/lots/${lotToDelete.id}`,
                getConfig()
            );


            setShowDeleteModal(false);

            setLotToDelete(null);


            /*
            If deleting the last item
            on a page, go to previous page
            */

            if (
                lots.length === 1 &&
                page > 1
            ) {

                setPage(
                    page - 1
                );

            } else {

                fetchLots();

            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete lot."
            );

            setShowDeleteModal(false);

        }

    };


   
   // OPEN STATUS MODAL
    

    const openStatusModal = (lot) => {

        setStatusLot(lot);

        setNewStatus("");

        setShowStatusModal(true);

    };


    //GET ALLOWED NEXT STATUS
   

    const getAllowedStatuses = (currentStatus) => {

        const transitions = {

            RECEIVED: [
                "PROCESSING",
                "REJECTED"
            ],

            PROCESSING: [
                "COMPLETED",
                "REJECTED"
            ],

            COMPLETED: [],

            REJECTED: []

        };


        return (
            transitions[currentStatus] ||
            []
        );

    };



   
   // OPEN STATUS CONFIRMATION
   

    const handleStatusUpdate = () => {

        if (
            !statusLot ||
            !newStatus
        ) {
            return;
        }


        setShowStatusModal(false);

        setShowStatusConfirmModal(true);

    };


   
    //CONFIRM STATUS UPDATE
   

    const confirmStatusUpdate = async () => {

        if (
            !statusLot ||
            !newStatus
        ) {
            return;
        }


        try {

            setError("");


            await axios.patch(
                `${API_URL}/lots/${statusLot.id}/status`,
                {
                    status:
                        newStatus,

                    version:
                        statusLot.version
                },
                getConfig()
            );


            setShowStatusConfirmModal(false);

            setStatusLot(null);

            setNewStatus("");

            fetchLots();


        } catch (err) {

            console.error(err);


            
            //CONFLICT
            

            if (
                err.response?.status === 409
            ) {

                setConflictLot(
                    err.response?.data?.currentLot ||
                    statusLot
                );

                setConflictMessage(
                    err.response?.data?.message ||
                    "This lot was modified by another user."
                );

                setConflictType("status");

                setConflictVersion(
                    statusLot?.version || null
                );

                setConflictChanges({
                    status: newStatus
                });

                setShowStatusConfirmModal(false);

                setShowConflictModal(true);

                return;

            }


            setError(
                err.response?.data?.message ||
                "Failed to update status."
            );

        }

    };


    
   // CONFLICT RESOLUTION
   

    const closeConflictModal = () => {

        setShowConflictModal(false);
        setConflictLot(null);
        setConflictMessage("");
        setConflictType("");
        setConflictChanges(null);
        setConflictVersion(null);
        setConflictActionLoading(false);

    };


    const handleUseLatestVersion = () => {

        if (!conflictLot) {
            return;
        }

        if (conflictType === "edit") {

            setModalMode("edit");
            setSelectedLot(conflictLot);

            setFormData({
                lot_number:
                    conflictLot.lot_number,

                supplier:
                    conflictLot.supplier,

                material_type:
                    conflictLot.material_type,

                weight:
                    conflictLot.weight,

                status:
                    conflictLot.status,

                received_date:
                    conflictLot.received_date
                        ? conflictLot.received_date.substring(0, 10)
                        : ""
            });

            setShowConflictModal(false);
            setShowModal(true);

            setConflictLot(null);
            setConflictMessage("");
            setConflictType("");
            setConflictChanges(null);
            setConflictVersion(null);

            return;
        }


        if (conflictType === "status") {

            const allowedStatuses =
                getAllowedStatuses(
                    conflictLot.status
                );

            if (
                conflictChanges?.status &&
                allowedStatuses.includes(
                    conflictChanges.status
                )
            ) {

                setStatusLot(conflictLot);
                setNewStatus(
                    conflictChanges.status
                );

                setShowConflictModal(false);
                setShowStatusModal(true);

                setConflictLot(null);
                setConflictMessage("");
                setConflictType("");
                setConflictChanges(null);
                setConflictVersion(null);

                return;
            }


            closeConflictModal();

            setError(
                `The requested status change is no longer valid. The latest status is ${conflictLot.status}.`
            );

            fetchLots();

        }

    };


    const handleKeepMyChanges = async () => {

        if (
            !conflictLot ||
            !conflictChanges
        ) {
            return;
        }

        try {

            setConflictActionLoading(true);
            setError("");


            /*
            ==========================
            KEEP EDIT CHANGES
            ==========================
            */

            if (
                conflictType === "edit"
            ) {

                await axios.put(
                    `${API_URL}/lots/${conflictLot.id}`,
                    {
                        ...conflictChanges,
                        version:
                            conflictLot.version
                    },
                    getConfig()
                );

                closeConflictModal();

                setSelectedLot(null);

                await fetchLots();

                return;
            }


            /*
            ==========================
            KEEP STATUS CHANGE
            ==========================
            */

            if (
                conflictType === "status"
            ) {

                await axios.patch(
                    `${API_URL}/lots/${conflictLot.id}/status`,
                    {
                        status:
                            conflictChanges.status,

                        version:
                            conflictLot.version
                    },
                    getConfig()
                );

                closeConflictModal();

                setStatusLot(null);
                setNewStatus("");

                await fetchLots();

                return;
            }

        } catch (err) {

            console.error(err);


            /*
            ==========================
            ANOTHER CONFLICT
            ==========================
            */

            if (
                err.response?.status === 409
            ) {

                setConflictLot(
                    err.response?.data?.currentLot ||
                    conflictLot
                );

                setConflictMessage(
                    err.response?.data?.message ||
                    "This lot was modified again by another user."
                );

                setConflictVersion(
                    conflictLot.version
                );

                setConflictActionLoading(false);

                return;

            }


            setConflictActionLoading(false);

            setError(
                err.response?.data?.message ||
                "Failed to resolve the update conflict."
            );

        } finally {

            setConflictActionLoading(false);

        }

    };


    /*
    ========================================================
    STATUS BADGE
    ========================================================
    */

    const getStatusClass = (lotStatus) => {

        return `
            status-badge
            status-${lotStatus.toLowerCase()}
        `;

    };


    /*
    ========================================================
    INITIAL
    ========================================================
    */

    const getInitial = (name) => {

        if (!name) {
            return "U";
        }

        return name
            .charAt(0)
            .toUpperCase();

    };


    /*
    ========================================================
    RENDER
    ========================================================
    */

    return (

        <Layout>

            <style>{`

                .lots-page {
                    width: 100%;
                }


                /* =========================================
                   HEADER
                ========================================= */

                .lots-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 25px;
                }


                .lots-title h1 {
                    margin: 0;
                    font-size: 27px;
                    font-weight: 700;
                    color: #111827;
                }


                .lots-title p {
                    margin: 7px 0 0;
                    color: #6b7280;
                    font-size: 14px;
                }


                .add-lot-button {
                    border: none;
                    background: #2563eb;
                    color: white;
                    border-radius: 9px;
                    padding: 11px 17px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.2s;
                    white-space: nowrap;
                }


                .add-lot-button:hover {
                    background: #1d4ed8;
                    transform: translateY(-1px);
                }


                /* =========================================
                   TOOLBAR
                ========================================= */

                .lots-toolbar {
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


                .search-form {
                    flex: 1;
                    display: flex;
                    position: relative;
                }


                .search-icon {
                    position: absolute;
                    left: 13px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                }


                .search-input {
                    width: 100%;
                    height: 42px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 0 40px;
                    outline: none;
                    font-size: 13px;
                    color: #111827;
                }


                .search-input:focus {
                    border-color: #2563eb;
                    box-shadow:
                        0 0 0 3px
                        rgba(37, 99, 235, 0.10);
                }


                .clear-search {
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


                .status-filter {
                    height: 42px;
                    min-width: 160px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 0 12px;
                    background: white;
                    color: #374151;
                    outline: none;
                    font-size: 13px;
                }


                .status-filter:focus {
                    border-color: #2563eb;
                }


                .refresh-button {
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


                .refresh-button:hover {
                    background: #f9fafb;
                    color: #2563eb;
                }


                /* =========================================
                   SUMMARY
                ========================================= */

                .lots-summary {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 13px;
                }


                .lots-summary-text {
                    font-size: 12px;
                    color: #6b7280;
                }


                .role-label {
                    display: inline-flex;
                    align-items: center;
                    padding: 5px 9px;
                    border-radius: 6px;
                    background: #eff6ff;
                    color: #2563eb;
                    font-size: 10px;
                    font-weight: 700;
                }


                /* =========================================
                   TABLE
                ========================================= */

                .lots-table-container {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow-x: auto;
                    box-shadow:
                        0 2px 8px
                        rgba(15, 23, 42, 0.03);
                }


                .lots-table {
                    width: 100%;
                    min-width: 1050px;
                    border-collapse: collapse;
                }


                .lots-table th {
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


                .lots-table td {
                    padding: 15px 16px;
                    font-size: 13px;
                    color: #374151;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: middle;
                }


                .lots-table tbody tr:hover {
                    background: #fafcff;
                }


                .lot-number {
                    color: #111827;
                    font-weight: 700;
                    cursor: pointer;
                }


                .lot-number:hover {
                    color: #2563eb;
                }


                .material-text {
                    color: #4b5563;
                }


                .weight-text {
                    font-weight: 600;
                    color: #111827;
                }


                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 5px 9px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 700;
                }


                .status-received {
                    background: #eff6ff;
                    color: #2563eb;
                }


                .status-processing {
                    background: #fff7ed;
                    color: #c2410c;
                }


                .status-completed {
                    background: #ecfdf5;
                    color: #047857;
                }


                .status-rejected {
                    background: #fef2f2;
                    color: #dc2626;
                }


                /* =========================================
                   ACTIONS
                ========================================= */

                .action-buttons {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    flex-wrap: wrap;
                }


                .action-button {
                    height: 34px;
                    border: 1px solid transparent;
                    border-radius: 8px;
                    padding: 0 11px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }


                /* VIEW - BLUE */

                .view-action {
                    background: #eff6ff;
                    color: #2563eb;
                    border-color: #bfdbfe;
                }


                .view-action:hover {
                    background: #dbeafe;
                    color: #1d4ed8;
                    transform: translateY(-1px);
                }


                /* EDIT - PURPLE */

                .edit-action {
                    background: #f5f3ff;
                    color: #7c3aed;
                    border-color: #ddd6fe;
                }


                .edit-action:hover {
                    background: #ede9fe;
                    color: #6d28d9;
                    transform: translateY(-1px);
                }


                /* CHANGE STATUS - ORANGE */

                .status-action {
                    height: 34px;
                    border: 1px solid #fed7aa;
                    background: #fff7ed;
                    color: #ea580c;
                    border-radius: 8px;
                    padding: 0 11px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }


                .status-action:hover {
                    background: #ffedd5;
                    color: #c2410c;
                    transform: translateY(-1px);
                }


                /* DELETE - RED */

                .delete-action {
                    background: #fef2f2;
                    color: #dc2626;
                    border-color: #fecaca;
                }


                .delete-action:hover {
                    background: #fee2e2;
                    color: #b91c1c;
                    transform: translateY(-1px);
                }


                .action-button:active,
                .status-action:active {
                    transform: translateY(0);
                }


                /* =========================================
                   PAGINATION
                ========================================= */

                .pagination {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 2px;
                }


                .pagination-info {
                    font-size: 12px;
                    color: #6b7280;
                }


                .pagination-buttons {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }


                .page-button {
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


                .page-button:hover:not(:disabled) {
                    border-color: #2563eb;
                    color: #2563eb;
                }


                .page-button.active {
                    background: #2563eb;
                    color: white;
                    border-color: #2563eb;
                }


                .page-button:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }


                /* =========================================
                   LOADING
                ========================================= */

                .table-message {
                    min-height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 10px;
                    color: #6b7280;
                    font-size: 13px;
                }


                .spinner {
                    animation: spin 1s linear infinite;
                }


                @keyframes spin {

                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }

                }


                /* =========================================
                   ERROR
                ========================================= */

                .error-box {
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


                .error-close {
                    border: none;
                    background: transparent;
                    color: #b91c1c;
                    cursor: pointer;
                }


                /* =========================================
                   MODAL
                ========================================= */

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.55);
                    backdrop-filter: blur(2px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    z-index: 2000;
                }


                .modal-card {
                    width: 100%;
                    max-width: 500px;
                    background: white;
                    border-radius: 14px;
                    box-shadow:
                        0 20px 60px
                        rgba(15, 23, 42, 0.20);
                    overflow: hidden;
                }


                .modal-header {
                    padding: 18px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }


                .modal-header h2 {
                    margin: 0;
                    font-size: 17px;
                    color: #111827;
                }


                .modal-close {
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


                .modal-close:hover {
                    background: #f1f5f9;
                    color: #111827;
                }


                .modal-body {
                    padding: 20px;
                }


                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }


                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }


                .form-group.full {
                    grid-column: 1 / -1;
                }


                .form-group label {
                    font-size: 11px;
                    font-weight: 600;
                    color: #374151;
                }


                .form-input,
                .form-select {
                    width: 100%;
                    height: 40px;
                    box-sizing: border-box;
                    border: 1px solid #d1d5db;
                    border-radius: 7px;
                    padding: 0 11px;
                    font-size: 12px;
                    outline: none;
                    color: #111827;
                    background: white;
                }


                .form-input:focus,
                .form-select:focus {
                    border-color: #2563eb;
                    box-shadow:
                        0 0 0 3px
                        rgba(37, 99, 235, 0.08);
                }


                .form-input:disabled {
                    background: #f8fafc;
                    color: #6b7280;
                    cursor: not-allowed;
                }


                .modal-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: flex-end;
                    gap: 9px;
                }


                .secondary-button {
                    border: 1px solid #d1d5db;
                    background: white;
                    color: #374151;
                    border-radius: 7px;
                    padding: 9px 14px;
                    font-size: 12px;
                    cursor: pointer;
                }


                .secondary-button:hover {
                    background: #f9fafb;
                }


                .primary-button {
                    border: none;
                    background: #2563eb;
                    color: white;
                    border-radius: 7px;
                    padding: 9px 15px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }


                .primary-button:hover:not(:disabled) {
                    background: #1d4ed8;
                }


                .primary-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }


                .danger-button {
                    border: none;
                    background: #dc2626;
                    color: white;
                    border-radius: 7px;
                    padding: 9px 15px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }


                .danger-button:hover {
                    background: #b91c1c;
                }


                /* =========================================
                   CONFIRM / CONFLICT
                ========================================= */

                .confirm-body {
                    padding: 25px 20px;
                }


                .confirm-body h3 {
                    margin: 0 0 8px;
                    color: #111827;
                    font-size: 17px;
                }


                .confirm-body p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 13px;
                    line-height: 1.6;
                }


                .conflict-current {
                    margin-top: 16px;
                    padding: 12px;
                    border-radius: 8px;
                    background: #fff7ed;
                    border: 1px solid #fed7aa;
                    font-size: 12px;
                    color: #9a3412;
                    line-height: 1.7;
                }

                .conflict-title-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                }

                .conflict-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    background: #fff7ed;
                    color: #ea580c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .conflict-version-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-top: 16px;
                }

                .conflict-version-box {
                    padding: 12px;
                    border-radius: 9px;
                    border: 1px solid #e5e7eb;
                    background: #f8fafc;
                }

                .conflict-version-box.latest {
                    background: #eff6ff;
                    border-color: #bfdbfe;
                }

                .conflict-version-label {
                    display: block;
                    font-size: 10px;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    font-weight: 700;
                    margin-bottom: 5px;
                }

                .conflict-version-number {
                    font-size: 17px;
                    font-weight: 700;
                    color: #111827;
                }

                .conflict-version-box.latest .conflict-version-number {
                    color: #2563eb;
                }

                .conflict-latest-details {
                    margin-top: 12px;
                    padding: 12px;
                    border-radius: 9px;
                    background: #f8fafc;
                    border: 1px solid #e5e7eb;
                    font-size: 12px;
                    color: #475569;
                    line-height: 1.8;
                }

                .conflict-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 9px;
                    flex-wrap: wrap;
                }

                .conflict-latest-button {
                    border: 1px solid #cbd5e1;
                    background: white;
                    color: #334155;
                    border-radius: 7px;
                    padding: 9px 14px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .conflict-latest-button:hover {
                    background: #f8fafc;
                }

                .conflict-keep-button {
                    border: none;
                    background: #2563eb;
                    color: white;
                    border-radius: 7px;
                    padding: 9px 15px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .conflict-keep-button:hover:not(:disabled) {
                    background: #1d4ed8;
                }

                .conflict-keep-button:disabled,
                .conflict-latest-button:disabled {
                    opacity: 0.55;
                    cursor: not-allowed;
                }

                .conflict-warning {
                    margin-top: 14px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    color: #991b1b;
                    font-size: 11px;
                    line-height: 1.6;
                }


                .status-change-summary {
                    margin-top: 16px;
                    padding: 14px;
                    border-radius: 9px;
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    font-size: 12px;
                    color: #1e40af;
                    line-height: 1.8;
                }


                .status-change-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 15px;
                }


                .status-change-label {
                    color: #64748b;
                }


                .status-change-value {
                    font-weight: 700;
                    color: #1e3a8a;
                    text-align: right;
                }


                /* =========================================
                   RESPONSIVE
                ========================================= */

                @media (max-width: 800px) {

                    .lots-header {
                        flex-direction: column;
                    }


                    .lots-toolbar {
                        flex-direction: column;
                        align-items: stretch;
                    }


                    .status-filter {
                        width: 100%;
                    }


                    .refresh-button {
                        width: 100%;
                    }

                }


                @media (max-width: 600px) {

                    .form-grid {
                        grid-template-columns: 1fr;
                    }


                    .form-group.full {
                        grid-column: auto;
                    }


                    .pagination {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }


                    .status-change-row {
                        flex-direction: column;
                        gap: 2px;
                    }


                    .status-change-value {
                        text-align: left;
                    }

                }

            `}</style>


            <div className="lots-page">


                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="lots-header">

                    <div className="lots-title">

                        <h1>
                            Lots
                        </h1>

                        <p>
                            Manage and track all material lots.
                        </p>

                    </div>


                    {isEditor && (

                        <button
                            className="add-lot-button"
                            onClick={
                                openCreateModal
                            }
                        >

                            <Plus size={17} />

                            Add Lot

                        </button>

                    )}

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="error-box">

                        <span>
                            {error}
                        </span>

                        <button
                            className="error-close"
                            onClick={() =>
                                setError("")
                            }
                        >
                            <X size={16} />
                        </button>

                    </div>

                )}


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="lots-toolbar">

                    <form
                        className="search-form"
                        onSubmit={
                            handleSearch
                        }
                    >

                        <Search
                            size={17}
                            className="search-icon"
                        />


                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by lot number, supplier, material or status..."
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
                                className="clear-search"
                                onClick={
                                    clearSearch
                                }
                            >

                                <X size={15} />

                            </button>

                        )}

                    </form>


                    <select
                        className="status-filter"
                        value={status}
                        onChange={(e) => {

                            setStatus(
                                e.target.value
                            );

                            setPage(1);

                        }}
                    >

                        <option value="">
                            All Statuses
                        </option>

                        <option value="RECEIVED">
                            Received
                        </option>

                        <option value="PROCESSING">
                            Processing
                        </option>

                        <option value="COMPLETED">
                            Completed
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                    </select>


                    <button
                        className="refresh-button"
                        onClick={
                            fetchLots
                        }
                        title="Refresh"
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "spinner"
                                    : ""
                            }
                        />

                    </button>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <div className="lots-summary">

                    <span className="lots-summary-text">

                        {pagination.total} lot
                        {pagination.total !== 1
                            ? "s"
                            : ""}

                    </span>


                    <span className="role-label">

                        {user.role ||
                            "VIEWER"}

                    </span>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="lots-table-container">

                    {loading ? (

                        <div className="table-message">

                            <RefreshCw
                                size={25}
                                className="spinner"
                            />

                            Loading lots...

                        </div>

                    ) : lots.length === 0 ? (

                        <div className="table-message">

                            <PackageEmpty />

                            <strong>
                                No lots found
                            </strong>

                            <span>
                                Try changing your search
                                or filter.
                            </span>

                        </div>

                    ) : (

                        <table className="lots-table">

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
                                        Weight
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Received Date
                                    </th>

                                    <th>
                                        Version
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {lots.map((lot) => (

                                    <tr
                                        key={lot.id}
                                    >

                                        <td>

                                            <span
                                                className="lot-number"
                                                onClick={() =>
                                                    navigate(
                                                        `/lots/${lot.id}`
                                                    )
                                                }
                                            >

                                                {lot.lot_number}

                                            </span>

                                        </td>


                                        <td>
                                            {lot.supplier}
                                        </td>


                                        <td className="material-text">

                                            {lot.material_type}

                                        </td>


                                        <td className="weight-text">

                                            {Number(
                                                lot.weight
                                            ).toLocaleString()}

                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    getStatusClass(
                                                        lot.status
                                                    )
                                                }
                                            >

                                                {lot.status}

                                            </span>

                                        </td>


                                        <td>

                                            {lot.received_date
                                                ? new Date(
                                                    lot.received_date
                                                ).toLocaleDateString()
                                                : "-"}

                                        </td>


                                        <td>

                                            v{lot.version}

                                        </td>


                                        <td>

                                            <div className="action-buttons">


                                                {/* =================
                                                    VIEW
                                                ================= */}

                                                <button
                                                    className="action-button view-action"
                                                    title="View details"
                                                    onClick={() =>
                                                        navigate(
                                                            `/lots/${lot.id}`
                                                        )
                                                    }
                                                >

                                                    <Eye
                                                        size={15}
                                                    />

                                                    View

                                                </button>


                                                {/* =================
                                                    EDITOR ACTIONS
                                                ================= */}

                                                {isEditor && (

                                                    <>


                                                        {/* EDIT */}

                                                        <button
                                                            className="action-button edit-action"
                                                            title="Edit lot"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    lot
                                                                )
                                                            }
                                                        >

                                                            <Pencil
                                                                size={15}
                                                            />

                                                            Edit

                                                        </button>


                                                        {/* CHANGE STATUS */}

                                                        {getAllowedStatuses(
                                                            lot.status
                                                        ).length > 0 && (

                                                            <button
                                                                className="status-action"
                                                                title="Change lot status"
                                                                onClick={() =>
                                                                    openStatusModal(
                                                                        lot
                                                                    )
                                                                }
                                                            >

                                                                <RefreshCw
                                                                    size={14}
                                                                />

                                                                Change Status

                                                            </button>

                                                        )}


                                                        {/* DELETE */}

                                                        <button
                                                            className="action-button delete-action"
                                                            title="Delete lot"
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    lot
                                                                )
                                                            }
                                                        >

                                                            <Trash2
                                                                size={15}
                                                            />

                                                            Delete

                                                        </button>


                                                    </>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {!loading &&
                    pagination.totalPages > 0 && (

                    <div className="pagination">

                        <div className="pagination-info">

                            Showing page{" "}

                            <strong>
                                {pagination.page}
                            </strong>{" "}

                            of{" "}

                            <strong>
                                {pagination.totalPages}
                            </strong>

                        </div>


                        <div className="pagination-buttons">

                            <button
                                className="page-button"
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
                                        pagination.totalPages <= 7
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
                                            page-button
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

                                        {pageNumber}

                                    </button>

                                )
                            )}


                            <button
                                className="page-button"
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


                {/* =================================================
                    CREATE / EDIT MODAL
                ================================================= */}

                {showModal && (

                    <div
                        className="modal-overlay"
                        onClick={() =>
                            setShowModal(false)
                        }
                    >

                        <div
                            className="modal-card"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <h2>

                                    {modalMode === "create"
                                        ? "Create New Lot"
                                        : "Edit Lot"}

                                </h2>


                                <button
                                    className="modal-close"
                                    onClick={() =>
                                        setShowModal(
                                            false
                                        )
                                    }
                                >

                                    <X size={17} />

                                </button>

                            </div>


                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="modal-body">

                                    <div className="form-grid">


                                        {/* LOT NUMBER */}

                                        <div className="form-group">

                                            <label>
                                                Lot Number
                                            </label>

                                            <input
                                                className="form-input"
                                                name="lot_number"
                                                value={
                                                    formData.lot_number
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                disabled={
                                                    modalMode ===
                                                    "edit"
                                                }
                                                required
                                            />

                                        </div>


                                        {/* SUPPLIER */}

                                        <div className="form-group">

                                            <label>
                                                Supplier
                                            </label>

                                            <input
                                                className="form-input"
                                                name="supplier"
                                                value={
                                                    formData.supplier
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                required
                                            />

                                        </div>


                                        {/* MATERIAL */}

                                        <div className="form-group">

                                            <label>
                                                Material Type
                                            </label>

                                            <input
                                                className="form-input"
                                                name="material_type"
                                                value={
                                                    formData.material_type
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                required
                                            />

                                        </div>


                                        {/* WEIGHT */}

                                        <div className="form-group">

                                            <label>
                                                Weight
                                            </label>

                                            <input
                                                className="form-input"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                name="weight"
                                                value={
                                                    formData.weight
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                required
                                            />

                                        </div>


                                        {/* STATUS */}

                                        {modalMode ===
                                            "create" && (

                                            <div className="form-group">

                                                <label>
                                                    Status
                                                </label>

                                                <select
                                                    className="form-select"
                                                    name="status"
                                                    value={
                                                        formData.status
                                                    }
                                                    onChange={
                                                        handleInputChange
                                                    }
                                                >

                                                    <option value="RECEIVED">
                                                        RECEIVED
                                                    </option>

                                                </select>

                                            </div>

                                        )}


                                        {/* DATE */}

                                        <div className="form-group">

                                            <label>
                                                Received Date
                                            </label>

                                            <input
                                                className="form-input"
                                                type="date"
                                                name="received_date"
                                                value={
                                                    formData.received_date
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                                required
                                            />

                                        </div>


                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() =>
                                            setShowModal(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="primary-button"
                                    >

                                        {modalMode ===
                                            "create"
                                            ? "Create Lot"
                                            : "Save Changes"}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* =================================================
                    DELETE CONFIRMATION MODAL
                ================================================= */}

                {showDeleteModal &&
                    lotToDelete && (

                    <div className="modal-overlay">

                        <div className="modal-card">

                            <div className="confirm-body">

                                <h3>
                                    Delete Lot?
                                </h3>

                                <p>
                                    Are you sure you want
                                    to delete{" "}

                                    <strong>
                                        {
                                            lotToDelete.lot_number
                                        }
                                    </strong>

                                    ? This action cannot
                                    be undone.
                                </p>

                            </div>


                            <div className="modal-footer">

                                <button
                                    className="secondary-button"
                                    onClick={() => {

                                        setShowDeleteModal(
                                            false
                                        );

                                        setLotToDelete(
                                            null
                                        );

                                    }}
                                >
                                    Cancel
                                </button>


                                <button
                                    className="danger-button"
                                    onClick={
                                        handleDelete
                                    }
                                >
                                    Delete Lot
                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    CHANGE STATUS MODAL
                ================================================= */}

                {showStatusModal &&
                    statusLot && (

                    <div className="modal-overlay">

                        <div className="modal-card">

                            <div className="modal-header">

                                <h2>
                                    Change Lot Status
                                </h2>


                                <button
                                    className="modal-close"
                                    onClick={() =>
                                        setShowStatusModal(
                                            false
                                        )
                                    }
                                >

                                    <X size={17} />

                                </button>

                            </div>


                            <div className="modal-body">

                                <p
                                    style={{
                                        marginTop: 0,
                                        fontSize: 13,
                                        color: "#6b7280"
                                    }}
                                >

                                    Current status:{" "}

                                    <strong>
                                        {
                                            statusLot.status
                                        }
                                    </strong>

                                </p>


                                <select
                                    className="form-select"
                                    value={
                                        newStatus
                                    }
                                    onChange={(e) =>
                                        setNewStatus(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select new status
                                    </option>


                                    {getAllowedStatuses(
                                        statusLot.status
                                    ).map(
                                        nextStatus => (

                                            <option
                                                key={
                                                    nextStatus
                                                }
                                                value={
                                                    nextStatus
                                                }
                                            >

                                                {nextStatus}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="modal-footer">

                                <button
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowStatusModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    className="primary-button"
                                    disabled={
                                        !newStatus
                                    }
                                    onClick={
                                        handleStatusUpdate
                                    }
                                >
                                    Continue
                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    STATUS CONFIRMATION MODAL
                ================================================= */}

                {showStatusConfirmModal &&
                    statusLot &&
                    newStatus && (

                    <div className="modal-overlay">

                        <div className="modal-card">

                            <div className="modal-header">

                                <h2>
                                    Confirm Status Change
                                </h2>


                                <button
                                    className="modal-close"
                                    onClick={() => {

                                        setShowStatusConfirmModal(
                                            false
                                        );

                                        setShowStatusModal(
                                            true
                                        );

                                    }}
                                >

                                    <X size={17} />

                                </button>

                            </div>


                            <div className="confirm-body">

                                <h3>
                                    Change lot status?
                                </h3>


                                <p>

                                    Are you sure you want
                                    to change the status of{" "}

                                    <strong>
                                        {
                                            statusLot.lot_number
                                        }
                                    </strong>{" "}

                                    from{" "}

                                    <strong>
                                        {
                                            statusLot.status
                                        }
                                    </strong>{" "}

                                    to{" "}

                                    <strong>
                                        {newStatus}
                                    </strong>
                                    ?

                                </p>


                                <div className="status-change-summary">

                                    <div className="status-change-row">

                                        <span className="status-change-label">
                                            Lot Number
                                        </span>

                                        <span className="status-change-value">
                                            {
                                                statusLot.lot_number
                                            }
                                        </span>

                                    </div>


                                    <div className="status-change-row">

                                        <span className="status-change-label">
                                            Current Status
                                        </span>

                                        <span className="status-change-value">
                                            {
                                                statusLot.status
                                            }
                                        </span>

                                    </div>


                                    <div className="status-change-row">

                                        <span className="status-change-label">
                                            New Status
                                        </span>

                                        <span className="status-change-value">
                                            {newStatus}
                                        </span>

                                    </div>


                                    <div className="status-change-row">

                                        <span className="status-change-label">
                                            Current Version
                                        </span>

                                        <span className="status-change-value">
                                            v
                                            {
                                                statusLot.version
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>


                            <div className="modal-footer">

                                <button
                                    className="secondary-button"
                                    onClick={() => {

                                        setShowStatusConfirmModal(
                                            false
                                        );

                                        setShowStatusModal(
                                            true
                                        );

                                    }}
                                >
                                    Cancel
                                </button>


                                <button
                                    className="primary-button"
                                    onClick={
                                        confirmStatusUpdate
                                    }
                                >
                                    Confirm Status Change
                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {/* =================================================
                    CONFLICT MODAL
                ================================================= */}

                {showConflictModal && (

                    <div className="modal-overlay">

                        <div className="modal-card">

                            <div className="modal-header">

                                <div className="conflict-title-row">

                                    <div className="conflict-icon">
                                        <RefreshCw size={19} />
                                    </div>

                                    <div>
                                        <h2>
                                            Update Conflict
                                        </h2>

                                        <div
                                            style={{
                                                marginTop: 3,
                                                fontSize: 11,
                                                color: "#64748b"
                                            }}
                                        >
                                            Optimistic concurrency protection
                                        </div>
                                    </div>

                                </div>


                                <button
                                    className="modal-close"
                                    onClick={closeConflictModal}
                                    disabled={
                                        conflictActionLoading
                                    }
                                >
                                    <X size={17} />
                                </button>

                            </div>


                            <div className="confirm-body">

                                <h3>
                                    This lot was modified by another user
                                </h3>


                                <p>
                                    {conflictMessage}
                                </p>


                                {conflictLot && (

                                    <>

                                        <div className="conflict-version-grid">

                                            <div className="conflict-version-box">

                                                <span className="conflict-version-label">
                                                    Your version
                                                </span>

                                                <span className="conflict-version-number">
                                                    v{
                                                        conflictVersion ??
                                                        "-"
                                                    }
                                                </span>

                                            </div>


                                            <div className="conflict-version-box latest">

                                                <span className="conflict-version-label">
                                                    Latest version
                                                </span>

                                                <span className="conflict-version-number">
                                                    v{
                                                        conflictLot.version
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        <div className="conflict-latest-details">

                                            <strong>
                                                Latest saved data
                                            </strong>

                                            <br />

                                            <strong>
                                                Lot:
                                            </strong>{" "}
                                            {
                                                conflictLot.lot_number
                                            }

                                            <br />

                                            <strong>
                                                Supplier:
                                            </strong>{" "}
                                            {
                                                conflictLot.supplier
                                            }

                                            <br />

                                            <strong>
                                                Material:
                                            </strong>{" "}
                                            {
                                                conflictLot.material_type
                                            }

                                            <br />

                                            <strong>
                                                Weight:
                                            </strong>{" "}
                                            {
                                                Number(
                                                    conflictLot.weight
                                                ).toLocaleString()
                                            }

                                            <br />

                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            {
                                                conflictLot.status
                                            }

                                        </div>


                                        <div className="conflict-warning">

                                            <strong>
                                                Important:
                                            </strong>{" "}
                                            "Keep My Changes" will retry your
                                            changes using the latest version.
                                            This prevents a stale update from
                                            silently overwriting newer data.

                                        </div>

                                    </>

                                )}

                            </div>


                            <div className="modal-footer">

                                <div className="conflict-actions">

                                    <button
                                        className="secondary-button"
                                        onClick={closeConflictModal}
                                        disabled={
                                            conflictActionLoading
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        className="conflict-latest-button"
                                        onClick={
                                            handleUseLatestVersion
                                        }
                                        disabled={
                                            conflictActionLoading
                                        }
                                    >
                                        Use Latest Version
                                    </button>


                                    <button
                                        className="conflict-keep-button"
                                        onClick={
                                            handleKeepMyChanges
                                        }
                                        disabled={
                                            conflictActionLoading ||
                                            !conflictLot ||
                                            !conflictChanges
                                        }
                                    >
                                        {conflictActionLoading
                                            ? "Resolving..."
                                            : "Keep My Changes"}
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </Layout>

    );
}


/*
============================================================
EMPTY ICON
============================================================
*/

function PackageEmpty() {

    return (

        <div
            style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8"
            }}
        >

            <PackageIcon />

        </div>

    );

}


function PackageIcon() {

    return (

        <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >

            <path d="m16.5 9.4-9-5.19" />

            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />

            <polyline points="3.29 7 12 12 20.71 7" />

            <line
                x1="12"
                y1="22"
                x2="12"
                y2="12"
            />

        </svg>

    );

}


export default Lots;