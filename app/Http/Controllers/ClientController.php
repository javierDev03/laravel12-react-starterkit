<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Client;
use App\Services\ClientService;
use App\Http\Requests\ClientRequest;

class ClientController extends Controller
{
    protected ClientService $service;

    public function __construct(ClientService $service)
    {
        $this->service = $service;
    }

    // List clients
    public function index()
    {
        $clients = $this->service->list(10);
        return inertia('Clients/Index', [
            'clients' => $clients
        ]);
    }

    // Show create form
    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    // Store new client
    public function store(ClientRequest $request)
    {
        $this->service->create($request->validated());
        return redirect()->route('clients.index')->with('success', 'Cliente creado exitosamente.');
    }

    // Show edit form
    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', compact('client'));
    }

    // Update existing client
    public function update(ClientRequest $request, Client $client)
    {
        $this->service->update($client, $request->validated());
        return redirect()->route('clients.index')->with('success', 'Cliente actualizado exitosamente.');
    }

    // Delete client
    public function destroy(Client $client)
    {
        $this->service->delete($client);
        return redirect()->route('clients.index')->with('success', 'Cliente eliminado exitosamente.');
    }
}
