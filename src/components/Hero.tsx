"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import MapContainer from "./MapContainer"
import { Location } from "./WorldMap"

type HeroProps = {
  locations: Location[]
}

const Hero = ({ locations }: HeroProps) => (
  <section className="relative bg-gradient-to-b from-primary via-primary to-emerald-700 overflow-hidden min-h-[80vh]">
    {/* Map Background */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        transformOrigin: "center center",
        left: "20%",
        top: "50%",
        width: "100%",
        height: "100%",
        transform: "translate(-50%, -50%) scale(1)",
      }}
    >
      <div className="scale-110 h-full flex items-center justify-center">
        <MapContainer locations={locations} />
      </div>
    </div>

    {/* Animated wave decoration */}
    <div className="absolute inset-x-0 bottom-0 z-10">
      <svg
        viewBox="0 0 224 12"
        fill="currentColor"
        className="w-full -mb-1 text-white"
        preserveAspectRatio="none"
      >
        <path d="M0,0 C48.8902582,6.27314026 86.2235915,9.40971039 112,9.40971039 C137.776408,9.40971039 175.109742,6.27314026 224,0 L224,12.0441132 L0,12.0441132 L0,0 Z" />
      </svg>
    </div>

    <div className="px-4 py-24 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-32 relative z-20">
      <div className="relative max-w-2xl sm:mx-auto sm:max-w-xl md:max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            className="mx-auto hover:scale-105 transition-transform duration-300"
            src="/images/logo.png"
            width={300}
            height={300}
            alt="Logo Run Through the Noise"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="mb-6 font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl sm:leading-none">
            A journey around the world
            <br className="hidden md:block" />
            without
            <span className="relative inline-block px-2 ml-2">
              <div className="absolute inset-0 transform -skew-x-12 bg-emerald-200" />
              <span className="relative text-emerald-900">taking planes</span>
            </span>
          </h2>

          <p className="mb-6 text-lg text-indigo-100 md:text-xl">
            Julie & Jonathan are running around the world with communities
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="https://instagram.com/juju_jojo"
              target="_blank"
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary hover:bg-emerald-100 transition-colors duration-300 font-semibold"
            >
              <span className="[&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                  className="transition-transform duration-300 group-hover:scale-110"
                >
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </span>
              Follow us on Instagram!
            </Link>

            <Link
              href="mailto:jujujojo.run@gmail.com"
              className="text-emerald-200 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              Contact us by email
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

export default Hero
