import { Outlet } from 'react-router-dom'
import { Layout as AntLayout } from 'antd'
import Header from './Header'
import Footer from './Footer'

const { Content } = AntLayout

const Layout = () => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ marginTop: 64 }}>
        <Outlet />
      </Content>
      <Footer />
    </AntLayout>
  )
}

export default Layout
