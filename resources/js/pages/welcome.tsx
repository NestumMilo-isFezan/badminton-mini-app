import { type SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { MatchSchedule } from '@/components/landing/match-schedule';
import { PlayerStats } from '@/components/landing/player-stats';
import { FeaturedVenues } from '@/components/landing/featured-venues';
import { Footer } from '@/components/landing/footer';
import PatternedShadow from '@/components/patterned-shadow';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-background text-foreground">
                <Header />
                <main>
                    <Hero />
                    <Features />
                    <FeaturedVenues />
                    <MatchSchedule />
                    <PlayerStats />
                </main>
                <Footer />
            </div>
        </>
    );
}
