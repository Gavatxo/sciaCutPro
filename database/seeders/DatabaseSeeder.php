<?php

// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use App\Models\User;
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
        // Créer une entreprise exemple
        $company = Company::create([
            'name' => 'BuildFlow Pro SARL',
            'email' => 'contact@buildflow-pro.fr',
            'phone' => '01 42 55 66 77',
            'address' => "123 Avenue des Artisans\n75015 Paris",
            'siret' => '123 456 789 00012',
        ]);

        // Créer un utilisateur
        User::create([
            'company_id' => $company->id,
            'name' => 'Jean Dupont',
            'email' => 'jean@buildflow-pro.fr',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Créer des clients particuliers
        $particuliers = [
            [
                'type' => 'particulier',
                'first_name' => 'Marie',
                'last_name' => 'Martin',
                'address' => '45 rue de la Paix',
                'postal_code' => '75002',
                'city' => 'Paris',
                'phone' => '01 23 45 67 89',
                'email' => 'marie.martin@email.fr',
                'payment_terms' => 15,
                'notes' => 'Rénovation salle de bain - cliente régulière',
            ],
            [
                'type' => 'particulier',
                'first_name' => 'Pierre',
                'last_name' => 'Durand',
                'address' => '12 avenue Victor Hugo',
                'postal_code' => '92100',
                'city' => 'Boulogne-Billancourt',
                'phone' => '01 34 56 78 90',
                'email' => 'p.durand@gmail.com',
                'payment_terms' => 15,
                'notes' => 'Travaux cuisine prévu été 2025',
            ],
            [
                'type' => 'particulier',
                'first_name' => 'Sophie',
                'last_name' => 'Leroy',
                'address' => '78 bis rue Gambetta',
                'postal_code' => '94200',
                'city' => 'Ivry-sur-Seine',
                'phone' => '01 45 67 89 01',
                'payment_terms' => 15,
                'notes' => 'Préfère les interventions en matinée',
            ],
        ];

        foreach ($particuliers as $particulier) {
            Client::create(array_merge($particulier, ['company_id' => $company->id]));
        }

        // Créer des clients professionnels
        $professionnels = [
            [
                'type' => 'professionnel',
                'company_name' => 'Mairie de Boulogne-Billancourt',
                'contact_person' => 'Michel Leblanc',
                'address' => '26 avenue André Morizet',
                'postal_code' => '92100',
                'city' => 'Boulogne-Billancourt',
                'phone' => '01 55 18 53 00',
                'email' => 'travaux@boulogne.fr',
                'siret' => '219 200 794 00014',
                'payment_terms' => 30,
                'notes' => 'Appels d\'offres publics - procédure spécifique',
            ],
            [
                'type' => 'professionnel',
                'company_name' => 'Bouygues Construction',
                'contact_person' => 'Laurent Moreau',
                'address' => '3 Avenue du Centre',
                'postal_code' => '78280',
                'city' => 'Guyancourt',
                'phone' => '01 30 60 33 00',
                'email' => 'laurent.moreau@bouygues-construction.com',
                'siret' => '572 015 246 00339',
                'tva_number' => 'FR 03 572015246',
                'payment_terms' => 45,
                'notes' => 'Gros volumes - négociation tarifaire possible',
            ],
            [
                'type' => 'professionnel',
                'company_name' => 'SCI Les Jardins de Sèvres',
                'contact_person' => 'Françoise Petit',
                'address' => '15 rue de Ville-d\'Avray',
                'postal_code' => '92310',
                'city' => 'Sèvres',
                'phone' => '01 46 23 45 67',
                'email' => 'gestion@sci-jardins-sevres.fr',
                'siret' => '789 123 456 00021',
                'payment_terms' => 30,
                'notes' => 'Copropriété 120 lots - travaux récurrents',
            ],
            [
                'type' => 'professionnel',
                'company_name' => 'Promoteur Immobilier Nexity',
                'contact_person' => 'Thomas Bernard',
                'address' => '19 rue de Vienne',
                'postal_code' => '75008',
                'city' => 'Paris',
                'phone' => '01 85 55 19 00',
                'email' => 'thomas.bernard@nexity.fr',
                'siret' => '394 355 062 00045',
                'tva_number' => 'FR 35 394355062',
                'payment_terms' => 60,
                'notes' => 'Projets neufs - planning strict à respecter',
            ],
            [
                'type' => 'professionnel',
                'company_name' => 'Copropriété Le Parc des Lilas',
                'contact_person' => 'Syndic Foncia',
                'address' => '89 avenue Jean Jaurès',
                'postal_code' => '93100',
                'city' => 'Montreuil',
                'phone' => '01 48 57 00 00',
                'email' => 'syndic.parclilas@foncia.fr',
                'payment_terms' => 30,
                'notes' => 'Votes AG requis pour travaux > 5000€',
            ],
        ];

        foreach ($professionnels as $professionnel) {
            Client::create(array_merge($professionnel, ['company_id' => $company->id]));
        }

        // Créer des prestations type pour le bâtiment (générique)
        $prestations = [
            // Maçonnerie
            ['name' => 'Maçonnerie générale', 'unit' => 'm2', 'default_price' => 45.00, 'description' => 'Travaux de maçonnerie générale'],
            ['name' => 'Cloison placo', 'unit' => 'm2', 'default_price' => 35.00, 'description' => 'Pose de cloisons placo avec isolation'],
            ['name' => 'Enduit façade', 'unit' => 'm2', 'default_price' => 25.00, 'description' => 'Enduit de façade traditionnel'],

            // Plomberie
            ['name' => 'Installation sanitaire', 'unit' => 'u', 'default_price' => 350.00, 'description' => 'Pose lavabo, WC ou douche'],
            ['name' => 'Tuyauterie cuivre', 'unit' => 'ml', 'default_price' => 15.00, 'description' => 'Pose tuyauterie cuivre diamètre standard'],
            ['name' => 'Dépannage plomberie', 'unit' => 'h', 'default_price' => 65.00, 'description' => 'Intervention dépannage urgence'],

            // Électricité
            ['name' => 'Point luminaire', 'unit' => 'u', 'default_price' => 85.00, 'description' => 'Création point d\'éclairage avec interrupteur'],
            ['name' => 'Prise électrique', 'unit' => 'u', 'default_price' => 45.00, 'description' => 'Pose prise électrique 16A'],
            ['name' => 'Tableau électrique', 'unit' => 'u', 'default_price' => 450.00, 'description' => 'Remplacement tableau aux normes'],

            // Couverture
            ['name' => 'Réfection toiture', 'unit' => 'm2', 'default_price' => 65.00, 'description' => 'Réfection complète tuiles mécaniques'],
            ['name' => 'Démoussage toiture', 'unit' => 'm2', 'default_price' => 8.00, 'description' => 'Nettoyage et traitement antimousse'],
            ['name' => 'Gouttière', 'unit' => 'ml', 'default_price' => 25.00, 'description' => 'Pose gouttière PVC avec descentes'],

            // Peinture
            ['name' => 'Peinture murs', 'unit' => 'm2', 'default_price' => 18.00, 'description' => 'Peinture acrylique 2 couches'],
            ['name' => 'Peinture plafond', 'unit' => 'm2', 'default_price' => 15.00, 'description' => 'Peinture plafond blanc mat'],
            ['name' => 'Lasure boiseries', 'unit' => 'm2', 'default_price' => 22.00, 'description' => 'Lasure protection bois extérieur'],

            // Carrelage
            ['name' => 'Pose carrelage sol', 'unit' => 'm2', 'default_price' => 35.00, 'description' => 'Pose carrelage grès cérame sur chape'],
            ['name' => 'Pose faïence murale', 'unit' => 'm2', 'default_price' => 40.00, 'description' => 'Pose faïence salle de bain'],
            ['name' => 'Joint carrelage', 'unit' => 'm2', 'default_price' => 8.00, 'description' => 'Rejointoiement carrelage'],

            // Menuiserie
            ['name' => 'Pose fenêtre PVC', 'unit' => 'u', 'default_price' => 280.00, 'description' => 'Pose fenêtre PVC double vitrage'],
            ['name' => 'Porte intérieure', 'unit' => 'u', 'default_price' => 180.00, 'description' => 'Pose porte postformée avec huisserie'],
            ['name' => 'Parquet flottant', 'unit' => 'm2', 'default_price' => 25.00, 'description' => 'Pose parquet stratifié avec sous-couche'],

            // Isolation
            ['name' => 'Isolation combles', 'unit' => 'm2', 'default_price' => 20.00, 'description' => 'Isolation laine de roche soufflée'],
            ['name' => 'Isolation murs', 'unit' => 'm2', 'default_price' => 35.00, 'description' => 'Isolation thermique par l\'intérieur'],

            // Sciage/Démolition
            ['name' => 'Sciage béton', 'unit' => 'ml', 'default_price' => 35.00, 'description' => 'Sciage béton armé épaisseur 20cm'],
            ['name' => 'Carrotage béton', 'unit' => 'u', 'default_price' => 125.00, 'description' => 'Carrotage diamètre 100mm'],
            ['name' => 'Démolition cloison', 'unit' => 'm2', 'default_price' => 15.00, 'description' => 'Démolition cloison placo avec évacuation'],

            // Divers
            ['name' => 'Évacuation gravats', 'unit' => 'T', 'default_price' => 85.00, 'description' => 'Évacuation gravats en décharge'],
            ['name' => 'Nettoyage chantier', 'unit' => 'h', 'default_price' => 35.00, 'description' => 'Nettoyage fin de chantier'],
            ['name' => 'Main d\'œuvre', 'unit' => 'h', 'default_price' => 55.00, 'description' => 'Main d\'œuvre qualifiée'],
        ];

        foreach ($prestations as $prestation) {
            Prestation::create(array_merge($prestation, ['company_id' => $company->id]));
        }
    }
}
