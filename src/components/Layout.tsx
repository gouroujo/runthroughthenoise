import Footer from './Footer'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="min-h-screen">
        <main>Juju & Jojo</main>
      </div>
      {/* <Footer /> */}
    </>
  )
}

export default Layout
