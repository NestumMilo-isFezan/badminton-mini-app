import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, Calendar, Medal, Trophy, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Stats Overview */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center gap-4 rounded-xl border p-4">
                        <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                            <Trophy className="size-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Matches</p>
                            <p className="text-xl font-semibold">24</p>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center gap-4 rounded-xl border p-4">
                        <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                            <Medal className="size-6 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Win Rate</p>
                            <p className="text-xl font-semibold">68%</p>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center gap-4 rounded-xl border p-4">
                        <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                            <Activity className="size-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Current Rank</p>
                            <p className="text-xl font-semibold">A+</p>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex items-center gap-4 rounded-xl border p-4">
                        <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                            <Users className="size-6 text-orange-600 dark:text-orange-300" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">Club Members</p>
                            <p className="text-xl font-semibold">42</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Upcoming Matches */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border col-span-2 rounded-xl border p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Upcoming Matches</h2>
                            <Calendar className="size-5 text-neutral-500" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg bg-neutral-50/50 p-3 dark:bg-neutral-800/50">
                                <div>
                                    <p className="font-medium">Singles Match</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">vs John Smith</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">Tomorrow</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">14:00</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-neutral-50/50 p-3 dark:bg-neutral-800/50">
                                <div>
                                    <p className="font-medium">Doubles Tournament</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">City Championships</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">Next Week</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Sat, 09:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
                        <div className="space-y-4">
                            <div className="text-sm">
                                <p className="font-medium">Won match against Mike Johnson</p>
                                <p className="text-neutral-600 dark:text-neutral-400">21-19, 21-17</p>
                                <p className="mt-1 text-xs text-neutral-500">2 hours ago</p>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">Joined Weekend Tournament</p>
                                <p className="text-neutral-600 dark:text-neutral-400">Mixed Doubles Category</p>
                                <p className="mt-1 text-xs text-neutral-500">Yesterday</p>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">Updated Profile Stats</p>
                                <p className="text-neutral-600 dark:text-neutral-400">New ranking calculated</p>
                                <p className="mt-1 text-xs text-neutral-500">2 days ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Chart */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                    <h2 className="mb-4 text-lg font-semibold">Performance Overview</h2>
                    <div className="relative h-64">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        <p className="flex h-full items-center justify-center text-neutral-600 dark:text-neutral-400">
                            Performance chart will be displayed here
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
