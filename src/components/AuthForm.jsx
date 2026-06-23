"use client";
import React, { useState } from 'react';
import { useNavigate, Link } from '@/lib/react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../config/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Registration successful! Please log in.');
      setIsLogin(true);
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-cyber-bg font-sans">
      {/* Left Panel - Branding/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-cyber-surface items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/90 to-cyber-secondary/90 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
        />
        
        <div className="relative z-20 text-white max-w-xl px-12 flex flex-col justify-center h-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Modern Society Management
            </h1>
            <p className="text-lg text-white/80 mb-12">
              Streamline your community operations with our comprehensive suite of tools designed for modern residential societies.
            </p>

            <div className="space-y-4">
              {[
                'Seamless resident communication',
                'Automated billing and collections',
                'Smart facility management',
                'Advanced security controls'
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <CheckCircle2 className="w-5 h-5 text-cyber-accent" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
        {/* Subtle background decoration for mobile */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyber-primary rounded-full blur-[150px] opacity-10 lg:hidden" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden w-12 h-12 bg-cyber-primary/10 rounded-xl flex items-center justify-center mb-8 border border-cyber-primary/20">
            <Building2 className="w-6 h-6 text-cyber-primary" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-cyber-text tracking-tight mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-cyber-muted text-base">
              {isLogin 
                ? 'Enter your details to access your account.' 
                : 'Get started with your free account today.'}
            </p>
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-50 dark:bg-emerald-500/10 border border-green-200 dark:border-emerald-500/30 rounded-xl text-green-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-5" onSubmit={isLogin ? loginSubmit : signupSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-cyber-text mb-1.5">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-cyber-surface border border-border rounded-xl focus:ring-2 focus:ring-cyber-primary/50 focus:border-cyber-primary transition-all outline-none text-cyber-text placeholder-cyber-muted/60"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-cyber-text mb-1.5">Email Address</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cyber-surface border border-border rounded-xl focus:ring-2 focus:ring-cyber-primary/50 focus:border-cyber-primary transition-all outline-none text-cyber-text placeholder-cyber-muted/60"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-cyber-text">Password</label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-sm font-medium text-cyber-primary hover:text-cyber-primary-hover transition-colors">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-cyber-surface border border-border rounded-xl focus:ring-2 focus:ring-cyber-primary/50 focus:border-cyber-primary transition-all outline-none text-cyber-text placeholder-cyber-muted/60"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-cyber-primary hover:bg-cyber-primary-hover text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-cyber-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleAuthMode}
              className="font-semibold text-cyber-primary hover:text-cyber-primary-hover transition-colors ml-1"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;