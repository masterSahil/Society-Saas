"use client";
import Component from '@/views/auth/ForgotPassword';
import GuestRoute from '@/guards/GuestRoute';
export default function Page() {
    return (
        <GuestRoute>
            <Component />
        </GuestRoute>
    );
}