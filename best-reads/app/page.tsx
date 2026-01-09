import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-brown">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-wider">
              Discover Brabant
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12">
              Your complete guide to Tilburg and Eindhoven — two vibrant Dutch
              cities where innovation meets tradition
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tilburg"
                className="px-8 py-4 bg-white text-brown rounded-xl font-semibold hover:scale-105 transition-transform shadow-xl"
              >
                Explore Tilburg
              </Link>
              <Link
                href="/eindhoven"
                className="px-8 py-4 bg-coral text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-xl"
              >
                Explore Eindhoven
              </Link>
            </div>
          </div>
        </section>

        {/* Cities Overview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              Two Cities, Endless Adventures
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Tilburg Card */}
              <Link href="/tilburg" className="group">
                <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <h3 className="text-3xl font-bold mb-4 text-sky">Tilburg</h3>
                  <p className="text-foreground/80 mb-6">
                    The creative heart of Noord-Brabant. Experience contemporary
                    art, surrealist installations, and the largest funfair in
                    the Benelux.
                  </p>
                  <ul className="space-y-2 text-foreground/70 list-disc list-inside">
                    <li>Doloris&apos; Meta Maze</li>
                    <li>De Pont Museum</li>
                    <li>Tilburgse Kermis (July)</li>
                    <li>Award-winning LocHal Library</li>
                  </ul>
                  <div className="mt-6 text-sky font-semibold group-hover:underline">
                    Discover Tilburg →
                  </div>
                </div>
              </Link>

              {/* Eindhoven Card */}
              <Link href="/eindhoven" className="group">
                <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <h3 className="text-3xl font-bold mb-4 text-peach">
                    Eindhoven
                  </h3>
                  <p className="text-foreground/80 mb-6">
                    The design capital of the Netherlands. Explore innovation at
                    Philips Museum, Dutch Design Week, and the longest pub
                    street in the Benelux.
                  </p>
                  <ul className="space-y-2 text-foreground/70 list-disc list-inside">
                    <li>Philips Museum</li>
                    <li>Van Abbemuseum</li>
                    <li>Strijp-S Design District</li>
                    <li>Stratumseind (50+ bars!)</li>
                  </ul>
                  <div className="mt-6 text-peach font-semibold group-hover:underline">
                    Discover Eindhoven →
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Use This Guide?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🛜</div>
                <h3 className="font-bold mb-2">Works Offline</h3>
                <p className="text-sm text-foreground/70">
                  Access all content without internet connection
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-bold mb-2">Install as App</h3>
                <p className="text-sm text-foreground/70">
                  Add to your home screen for easy access
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold mb-2">Lightning Fast</h3>
                <p className="text-sm text-foreground/70">
                  Instant loading with PWA technology
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brown text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg mb-2">City Guide - Tilburg & Eindhoven</p>
          <p className="text-white/70">
            Built with Next.js 16 & Tailwind CSS v4 as a Progressive Web App
          </p>
        </div>
      </footer>
    </>
  );
}