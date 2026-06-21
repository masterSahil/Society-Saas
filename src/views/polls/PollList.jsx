"use client";
import React, { useState, useEffect, useCallback } from "react";
import { BarChart2, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useApi from "../../hooks/useApi";
import usePagination from "../../hooks/usePagination";
import { formatDate } from "../../utils/formatDate";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import Modal from "../../components/shared/Modal";
import StatusBadge from "../../components/shared/StatusBadge";
import { useNavigate } from '@/lib/react-router-dom';


const PollList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { get, post } = useApi();
    const { page, limit, handlePageChange } = usePagination(1, 10);
    
    const [polls, setPolls] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    const [isVoteOpen, setIsVoteOpen] = useState(false);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [pollResults, setPollResults] = useState(null);

    const fetchPolls = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({ page, limit }).toString();
            const res = await get(`/polls?${query}`);
            setPolls(res.data.polls);
            setTotal(res.data.pagination?.total || res.data.polls.length);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, get]);

    useEffect(() => {
        fetchPolls();
    }, [fetchPolls]);



    const handleVote = async (e) => {
        e.preventDefault();
        const selectedOption = e.target.option.value;
        try {
            await post(`/polls/${selectedPoll._id}/vote`, { selectedOption });
            setIsVoteOpen(false);
            fetchPolls();
            toast.success("Vote submitted successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchResults = async (poll) => {
        setSelectedPoll(poll);
        try {
            const res = await get(`/polls/${poll._id}/results`);
            setPollResults(res.data);
            setIsResultsOpen(true);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const columns = [
        {
            header: "Poll Question",
            accessor: "question",
            cell: (row) => <div className="font-semibold text-cyber-text">{row.question}</div>,
        },
        {
            header: "Duration",
            accessor: "duration",
            cell: (row) => (
                <div className="text-sm text-cyber-muted">
                    {formatDate(row.startDate, "short")} - {formatDate(row.endDate, "short")}
                </div>
            ),
        },
        {
            header: "Status",
            accessor: "isActive",
            cell: (row) => <StatusBadge status={row.isActive ? "active" : "closed"} />,
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            cellClassName: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {user?.role === "resident" && row.isActive && (
                        <button
                            onClick={() => { setSelectedPoll(row); setIsVoteOpen(true); }}
                            className="text-xs font-medium bg-cyber-accent/10 text-cyber-accent px-3 py-1.5 rounded-lg hover:bg-cyber-accent/20 transition-colors"
                        >
                            Vote Now
                        </button>
                    )}
                    <button
                        onClick={() => fetchResults(row)}
                        className="text-xs font-medium bg-cyber-text/10 text-cyber-text px-3 py-1.5 rounded-lg hover:bg-stone-200 transition-colors"
                    >
                        View Results
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Society Polls"
                subtitle="Participate in community decisions and view poll results."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        {user?.role === "admin" && (
                        <button
                            onClick={() => navigate("/polls/new")}
                            className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                        >
                            <Plus size={18} /> Create Poll
                        </button>
                    )}
                    </>}
            />

            

            <DataTable viewMode={viewMode}
                columns={columns}
                data={polls}
                isLoading={isLoading}
                emptyIcon={BarChart2}
                emptyTitle="No polls active"
                emptyMessage="There are currently no active polls to vote on."
                pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }}
                onPageChange={handlePageChange}
            />

            <Modal
                isOpen={isVoteOpen}
                onClose={() => setIsVoteOpen(false)}
                title="Cast Your Vote"
            >
                <form onSubmit={handleVote} className="flex flex-col gap-4">
                    <p className="font-medium text-cyber-text text-lg mb-2">{selectedPoll?.question}</p>
                    <div className="space-y-3">
                        {selectedPoll?.options.map((opt, idx) => (
                            <label key={idx} className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-cyber-text/5 cursor-pointer transition-colors">
                                <input
                                    type="radio"
                                    name="option"
                                    value={opt}
                                    required
                                    className="w-4 h-4 text-cyber-accent border-border focus:ring-teal-500"
                                />
                                <span className="text-cyber-text">{opt}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <button type="button" onClick={() => setIsVoteOpen(false)} className="flex-1 px-4 py-2 border border-border text-cyber-muted rounded-lg hover:bg-cyber-text/5">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover shadow-sm">Submit Vote</button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isResultsOpen}
                onClose={() => setIsResultsOpen(false)}
                title="Poll Results"
            >
                {pollResults && (
                    <div className="flex flex-col gap-4">
                        <p className="font-bold text-cyber-text text-lg">{pollResults.poll.question}</p>
                        <p className="text-sm text-cyber-muted mb-2">Total Votes: {pollResults.totalVotes}</p>
                        
                        <div className="space-y-4">
                            {pollResults.results.map((res, idx) => {
                                const percentage = pollResults.totalVotes > 0 
                                    ? Math.round((res.count / pollResults.totalVotes) * 100) 
                                    : 0;
                                    
                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-cyber-text">{res.option}</span>
                                            <span className="text-cyber-muted">{res.count} ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-cyber-text/10 rounded-full h-2">
                                            <div 
                                                className="bg-teal-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PollList;
