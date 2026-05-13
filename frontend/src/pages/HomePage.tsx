import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import EventTicker from '../components/sections/EventTicker'
import AboutSection from '../components/sections/AboutSection'
import BeerSection from '../components/sections/BeerSection'
import MenuSection from '../components/sections/MenuSection'
import EventsSection from '../components/sections/EventsSection'
import GallerySection from '../components/sections/GallerySection'
import ReviewsSection from '../components/sections/ReviewsSection'
import ReservationSection from '../components/sections/ReservationSection'
import ContactSection from '../components/sections/ContactSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <EventTicker />
        <AboutSection />
        <BeerSection />
        <MenuSection />
        <EventsSection />
        <GallerySection />
        <ReviewsSection />
        <ReservationSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
