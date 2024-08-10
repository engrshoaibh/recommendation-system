import { motion } from 'framer-motion';

export default function HeroSection() {
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <motion.h1
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ duration: 0.6 }}
            >
              Summer styles are finally here
            </motion.h1>
            <motion.p
              className="mt-4 text-xl text-gray-500"
              initial="hidden"
              animate="visible"
              variants={textVariants}
              transition={{ duration: 0.8 }}
            >
              This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care
              if you live or die.
            </motion.p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                initial="hidden"
                animate="visible"
                variants={imageVariants}
                transition={{ duration: 1 }}
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                        <img
                          alt=""
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-01.jpg"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-02.jpg"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-03.jpg"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-04.jpg"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-05.jpg"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-06.jpg"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-07.jpg"
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.a
                href="#"
                className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
                initial="hidden"
                animate="visible"
                variants={buttonVariants}
                transition={{ duration: 0.6 }}
              >
                Shop Collection
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
