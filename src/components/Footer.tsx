const Footer = () => {
  return (
      <footer className="relative bg-primary text-primary">
        <svg
            className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16"
            preserveAspectRatio="none"
            viewBox="0 0 1440 54"
        >
          <path
              fill="currentColor"
              d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
          />
        </svg>
          <div className="p-10 text-white">
              <div className="hidden md:max-w-md lg:col-span-2 mb-4 mx-auto">
                  <span className="text-base font-medium tracking-wide text-gray-300">Subscribe for updates</span>
                  <form className="flex flex-col mt-4 md:flex-row">
                      <input
                          placeholder="Email"
                          required
                          type="text"
                          className="flex-grow w-full h-12 px-4 mb-3 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none md:mr-2 md:mb-0 focus:border-deep-purple-accent-400 focus:outline-none focus:shadow-outline"
                      />
                      <button
                          type="submit"
                          className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-deep-purple-accent-400 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                      >
                          Subscribe
                      </button>
                  </form>
                  <p className="mt-4 text-sm">
                      Stay up to date with the latest on Run Through the Noise.
                  </p>
              </div>
              <div className="flex flex-col justify-between pt-5 pb-10 border-t border-white sm:flex-row">
                  <p className="text-sm">
                      © Copyright 2024 Juju & Jojo. All rights reserved.
                  </p>
                  <div className="flex items-center mt-4 space-x-4 sm:mt-0">
                      <a href="https://instagram.com/juju_jojo" target="_blank" className="transition-colors duration-300 hover:text-teal-accent-400">
                          <svg viewBox="0 0 30 30" fill="currentColor" className="h-6">
                              <circle cx="15" cy="15" r="4"></circle>
                              <path
                                  d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"
                              ></path>
                          </svg>
                      </a>
                  </div>
              </div>
          </div>
      </footer>
  )
}

export default Footer
