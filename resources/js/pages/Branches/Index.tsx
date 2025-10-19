import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Head } from '@inertiajs/react';
import { Switch } from '@/components/ui/switch';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from '@/components/ui/alert-dialog';

interface Branch {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    city?: string;
    state?: string;
    postal_code?: string;
    active?: boolean;
}

interface BranchesPageProps {
    branches: {
        data: Branch[];
        prev_page_url?: string | null;
        next_page_url?: string | null;
    };
}



export default function BranchesIndex() {
    const [branchToDelete, setBranchToDelete] = React.useState<Branch | null>(null);
    const [openDialog, setOpenDialog] = React.useState(false);

    const { branches } = usePage<BranchesPageProps>().props;

    const openDeleteDialog = (branch: Branch) => {
        setBranchToDelete(branch);
        setOpenDialog(true);
    };

    const handleDelete = () => {
        if (branchToDelete) {
            Inertia.delete(`/branches/${branchToDelete.id}`);
            setOpenDialog(false);
            setBranchToDelete(null);
        }
    };

    const toggleActive = (branch: Branch) => {
        Inertia.put(`/branches/${branch.id}/toggle-active`);
    };


    return (
        <>
            <Head title="Branches" />
            <AppLayout breadcrumbs={[{ title: 'Branches', href: '/branches' }]}>
                <div className="flex-1 p-4 md:p-6">
                    <Card className="max-w-5xl mx-auto">
                        <CardHeader>
                            <CardTitle>Branches</CardTitle>
                        </CardHeader>

                        <Separator />

                        <CardContent className="pt-5">
                            <div className="flex justify-end mb-4">
                                <Link href="/branches/create">
                                    <Button>Create Branch</Button>
                                </Link>
                            </div>

                            <table className="w-full table-auto border border-border">
                                <thead>
                                <tr className="bg-muted text-left">
                                    <th className="p-2 border-b">Name</th>
                                    <th className="p-2 border-b">Phone</th>
                                    <th className="p-2 border-b">Email</th>
                                    <th className="p-2 border-b">Address</th>
                                    <th className="p-2 border-b">City</th>
                                    <th className="p-2 border-b">Postal Code</th>
                                    <th className="p-2 border-b">Active</th>
                                    <th className="p-2 border-b">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {branches.data.map((branch) => (
                                    <tr key={branch.id}>
                                        <td className="p-2 border-b">{branch.name}</td>
                                        <td className="p-2 border-b">{branch.phone}</td>
                                        <td className="p-2 border-b">{branch.email}</td>
                                        <td className="p-2 border-b">{branch.address}</td>
                                        <td className="p-2 border-b">{branch.city || '-'}</td>
                                        <td className="p-2 border-b">{branch.postal_code || '-'}</td>
                                        <td className="p-2 border-b">
                                            <Switch
                                                checked={branch.active}
                                                onCheckedChange={() => toggleActive(branch)}
                                            />
                                        </td>
                                        <td className="p-2 border-b flex gap-2">
                                            <Link href={`/branches/${branch.id}/edit`}>
                                                <Button size="sm">Edit</Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => openDeleteDialog(branch)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {/* Paginación */}
                            <div className="mt-4 flex justify-end gap-2">
                                {branches.prev_page_url && (
                                    <Button onClick={() => Inertia.get(branches.prev_page_url)}>Prev</Button>
                                )}
                                {branches.next_page_url && (
                                    <Button onClick={() => Inertia.get(branches.next_page_url)}>Next</Button>
                                )}
                            </div>

                            {/* ALERT DIALOG */}
                            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Branch</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete <strong>{branchToDelete?.name}</strong>? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex justify-end gap-2">
                                        <Button variant="secondary" onClick={() => setOpenDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDelete}>
                                            Delete
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        </>
    );
}
