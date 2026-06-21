import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { User, Lock, Save, Eye, EyeOff } from "lucide-react";
import api from "../../config/api";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Profile form
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
    });

    // Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await api.put("/auth/profile", profileData);
            updateUser(res.data.data.user);
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            setLoading(false);
            return;
        }

        try {
            await api.put("/auth/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setMessage({ type: "success", text: "Password changed successfully!" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password." });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "profile", label: "Edit Profile", icon: User },
        { id: "password", label: "Change Password", icon: Lock },
    ];

    return (
        <div className="p-4 font-sans max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-cyber-text">My Profile</h1>
                <p className="text-cyber-muted mt-1">Manage your account settings and preferences.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-cyber-card rounded-lg border border-border shadow-sm mb-6 p-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-cyber-primary flex items-center justify-center text-white text-2xl font-bold uppercase shadow-lg shadow-teal-600/20">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-cyber-text">{user?.name}</h2>
                        <p className="text-cyber-muted text-sm">{user?.email}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-cyber-accent/10 text-cyber-accent text-xs font-bold rounded-full capitalize border border-teal-100">
                            {user?.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Desktop Tab Headers */}
            <div className="hidden lg:grid grid-cols-2 gap-6 border-b border-border mb-6">
                <div className="flex justify-start">
                    <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-cyber-primary text-cyber-primary -mb-[2px]">
                        <User size={16} />
                        Edit Profile
                    </div>
                </div>
                <div className="flex justify-start">
                    <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-cyber-primary text-cyber-primary -mb-[2px]">
                        <Lock size={16} />
                        Change Password
                    </div>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`mb-6 p-3 rounded-lg text-sm font-medium border ${
                    message.type === "success"
                        ? "bg-cyber-primary/10 text-cyber-primary border-cyber-primary/20"
                        : "bg-red-50 text-red-700 border-red-200"
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Edit */}
                <div>
                    <div className="lg:hidden flex items-center gap-2 mb-4 pb-2 border-b-2 border-cyber-primary text-cyber-primary w-max">
                        <User size={16} />
                        <span className="text-sm font-medium">Edit Profile</span>
                    </div>
                    <div className="bg-cyber-card rounded-lg max-w-3xl border border-border shadow-sm p-6 h-full">
                        <form onSubmit={handleProfileUpdate} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-cyber-text mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none text-cyber-text shadow-sm transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cyber-text mb-1.5">Email</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full px-4 py-3 rounded-lg border border-border bg-cyber-text/5 text-cyber-muted shadow-sm cursor-not-allowed"
                            />
                            <p className="text-xs text-cyber-muted/70 mt-1">Email cannot be changed.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cyber-text mb-1.5">Phone Number</label>
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none text-cyber-text shadow-sm transition-colors"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-cyber-primary text-white px-6 py-2.5 rounded-lg hover:bg-cyber-primary-hover transition-colors font-medium shadow-sm disabled:opacity-50"
                        >
                            <Save size={16} />
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Password Change */}
            <div>
                    <div className="lg:hidden flex items-center gap-2 mt-6 mb-4 pb-2 border-b-2 border-cyber-primary text-cyber-primary w-max">
                        <Lock size={16} />
                        <span className="text-sm font-medium">Change Password</span>
                    </div>
                    <div className="bg-cyber-card max-w-3xl rounded-lg border border-border shadow-sm p-6 h-full">
                        <form onSubmit={handlePasswordChange} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-cyber-text mb-1.5">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-border focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none text-cyber-text shadow-sm transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-text transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cyber-text mb-1.5">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-border focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none text-cyber-text shadow-sm transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-text transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cyber-text mb-1.5">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 rounded-lg border border-border focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none text-cyber-text shadow-sm transition-colors"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-text transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-cyber-primary text-white px-6 py-2.5 rounded-lg hover:bg-cyber-primary-hover transition-colors font-medium shadow-sm disabled:opacity-50"
                        >
                            <Lock size={16} />
                            {loading ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Profile;
