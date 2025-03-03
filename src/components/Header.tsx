import Link from "next/link"
import Image from "next/image"

const Header = () => (
  <nav className="layout flex items-center justify-evenly py-4 max-w-lg mx-auto">
    <ul className="flex flex-1 items-center justify-evenly space-x-3 text-xs md:space-x-4 md:text-base">
      <li>
        <Link href="/" className="hover:underline">
          Home
        </Link>
      </li>
      <li>
        <Link href="/posts" className="hover:underline">
          Posts
        </Link>
      </li>
    </ul>
    <Link href="/">
      <Image
        src="/images/logo.png"
        width={75}
        height={75}
        alt="Logo Run Through the Noise"
      />
    </Link>
    <ul className="flex flex-1 items-center justify-evenly space-x-3 text-xs md:space-x-4 md:text-base">
      <li>
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>
      </li>
      <li>
        <Link href="/map" className="hover:underline">
          Map
        </Link>
      </li>
      <li>
        <Link href="/about" className="hover:underline">
          About Us
        </Link>
      </li>
    </ul>
  </nav>
)

export default Header
