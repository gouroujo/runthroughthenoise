import Footer from "./Footer"

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => (
  <>
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
)

export default Layout
