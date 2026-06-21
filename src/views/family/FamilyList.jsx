"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Users, Plus, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useApi from "../../hooks/useApi";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { useNavigate } from '@/lib/react-router-dom';
import toast from 'react-hot-toast';


const FamilyList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { get, del } = useApi();
    
    const [familyMembers, setFamilyMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    // Modal States
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const fetchFamily = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await get("/family");
            setFamilyMembers(res.data.members || res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [get]);

    useEffect(() => {
        fetchFamily();
    }, [fetchFamily]);



    const handleDeleteMember = async () => {
        try {
            await del(`/family/${selectedMember._id}`);
            setIsDeleteOpen(false);
            fetchFamily();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const columns = [
        {
            header: "Name",
            accessor: "name",
            cell: (row) => (
                <div className="font-medium text-cyber-text">{row.name}</div>
            ),
        },
        { header: "Relation", accessor: "relation" },
        { header: "Age", accessor: "age" },
        {
            header: "Phone",
            accessor: "phone",
            cell: (row) => row.phone || <span className="text-cyber-muted/70 italic">Not provided</span>,
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            cellClassName: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {/* Allow residents to edit their own family, and admins can view but not edit (based on requirements) */}
                    {user?.role === "resident" && (
                        <>
                            <button
                                onClick={() => navigate(`/family/edit/${row._id}`, { state: row })}
                                className="p-2 text-cyber-muted/70 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => { setSelectedMember(row); setIsDeleteOpen(true); }}
                                className="p-2 text-cyber-muted/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="My Family"
                subtitle="Manage details of family members residing with you."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        {user?.role === "resident" && (
                        <button
                            onClick={() => navigate('/family/new')}
                            className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                        >
                            <Plus size={18} /> Add Member
                        </button>
                    )}
                    </>}
            />

            

            <DataTable viewMode={viewMode}
                columns={columns}
                data={familyMembers}
                isLoading={isLoading}
                emptyIcon={Users}
                emptyTitle="No family members added"
                emptyMessage="You haven't added any family members to your profile yet."
            />

            {/* Modals */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteMember}
                title="Delete Family Member"
                message={`Are you sure you want to remove ${selectedMember?.name} from your family list?`}
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
};

export default FamilyList;
