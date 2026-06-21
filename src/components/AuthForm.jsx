"use client";
import React, { useState } from 'react';
import { useNavigate, Link } from '@/lib/react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-cyber-bg font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-bg via-cyber-surface to-cyber-bg" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyber-primary rounded-full blur-[150px] opacity-20" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyber-accent rounded-full blur-[150px] opacity-20" />

      {/* Auth Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 glass-panel rounded-xl shadow-neon border border-border"
      >
        <div className="mb-8 text-center">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-14 h-14 mx-auto bg-cyber-surface border border-border rounded-lg flex items-center justify-center shadow-lg mb-4"
          >
            <svg className="w-7 h-7 text-cyber-accent drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 12h3v8h14v-8h3L12 2zm0 2.83L17.17 10H6.83L12 4.83zM10 18v-4h4v4h-4z"/>
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-cyber-text tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-cyber-muted text-sm mt-2">
            {isLogin 
              ? 'Enter your credentials to access the portal' 
              : 'Join the next-generation society platform'}
          </p>
        </div>

        {/* Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3 bg-cyber-accent/10 border border-cyber-accent/30 rounded-lg text-cyber-accent text-sm font-medium"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-4" onSubmit={isLogin ? loginSubmit : signupSubmit}>
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-medium text-cyber-muted mb-1.5 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cyber-surface/50 border border-border rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent transition-all outline-none text-cyber-text placeholder-cyber-muted/50"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-cyber-muted uppercase tracking-wider">Password</label>
              {isLogin && (
                <Link to="/forgot-password" className="text-xs font-medium text-cyber-accent hover:text-cyan-300 transition-colors">
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
                className="w-full px-4 py-3 pr-12 bg-cyber-surface/50 border border-border rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent transition-all outline-none text-cyber-text placeholder-cyber-muted/50"
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
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-cyber-primary hover:bg-cyber-primary-hover text-white font-medium py-3.5 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isLogin ? 'Initialize Session' : 'Register Access'
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-cyber-muted">
          {isLogin ? "No access credentials? " : "Already initialized? "}
          <button 
            onClick={toggleAuthMode}
            className="font-medium text-cyber-accent hover:text-cyan-300 transition-colors ml-1"
          >
            {isLogin ? 'Request access' : 'Initialize session'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;