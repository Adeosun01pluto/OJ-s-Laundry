import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    text: "The laundry service is exceptional! My clothes have never been cleaner or fresher. is. It saves me so much time! is. It saves me so much time! ",
    rating: 5,
  },
  {
    id: 2,
    name: "Jane Smith",
    text: "I love how convenient their pickup and delivery service is. It saves me so much time!  is. It saves me so much time!  is. It saves me so much time! ",
    rating: 5,
  },
  {
    id: 3,
    name: "Mike Johnson",
    text: "Their attention to detail is impressive. They even managed to remove a stubborn stain I thought was permanent.",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <div className="bg-gray-100 py-4 sm:py-12 px-4 md:px-0">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-4xl mb-6 font-bold text-center text-[#275C9E] sm:mb-12">What Our Customers Say</h2>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col h-full py-4">
                <FaQuoteLeft className="text-[#275C9E] text-3xl mb-4" />
                <p className="text-gray-600 mb-4 flex-grow">{testimonial.text}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-semibold text-[#275C9E]">{testimonial.name}</span>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Testimonials;