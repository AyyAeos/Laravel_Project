import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { stat } from 'fs';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    stats?: {
        totalLists: number;
        totalTasks: number;
        completed: number;
        pendingTasks: number;
    };
}


export default function Dashboard({
    stats = {
        totalLists: 0,
        totalTasks: 0,
        completed: 0,
        pendingTasks: 0,
    },
}: Props) {
    useEffect(() => {
        if (stats) {
            console.log('Stats updated:', stats);
            // Add more logic here if needed
        }
    }, [stats]);

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Lists</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.totalLists}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{stats.totalTasks}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Completed Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}