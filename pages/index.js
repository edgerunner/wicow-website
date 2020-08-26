import Head from 'next/head';
import * as sections from '../sections';

export default function Home() {
  const KYC = sections.KnowYourCows.en;
  const SBaR = sections.SitBackAndRelax.en;

  return (
    <>
      <Head>
        <title>Wicow</title>
      </Head>

      

      <header>
        <img src="/wicow.svg" alt="Wicow" className="logo" />
      </header>

      <main>
        <KYC/>
        <SBaR/>
      </main>

      <footer>
        
      </footer>
    </>
  )
}
