<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
        ]);

        $user = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('admin123'),
        ]);

        $user->assignRole('admin');

        $categories = Category::factory(10)->create();


        Product::factory(50)->create([
            // 'category_id' => $categories->random()->id,
        ]);

        $this->call([
            MenuSeeder::class,
            BranchesTableSeeder::class,
        ]);
    }
}
