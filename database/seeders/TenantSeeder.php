<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Tenant;
use App\Models\Domain;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Your first tenant – event decorator
        $tenant = Tenant::firstOrCreate(
            ['slug' => 'harbour-decor'],
            [
                'name'          => 'Harbour Decor Rentals',
                'industry_type' => 'event_decor',
                'timezone'      => 'America/Toronto',
                'settings'      => [
                    'brand_color'  => '#C89A3D',
                    'accent_color' => '#1F2933',
                ],
            ]
        );

        // Local dev domain (we’ll use this later for multi-tenant routing)
        Domain::firstOrCreate(
            ['domain' => 'harbour.localhost'],
            ['tenant_id' => $tenant->id]
        );
    }
}
