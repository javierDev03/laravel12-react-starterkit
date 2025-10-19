<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;

class BranchesTableSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Sucursal Centro',
                'address' => 'Av. Principal #123, Ciudad',
                'email' => 'prueba1@gmail.com',
                'phone' => '555-123-4567',
                'city' => 'Tuxtla',
                'state' => 'Chiapas',
                'postal_code' => '1234',
            ],
            [
                'name' => 'Sucursal Norte',
                'address' => 'Calle Norte #456, Ciudad',
                'email' => 'prueba2@gmail.com',
                'phone' => '555-987-6543',
                'city' => 'Tuxtla',
                'state' => 'Chiapas',
                'postal_code' => '1234',
            ],
            [
                'name' => 'Sucursal Sur',
                'address' => 'Calle Sur #789, Ciudad',
                'email' => 'prueba3@gmail.com',
                'phone' => '555-246-8102',
                'city' => 'Tuxtla',
                'state' => 'Chiapas',
                'postal_code' => '1234',
            ],
        ];

        foreach ($branches as $branch) {
            Branch::firstOrCreate(['name' => $branch['name']], $branch);
        }
    }
}
