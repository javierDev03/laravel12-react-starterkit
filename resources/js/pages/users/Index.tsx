import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
dayjs.locale('id');

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'User Management', href: '/users' },
];

interface Branch {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: { id: number; name: string }[];
    branch?: Branch | null;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    branches: Branch[];
    filters: { branch_id?: string };
}

export default function UserIndex({ users, branches, filters }: Props) {
    const { delete: destroy, processing } = useForm();
    const [selectedBranch, setSelectedBranch] = useState(filters.branch_id || '');

    const handleDelete = (id: number) => {
        destroy(`/users/${id}`, { preserveScroll: true });
    };

    const handleResetPassword = (id: number) => {
        router.put(`/users/${id}/reset-password`, {}, { preserveScroll: true });
    };

    const handleFilterChange = (value: string) => {
        setSelectedBranch(value);
        router.get('/users', { branch_id: value }, { preserveState: true, replace: true });
    };

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">Manage user data and their roles within the system.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={selectedBranch} onValueChange={handleFilterChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Placeholder opcional */}
                                <SelectItem value="__all__">All Branches</SelectItem>

                                {(branches || []).map((branch) => (
                                    <SelectItem
                                        key={branch.id}
                                        value={branch.id !== null && branch.id !== undefined ? String(branch.id) : '__invalid__'}
                                    >
                                        {branch.name || 'Unnamed Branch'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Link href="/users/create">
                            <Button className="w-full md:w-auto" size="sm">+ Add User</Button>
                        </Link>
                    </div>
                </div>

                <div className="space-y-2 divide-y rounded-md border bg-background">
                    {users.data.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">No user data available.</div>
                    ) : (
                        users.data.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-5 hover:bg-muted/50 transition"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold text-primary">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-base font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                        <div className="text-xs text-muted-foreground italic">
                                            Registered {dayjs(user.created_at).fromNow()}
                                        </div>
                                        {user.branch && (
                                            <div className="text-xs text-muted-foreground italic">
                                                Branch: {user.branch.name}
                                            </div>
                                        )}
                                        {user.roles.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {user.roles.map((role) => (
                                                    <Badge key={role.id} variant="secondary" className="text-xs font-normal">
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 md:justify-end">
                                    <Link href={`/users/${user.id}/edit`}>
                                        <Button size="sm" variant="outline">Edit</Button>
                                    </Link>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="secondary">Reset</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Reset Password?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Password for <strong>{user.name}</strong> will be reset to:
                                                    <br />
                                                    <code className="bg-muted rounded px-2 py-1 text-sm">ResetPasswordNya</code>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleResetPassword(user.id)} disabled={processing}>
                                                    Yes, Reset
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="destructive">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    User <strong>{user.name}</strong> will be permanently deleted.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(user.id)} disabled={processing}>
                                                    Yes, Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
