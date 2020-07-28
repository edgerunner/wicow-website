import Head from 'next/head';
import BenefitCalculator from '../components/BenefitCalculator';

export default function Home() {
  return (
    <>
      <Head>
        <title>Wicow</title>
      </Head>

      <header>
        <img src="/wicow.svg" alt="Wicow" className="logo" />
      </header>

      <main>
        <section>
          <h1>Know your cows</h1>
          <h2>Wicow lets you do that right here</h2>
          
          <p>
            Wicow is a system for making sure that you
            can always keep tabs on your cows, even while
            you are away from the farm.
          </p>
          <p>
            You do not even have to check anything. Wicow
            will let you know if Bessie will be <em>calving </em> 
            today, or if Agnes has a slight <em>fever</em>.
          </p>
          <p>
            All you have to do is take five minutes to
            install the TSens™ sensor when the time is
            right (which Wicow will also tell you), and
            then you can rest assured that you will know
            when something happens.
          </p>
        </section>
        <section>
          <h1>Sit back and relax</h1>
          <h2>Take time for your farm and yourself</h2>
          <p>
            There is a key feature in Wicow that sets it apart from anything else: We do not expect you to keep checking our app. We will tell you when you need to act on something.
          </p>
          <p>
            More than that, whenever we can, we train and use our artificial intelligence to predict the future, and tell you what will happen in advance, before it happens.
          </p>
          <p>
            The benefit for you is that you can just stop thinking about things like calving, insemination and fever. The time you spend on just checking on those could be yours to work, play or rest as you see fit.
          </p>
          <form>
            <BenefitCalculator/>
          </form>
        </section>
      </main>

      <footer>
        
      </footer>

      <style global jsx>{`
        :root {
          --dark: #333;
          --darkish: #666;
          --light: #fefefe;
          --wicow-blue: #3FD1FF;
        }
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: "Lato", sans-serif;
          background-color: var(--dark);
          color: var(--light);
        }

        body { padding: 1rem; }

        a {
          color: var(--wicow-blue);
        }

        * {
          box-sizing: border-box;
        }

        h1 { 
          font-weight: 500;
          font-size: 5rem;
          line-height: 4rem;
          margin: 2rem 0;
          letter-spacing: -0.1ch; 
        }

        h2 {
          font-weight: 300;
          line-height: 2rem;
          font-size: 2rem;
          margin: 2rem 0;
        }

        p, ul, ol {
          font-weight: 500;
          line-height: 2rem;
          font-size: 1.25rem;
          margin: 2rem 0;
        }

        p + ul, p + ol {
          margin-top: -2rem;
        }

        ul.ellipsis { list-style: none }
        ul.ellipsis > li:before { content: "…"; } 

        em { 
          all: unset;
          color: var(--wicow-blue);
        }

        section + section {
            margin-top: 8rem;
        }
      `}</style>
    </>
  )
}
