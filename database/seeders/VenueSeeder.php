<?php

namespace Database\Seeders;

use App\Models\Venue;
use App\Models\Court;
use App\Models\Address;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $venues = [
            [
                'name' => 'Axiata Arena',
                'contact' => '+60 3-8996 5111',
                'courts' => [
                    'Court 1 - Center Court',
                    'Court 2 - Practice Court',
                    'Court 3 - Training Court',
                    'Court 4 - Training Court',
                ],
                'address' => [
                    'address_1' => 'Bukit Jalil National Sports Complex',
                    'address_2' => 'Jalan Barat',
                    'city' => 'Kuala Lumpur',
                    'state' => 'Federal Territory of Kuala Lumpur',
                    'zip' => '57000',
                    'country' => 'Malaysia',
                ]
            ],
            [
                'name' => 'Singapore Indoor Stadium',
                'contact' => '+65 6348 5555',
                'courts' => [
                    'Main Court',
                    'Practice Court A',
                    'Practice Court B',
                ],
                'address' => [
                    'address_1' => '2 Stadium Walk',
                    'address_2' => '#02-102',
                    'city' => 'Singapore',
                    'state' => 'Singapore',
                    'zip' => '397691',
                    'country' => 'Singapore',
                ]
            ],
            [
                'name' => 'Royal Arena',
                'contact' => '+45 70 300 400',
                'courts' => [
                    'Center Court',
                    'Court 2',
                    'Training Court 1',
                    'Training Court 2',
                ],
                'address' => [
                    'address_1' => 'Hannemanns Allé 18-20',
                    'address_2' => '',
                    'city' => 'Copenhagen',
                    'state' => 'Capital Region',
                    'zip' => '2300',
                    'country' => 'Denmark',
                ]
            ]
        ];

        foreach ($venues as $venueData) {
            // Create address
            $address = Address::create([
                'address_1' => $venueData['address']['address_1'],
                'address_2' => $venueData['address']['address_2'],
                'city' => $venueData['address']['city'],
                'state' => $venueData['address']['state'],
                'zip' => $venueData['address']['zip'],
                'country' => $venueData['address']['country'],
            ]);

            // Create venue
            $venue = Venue::create([
                'name' => $venueData['name'],
                'contact' => $venueData['contact'],
                'image' => null, // You can add default images if needed
                'address_id' => $address->id,
            ]);

            // Create courts for the venue
            foreach ($venueData['courts'] as $courtName) {
                Court::create([
                    'name' => $courtName,
                    'venue_id' => $venue->id,
                ]);
            }
        }
    }
}
