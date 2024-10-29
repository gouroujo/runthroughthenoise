import Footer from './Footer'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="min-h-screen">
        <main>Juju & Jojo - under construction ! Follow us @juju_jojo on Instagram</main>
      </div>
      {/* <Footer /> */}
    </>
  )
}

export default Layout
