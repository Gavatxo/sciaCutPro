<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Client;
use App\Models\Company;
use App\Models\Prestation;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $company = Company::create([
            'name' => 'SciaCut Pro SARL',
            'email' => 'contact@sciacut-pro.fr',
            'phone' => '01 42 55 66 77',
            'address' => "123 Avenue des Travaux\n75015 Paris",
            'siret' => '123 456 789 00012',
        ]);

        // Créer un utilisateur
        User::create([
            'company_id' => $company->id,
            'name' => 'Jean Dupont',
            'email' => 'jean@sciacut-pro.fr',
            'password' => bcrypt('password'),
        ]);

        // Créer quelques clients
        Client::create([
            'company_id' => $company->id,
            'name' => 'Bouygues Construction',
            'address' => '3 Avenue du Centre, 78280 Guyancourt',
            'phone' => '01 30 60 33 00',
            'email' => 'contact@bouygues-construction.com',
            'contact_person' => 'Pierre Martin',
        ]);

        // Créer des prestations type
        $prestations = [
            ['name' => 'Sciage au sol', 'unit' => 'ml', 'default_price' => 35.00],
            ['name' => 'Carrotage horizontal', 'unit' => 'trou', 'default_price' => 125.00],
            ['name' => 'Carrotage vertical', 'unit' => 'trou', 'default_price' => 95.00],
            ['name' => 'Découpe de mur', 'unit' => 'm2', 'default_price' => 180.00],
            ['name' => 'Évacuation gravats', 'unit' => 'T', 'default_price' => 85.00],
        ];

        foreach ($prestations as $prestation) {
            Prestation::create(array_merge($prestation, ['company_id' => $company->id]));
        }
    }
}
