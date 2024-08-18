import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import { SiToyota } from "react-icons/si";
import heroimg from "../assets/ojhero.png"
import  "./Hero.css"
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className=" flex justify-center items-center md:px-0 px-4 flex-col">
       <div className='wrapper container gap-8 flex md:flex-row flex-col md:pt-8 pb-12'>
          {/* Hero text */}
          <div className='w-full md:w-1/2 md:p-3 flex items-center'>
            <Swiper pagination={{clickable: true}} modules={[Pagination]} className="mySwiper py-12">
             <SwiperSlide className='w-64 h-full flex items-center bg-white'>
                <div className='flex flex-col gap-8'>
                  <h2 className='text-3xl md:text-5xl font-bold text-[#275C9E]'> Simplify Your Life with Premier Laundry Care</h2>
                  <p className='md:w-[90%] text-lg text-black/90'> Save time and enjoy expertly cleaned laundry without the hassle. Your clothes will thank you.</p>
                  <div className='flex gap-4 items-center sm:justify-center'>
                    <Link to="/about" className='border-[2px] border-[#275C9E] bg-white sm:font-semibold py-1 text-sm sm:text-md sm:py-3 px-4 sm:px-8 text-[#d1dff0]'>Read More </Link>
                    <Link to="/contact" className='text-white md:font-semibold py-1 text-sm sm:text-md sm:py-3 px-4 sm:px-8 bg-[#275C9E]'>Contact Us</Link>
                  </div>
                </div>
             </SwiperSlide>
             <SwiperSlide className='w-64 h-full flex items-center bg-white'>
                <div className='flex flex-col gap-8'>
                  <h2 className='text-3xl md:text-5xl font-bold text-[#275C9E]'>Fresh & Flawless Laundry Services</h2>
                  <p className='md:w-[90%] text-lg text-black/90'>Discover the ultimate care for your clothes with our eco-friendly, high-quality laundry solutions.</p>
                  <div className='flex gap-4 items-center md:justify-center'>
                    <Link to="/about" className='text-sm border-[2px] border-[#275C9E] bg-white md:font-semibold py-1 sm:py-3 px-4 sm:px-8 text-[#275C9E]'>Read More </Link>
                    <Link to="/contact" className='text-white text-sm md:font-semibold py-1 sm:py-3 px-4 sm:px-8 bg-[#275C9E]'>Contact Us</Link>
                  </div>
                </div>
             </SwiperSlide>
            </Swiper>
          </div>


          {/* Hero Image */}
          <div className="w-full h-[400px] md:w-1/2 flex justify-center items-center">
            <img
              src={heroimg}
              alt=""
              className="w-3/4 h-full object-cover"
            />
          </div>
      </div>
    </div>
  );
};

export default Hero;