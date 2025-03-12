export const mockGames: Game[] = [
    {
        id: 1,
        name: "Quarter Finals - Match 1",
        status: "in_progress",
        type: "single",
        venue: {
            id: 1,
            name: "Sports Arena Alpha",
            image: "/storage/venues/arena-alpha.jpg",
            address: {
                address: "123 Sports Street",
                city: "Singapore",
                state: "Central Region",
                zip: "123456",
                country: "Singapore"
            }
        },
        court: {
            id: 1,
            name: "Court A"
        },
        player_1: {
            id: 1,
            name: "Lee Chong Wei",
            avatar: "/storage/avatars/lee-chong-wei.jpg",
            win_rate: 85.5,
            matches: 42,
            wins: 36,
            losses: 6
        },
        player_2: {
            id: 2,
            name: "Lin Dan",
            avatar: "/storage/avatars/lin-dan.jpg",
            win_rate: 82.3,
            matches: 38,
            wins: 31,
            losses: 7
        },
        start_time: "2024-03-15T14:00:00Z",
        end_time: "2024-03-15T16:00:00Z",
        scores: [
            {
                set: 1,
                player_1_score: 21,
                player_2_score: 19
            },
            {
                set: 2,
                player_1_score: 18,
                player_2_score: 21
            }
        ],
        winner: {
            id: null,
            name: null,
            avatar: null
        },
        umpire: {
            id: 3,
            name: "John Smith",
            avatar: "/storage/avatars/john-smith.jpg"
        }
    },
    {
        id: 2,
        name: "Semi Finals - Match 2",
        status: "completed",
        type: "single",
        venue: {
            id: 2,
            name: "Elite Badminton Center",
            image: "/storage/venues/elite-center.jpg",
            address: {
                address: "456 Elite Avenue",
                city: "Singapore",
                state: "East Region",
                zip: "654321",
                country: "Singapore"
            }
        },
        court: {
            id: 4,
            name: "Court B"
        },
        player_1: {
            id: 4,
            name: "Viktor Axelsen",
            avatar: "/storage/avatars/viktor-axelsen.jpg",
            win_rate: 88.2,
            matches: 35,
            wins: 31,
            losses: 4
        },
        player_2: {
            id: 5,
            name: "Kento Momota",
            avatar: "/storage/avatars/kento-momota.jpg",
            win_rate: 79.4,
            matches: 34,
            wins: 27,
            losses: 7
        },
        start_time: "2024-03-14T10:00:00Z",
        end_time: "2024-03-14T12:00:00Z",
        scores: [
            {
                set: 1,
                player_1_score: 21,
                player_2_score: 18
            },
            {
                set: 2,
                player_1_score: 21,
                player_2_score: 15
            }
        ],
        winner: {
            id: 4,
            name: "Viktor Axelsen",
            avatar: "/storage/avatars/viktor-axelsen.jpg"
        },
        umpire: {
            id: 6,
            name: "Sarah Johnson",
            avatar: "/storage/avatars/sarah-johnson.jpg"
        }
    }
];