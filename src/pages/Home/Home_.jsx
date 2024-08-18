import React from 'react'
import Hero from '../../components/Hero'
import Thecars from '../../components/Thecars'
import Contact from '../../components/Contact'
import WhyChoose from '../../components/WhyChoose'
import About from '../About/About_'
import Testimonials from '../../components/Testimonials'

function Home_() {
  return (
    <div className=''>
      <Hero />
      {/* <Thecars /> */}
      <About />
      <Testimonials />
      <WhyChoose/> 
      <Contact />
    </div>
  )
}

export default Home_