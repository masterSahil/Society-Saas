"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '@/lib/react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../config/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timeLeft, setTimeLeft] = useState(120); // 120 seconds = 2 minutes
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    useEffect(() => {
        if (step === 2 && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [step, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/forgot-password', { email: formData.email });
            setSuccess(res.data.message || 'OTP sent successfully');
            setStep(2);
            setTimeLeft(120); // Reset timer when OTP is sent
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
            setSuccess(res.data.message || 'OTP verified successfully');
            setStep(3);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            setSuccess(res.data.message || 'Password reset successfully');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-cyber-bg font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-bg via-cyber-surface to-cyber-bg" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyber-primary rounded-full blur-[150px] opacity-20" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyber-accent rounded-full blur-[150px] opacity-20" />

            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-md p-8 glass-panel rounded-xl shadow-neon border border-border"
            >
                <div className="mb-8 text-center">
                    <Link to="/" className="absolute top-8 left-8 text-cyber-muted hover:text-cyber-text transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h2 className="text-2xl font-bold text-cyber-text tracking-tight">
                        Reset Password
                    </h2>
                    <p className="text-cyber-muted text-sm mt-2">
                        {step === 1 && "Enter your email to receive an OTP"}
                        {step === 2 && "Enter the 6-digit OTP sent to your email"}
                        {step === 3 && "Create a new secure password"}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm font-medium"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-lg flex items-center gap-2 text-[#10b981] text-sm font-medium"
                        >
                            <CheckCircle2 size={16} />
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-cyber-muted mb-1.5 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-cyber-surface/50 border border-border rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent transition-all outline-none text-cyber-text placeholder-cyber-muted/50"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-cyber-primary hover:bg-cyber-primary-hover text-white font-medium py-3 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] disabled:opacity-50"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-cyber-muted mb-1.5 uppercase tracking-wider">6-Digit OTP</label>
                            <input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-center tracking-[0.5em] text-lg bg-cyber-surface/50 border border-border rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent transition-all outline-none text-cyber-text placeholder-cyber-muted/50 disabled:opacity-50"
                                placeholder="••••••"
                                maxLength={6}
                                required
                                disabled={timeLeft === 0}
                            />
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-cyber-muted">Time remaining:</span>
                            <span className={`font-mono font-medium ${timeLeft < 30 ? 'text-red-400' : 'text-cyber-accent'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || timeLeft === 0}
                            className="w-full mt-4 bg-cyber-primary hover:bg-cyber-primary-hover text-white font-medium py-3 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={loading || timeLeft > 0}
                            className="w-full mt-2 bg-transparent text-cyber-accent text-sm font-medium py-2 rounded-lg hover:bg-cyber-surface transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            {timeLeft > 0 ? `Resend OTP in ${formatTime(timeLeft)}` : "Resend OTP"}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-cyber-muted mb-1.5 uppercase tracking-wider">New Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-cyber-surface/50 border border-border rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent transition-all outline-none text-cyber-text placeholder-cyber-muted/50"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-cyber-muted mb-1.5 uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-cyber-surface/50 border rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent transition-all outline-none text-cyber-text placeholder-cyber-muted/50 ${
                                            formData.confirmPassword && formData.newPassword !== formData.confirmPassword 
                                            ? 'border-red-500/50 focus:ring-red-500' 
                                            : 'border-border'
                                        }`}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                    <p className="text-xs text-red-400 mt-1.5 ml-1">Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || (formData.confirmPassword && formData.newPassword !== formData.confirmPassword)}
                            className="w-full mt-6 bg-cyber-primary hover:bg-cyber-primary-hover text-white font-medium py-3 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] disabled:opacity-50"
                        >
                            {loading ? "Resetting Password..." : "Set New Password"}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
