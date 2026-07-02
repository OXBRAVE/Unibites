import Link from 'next/link';

export default function Home() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }} className="animate-fade-in">
        Welcome to UniBites
      </h1>
      <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "3rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 3rem auto" }}>
        The centralized hub for all your university cravings. Order from Manna, Onisasun, Dome, and Rehoboth in one sleek platform.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }} className="animate-fade-in">
        <Link href="/login?callbackUrl=/restaurants" className="btn btn-primary">
          Browse Restaurants
        </Link>
        <Link href="/login" className="btn btn-secondary glass">
          Sign In
        </Link>
      </div>
    </div>
  );
}
