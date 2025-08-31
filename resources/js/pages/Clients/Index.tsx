import React from 'react';
import { Link, usePage, } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';


//
// Interfaces
//

interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  rfc?: string;
}

interface ClientsPageProps {
  clients: {
    data: Client[];
    prev_page_url?: string | null;
    next_page_url?: string | null;
  };
}


export default function ClientsIndex() {
  const [clientToDelete, setClientToDelete] = React.useState<Client | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);

  const { clients } = usePage<ClientsPageProps>().props;

  const openDeleteDialog = (client: Client) => {
    setClientToDelete(client);
    setOpenDialog(true);
  };

  const handleDelete = () => {
    if (clientToDelete) {
      Inertia.delete(`/clients/${clientToDelete.id}`);
      setOpenDialog(false);
      setClientToDelete(null);
    }
  };

  const breadcrumbs = [{ title: 'Clients', href: '/clients' }];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex-1 p-4 md:p-6">
        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5">
            <div className="flex justify-end mb-4">
              <Link href="/clients/create">
                <Button>Create Client</Button>
              </Link>
            </div>

            <table className="w-full table-auto border border-border">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="p-2 border-b">Name</th>
                  <th className="p-2 border-b">Email</th>
                  <th className="p-2 border-b">Phone</th>
                  <th className="p-2 border-b">RFC</th>
                  <th className="p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.data.map((client) => (
                  <tr key={client.id}>
                    <td className="p-2 border-b">{client.name}</td>
                    <td className="p-2 border-b">{client.email || '-'}</td>
                    <td className="p-2 border-b">{client.phone || '-'}</td>
                    <td className="p-2 border-b">{client.rfc || '-'}</td>
                    <td className="p-2 border-b flex gap-2">
                      <Link href={`/clients/${client.id}/edit`}>
                        <Button size="sm">Edit</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDeleteDialog(client)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación simple */}
            <div className="mt-4 flex justify-end gap-2">
              {clients.prev_page_url && (
                <Button onClick={() => Inertia.get(clients.prev_page_url)}>Prev</Button>
              )}
              {clients.next_page_url && (
                <Button onClick={() => Inertia.get(clients.next_page_url)}>Next</Button>
              )}
            </div>

            {/* ALERT DIALOG ÚNICO */}
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Client</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete{' '}
                    <strong>{clientToDelete?.name}</strong>? This action cannot be undone.
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
  );
}
