import Hero from '@/sections/Hero/Hero'
import CrimeAlley from '@/sections/CrimeAlley/CrimeAlley'
import Memorial from '@/sections/Memorial/Memorial'
import GothamUnderground from '@/sections/GothamUnderground/GothamUnderground'
import CityOfFear from '@/sections/CityOfFear/CityOfFear'
import TheArchives from '@/sections/TheArchives/TheArchives'
import Footer from '@/components/layout/Footer'
import RainCanvas from '@/components/ui/RainCanvas'
import FogLayer from '@/components/ui/FogLayer'

export default function Home() {
  return (
    <>
      {/* Atmospheric layers — fixed, global */}
      <FogLayer />
      <RainCanvas />

      <main>
        <Hero />
        <CrimeAlley />
        <Memorial />
        <GothamUnderground />
        <CityOfFear />
        <TheArchives />
        <Footer />
      </main>
    </>
  )
}


