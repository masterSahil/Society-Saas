"use client";
import Component from '@/components/AuthForm';
import GuestRoute from '@/guards/GuestRoute';
export default function Page() {
    return (
        <GuestRoute>
            <Component />
        </GuestRoute>
    );
}