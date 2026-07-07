"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from '@/lib/react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Building2, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import api from '../config/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex w-full bg-slate-950 font-sans overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Left Panel - Branding/Hero (Hidden on mobile) */}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center p-12">
        <div className="absolute inset-4 rounded-[2.5rem] overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-indigo-900/90 via-slate-900/90 to-violet-900/90 z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center z-0 scale-105 transform transition-transform duration-[20s] hover:scale-100" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
          />
          
          <div className="relative z-20 text-white h-full flex flex-col justify-between p-12 lg:p-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white/90">SocietySync</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-indigo-200 mb-6">
                <Zap className="w-4 h-4 text-indigo-400" /> <span className="text-white">Now Live</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white via-indigo-100 to-slate-400">
                Elevate your community living.
              </h1>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed font-light">
                Experience the next generation of residential management. Seamlessly connect, automate operations, and secure your society with state-of-the-art intelligent tools.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: 'Smart Billing', desc: 'Automated invoice generation' },
                  { title: 'Access Control', desc: 'Advanced visitor tracking' },
                  { title: 'Helpdesk', desc: 'Instant ticket resolution' },
                  { title: 'Community', desc: 'Vibrant resident network' }
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="flex flex-col gap-1 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors cursor-default"
                  >
                    <ShieldCheck className="w-6 h-6 text-indigo-400 mb-2" />
                    <span className="font-semibold text-white/90">{feature.title}</span>
                    <span className="text-sm text-slate-400">{feature.desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[440px] relative"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 backdrop-blur-xl mx-auto shadow-[0_0_20px_rgba(79,70,229,0.15)]">
            <Building2 className="w-7 h-7 text-indigo-400" />
          </div>

          <div className="mb-10 text-center lg:text-left">
            <motion.h2 
              key={isLogin ? 'login-title' : 'signup-title'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white tracking-tight mb-3"
            >
              {isLogin ? 'Welcome back' : 'Create account'}
            </motion.h2>
            <p className="text-slate-400 text-base font-light">
              {isLogin 
                ? 'Enter your credentials to access the portal.' 
                : 'Join us today. Enter your details to register.'}
            </p>
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl text-red-400 text-sm font-medium flex items-center gap-3 shadow-lg"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="mb-6 p-4 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm font-medium flex items-center gap-3 shadow-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-6" onSubmit={isLogin ? loginSubmit : signupSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-white placeholder-slate-500 shadow-inner"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Email Address</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-white placeholder-slate-500 shadow-inner"
                placeholder="name@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
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
                  className="w-full px-5 py-4 pr-12 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none text-white placeholder-slate-500 shadow-inner"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-lg">{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center text-sm text-slate-400">
            {isLogin ? "New to the platform? " : "Already have an account? "}
            <button 
              onClick={toggleAuthMode}
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ml-1"
            >
              {isLogin ? 'Sign up for free' : 'Sign in to portal'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;