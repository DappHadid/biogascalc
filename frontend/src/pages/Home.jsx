import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Feature from '../components/sections/Feature';
// import AboutReactor from '../components/sections/AboutReactor';
import HowItWorks from '../components/sections/HowItWorks';
import Faq from '../components/sections/Faq';
import Footer from '../components/layouts/Footer';
import VideoLoader from '../components/common/VideoLoader';

export default function Home() {
  return (
    <div className="flex flex-col">
      <VideoLoader />
      <Hero />
      <About />
      <Feature />
      {/* <AboutReactor /> */}
      <HowItWorks />
      <div style={{ backgroundColor: "#ffffff" }}>
        <Faq />
        <Footer />
      </div>
    </div>
  );
}
