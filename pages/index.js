import Head from 'next/head';
import BenefitCalculator from '../components/BenefitCalculator';
import Section from '../components/Section';

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
        <Section 
          title="Know your cows"
          subtitle="Wicow lets you do that right here"
          >
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
        </Section>
        <Section
          title="Sit back and relax"
          subtitle="Take time for your farm and yourself">
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
        </Section>
      </main>

      <footer>
        
      </footer>
    </>
  )
}
