import AppLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateEditUserModal } from './modal/createedit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: route('admin.users.index'),
    },
];

interface Users {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
    phone?: string;
    gender?: string;
    verified: boolean;
    roles: 'player' | 'umpire' | 'admin';
    address?: {
        name: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
}

interface Props {
    users: PaginatedData<Users>;
    queryParams: {
        search?: string;
        verified?: boolean;
        roles?: string;
    } | null;
}

export default function Index({ users, queryParams }: Props) {
    const params = queryParams || {};
    const startingNumber = (users.meta.current_page - 1) * users.meta.per_page;

    const handleParamChange = (newParams: Partial<typeof params>) => {
        // Remove page parameter and merge new params with existing ones
        const { page, ...currentParams } = params;

        router.get(
            route('admin.users.index'),
            {
                ...currentParams,
                ...newParams
            },
            {
                preserveState: true,
                preserveScroll: true
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Users" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            defaultValue={params.search}
                            onChange={(e) => {
                                handleParamChange({
                                    search: e.target.value || undefined
                                });
                            }}
                            className="pl-8 border-primary/20 focus-visible:border-primary/30"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Select
                            defaultValue={params.roles || 'all'}
                            onValueChange={(value) => {
                                handleParamChange({
                                    roles: value === 'all' ? undefined : value
                                });
                            }}
                        >
                            <SelectTrigger className="w-[180px] border-primary/20">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="player">Player</SelectItem>
                                <SelectItem value="umpire">Umpire</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            defaultValue={params.verified === undefined ? 'all' : String(params.verified)}
                            onValueChange={(value) => {
                                handleParamChange({
                                    verified: value === 'all' ? undefined : value === 'true'
                                });
                            }}
                        >
                            <SelectTrigger className="w-[180px] border-primary/20">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="true">Verified</SelectItem>
                                <SelectItem value="false">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                        <CreateEditUserModal />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden rounded-xl px-3.5">
                    <div className="rounded-md border border-primary/20">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-primary/5 hover:bg-primary/5">
                                    <TableHead className="w-[60px] font-semibold">No</TableHead>
                                    <TableHead className="font-semibold">User Info</TableHead>
                                    <TableHead className="font-semibold">Role</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Created At</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.map((user, index) => (
                                    <TableRow
                                        key={user.id}
                                        className="hover:bg-primary/5 border-primary/10"
                                    >
                                        <TableCell className="font-medium">{startingNumber + index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border-2 border-primary">
                                                    <AvatarImage
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            <span>{user.email}</span>
                                                        </div>
                                                        {user.phone && (
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                <span>{user.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {user.roles}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.verified ? "default" : "destructive"}>
                                                {user.verified ? 'Verified' : 'Unverified'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(user.created_at), 'MMM dd, yyyy')}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <CreateEditUserModal user={user} />
                                                {!user.verified && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        className="border-destructive/20 hover:bg-destructive/5 hover:text-destructive"
                                                    >
                                                        <Link
                                                            href={route('admin.users.verify', user.id)}
                                                            method="post"
                                                            as="button"
                                                            preserveScroll
                                                        >
                                                            Verify
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination meta={users.meta} className="mt-6" />
                </div>
            </div>
        </AppLayout>
    );
}
