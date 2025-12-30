<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Roles (if not exists)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Create or Update Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@travelfactory.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('admin123'),
                'phone' => '01700000000',
                'email_verified_at' => now(),
            ]
        );
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        // Create or Update Test User
        $user = User::updateOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('user123'),
                'phone' => '01800000000',
                'email_verified_at' => now(),
            ]
        );
        if (!$user->hasRole('user')) {
            $user->assignRole('user');
        }
    }
}
