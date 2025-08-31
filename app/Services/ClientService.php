<?php

namespace App\Services;

use App\Models\Client;

class ClientService
{
    // List all clients (paginated)
    public function list(int $perPage = 10)
    {
        return Client::orderBy('name')->paginate($perPage);
    }

    // Create a new client
    public function create(array $data): Client
    {
        $data['fiscal_data_completed'] = $data['requires_invoice'] 
            ? $this->checkFiscalData($data) 
            : false;

        return Client::create($data);
    }

    // Update an existing client
    public function update(Client $client, array $data): Client
    {
        $data['fiscal_data_completed'] = $data['requires_invoice'] 
            ? $this->checkFiscalData($data) 
            : false;

        $client->update($data);
        return $client;
    }

    // Delete a client
    public function delete(Client $client): bool
    {
        return $client->delete();
    }

    // Check if fiscal data is completed
    private function checkFiscalData(array $data): bool
    {
        return isset($data['rfc'], $data['business_name'], $data['fiscal_regime'], $data['cfdi_usage'], $data['postal_code']);
    }
}
