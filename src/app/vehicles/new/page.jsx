"use client";
import Component from '@/views/vehicles/VehicleFormPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from '@/guards/ProtectedRoute';
export default function Page() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <Component />
            </DashboardLayout>
        </ProtectedRoute>
    );
}