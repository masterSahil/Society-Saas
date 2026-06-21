const fs = require('fs');
const path = require('path');

const routes = [
    { path: '/', component: 'components/AuthForm', layout: 'Guest' },
    { path: '/forgot-password', component: 'views/auth/ForgotPassword', layout: 'Guest' },
    { path: '/dashboard', component: 'views/DashboardPage', layout: 'Dashboard' },
    { path: '/profile', component: 'views/profile/Profile', layout: 'Dashboard' },
    { path: '/unauthorized', component: 'views/Unauthorized', layout: 'Dashboard' },
    { path: '/residents', component: 'views/residents/ResidentList', layout: 'Dashboard' },
    { path: '/residents/new', component: 'views/residents/ResidentFormPage', layout: 'Dashboard' },
    { path: '/residents/edit/[id]', component: 'views/residents/ResidentFormPage', layout: 'Dashboard' },
    { path: '/flats', component: 'views/flats/FlatList', layout: 'Dashboard' },
    { path: '/flats/new', component: 'views/flats/FlatFormPage', layout: 'Dashboard' },
    { path: '/flats/edit/[id]', component: 'views/flats/FlatFormPage', layout: 'Dashboard' },
    { path: '/complaints', component: 'views/complaints/ComplaintList', layout: 'Dashboard' },
    { path: '/complaints/new', component: 'views/complaints/ComplaintFormPage', layout: 'Dashboard' },
    { path: '/complaints/edit/[id]', component: 'views/complaints/ComplaintFormPage', layout: 'Dashboard' },
    { path: '/work-orders', component: 'views/complaints/ComplaintList', layout: 'Dashboard' },
    { path: '/visitors', component: 'views/visitors/VisitorList', layout: 'Dashboard' },
    { path: '/visitors/new', component: 'views/visitors/VisitorFormPage', layout: 'Dashboard' },
    { path: '/visitors/edit/[id]', component: 'views/visitors/VisitorFormPage', layout: 'Dashboard' },
    { path: '/family', component: 'views/family/FamilyList', layout: 'Dashboard' },
    { path: '/family/new', component: 'views/family/FamilyFormPage', layout: 'Dashboard' },
    { path: '/family/edit/[id]', component: 'views/family/FamilyFormPage', layout: 'Dashboard' },
    { path: '/vehicles', component: 'views/vehicles/VehicleList', layout: 'Dashboard' },
    { path: '/vehicles/new', component: 'views/vehicles/VehicleFormPage', layout: 'Dashboard' },
    { path: '/vehicles/edit/[id]', component: 'views/vehicles/VehicleFormPage', layout: 'Dashboard' },
    { path: '/bills', component: 'views/bills/BillList', layout: 'Dashboard' },
    { path: '/bills/new', component: 'views/bills/BillFormPage', layout: 'Dashboard' },
    { path: '/bills/edit/[id]', component: 'views/bills/BillFormPage', layout: 'Dashboard' },
    { path: '/facilities', component: 'views/facilities/FacilityList', layout: 'Dashboard' },
    { path: '/facilities/new', component: 'views/facilities/FacilityFormPage', layout: 'Dashboard' },
    { path: '/facilities/edit/[id]', component: 'views/facilities/FacilityFormPage', layout: 'Dashboard' },
    { path: '/bookings', component: 'views/bookings/BookingList', layout: 'Dashboard' },
    { path: '/bookings/new', component: 'views/bookings/BookingFormPage', layout: 'Dashboard' },
    { path: '/notices', component: 'views/notices/NoticeList', layout: 'Dashboard' },
    { path: '/notices/new', component: 'views/notices/NoticeFormPage', layout: 'Dashboard' },
    { path: '/notices/edit/[id]', component: 'views/notices/NoticeFormPage', layout: 'Dashboard' },
    { path: '/polls', component: 'views/polls/PollList', layout: 'Dashboard' },
    { path: '/polls/new', component: 'views/polls/PollFormPage', layout: 'Dashboard' },
    { path: '/notifications', component: 'views/notifications/NotificationList', layout: 'Dashboard' }
];

const appDir = path.join(__dirname, 'src', 'app');

routes.forEach(route => {
    const routeDir = path.join(appDir, route.path === '/' ? '' : route.path);
    fs.mkdirSync(routeDir, { recursive: true });

    let content = `"use client";
import Component from '@/${route.component}';\n`;

    if (route.layout === 'Dashboard') {
        content += `import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from '@/guards/ProtectedRoute';
export default function Page() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <Component />
            </DashboardLayout>
        </ProtectedRoute>
    );
}`;
    } else {
        content += `import GuestRoute from '@/guards/GuestRoute';
export default function Page() {
    return (
        <GuestRoute>
            <Component />
        </GuestRoute>
    );
}`;
    }

    fs.writeFileSync(path.join(routeDir, 'page.jsx'), content);
    console.log(`Created route ${route.path}`);
});
