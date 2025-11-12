import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Menu, Button, Dropdown, Badge, Avatar } from 'antd'
import {
  HomeOutlined,
  ShopOutlined,
  PlusOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MessageOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { logout, loadUser } from '../../redux/slices/authSlice'

const { Header: AntHeader } = Layout

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [current, setCurrent] = useState('home')

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(loadUser())
    }
  }, [isAuthenticated, user, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'properties',
      icon: <ShopOutlined />,
      label: <Link to="/properties">Properties</Link>,
    },
    {
      key: 'services',
      label: 'Services',
      children: [
        {
          key: 'survey',
          label: <Link to="/services/survey">Survey</Link>,
        },
        {
          key: 'legal',
          label: <Link to="/services/legal">Legal</Link>,
        },
        {
          key: 'construction',
          label: <Link to="/services/construction">Construction</Link>,
        },
        {
          key: 'finance',
          label: <Link to="/services/finance">Finance</Link>,
        },
      ],
    },
  ]

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      {(user?.role === 'seller' || user?.role === 'branch_admin' || user?.role === 'super_admin') && (
        <>
          <Menu.Item key="my-properties" icon={<ShopOutlined />}>
            <Link to="/my-properties">My Properties</Link>
          </Menu.Item>
          <Menu.Item key="create-property" icon={<PlusOutlined />}>
            <Link to="/create-property">Create Property</Link>
          </Menu.Item>
        </>
      )}
      <Menu.Item key="bookings" icon={<CalendarOutlined />}>
        <Link to="/my-bookings">My Bookings</Link>
      </Menu.Item>
      <Menu.Item key="chat" icon={<MessageOutlined />}>
        <Link to="/chat">Messages</Link>
      </Menu.Item>
      {user?.role === 'branch_admin' && (
        <Menu.Item key="branch-dashboard" icon={<DashboardOutlined />}>
          <Link to="/branch-admin">Branch Dashboard</Link>
        </Menu.Item>
      )}
      {user?.role === 'super_admin' && (
        <Menu.Item key="super-dashboard" icon={<DashboardOutlined />}>
          <Link to="/super-admin">Admin Dashboard</Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  )

  return (
    <AntHeader
      style={{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginRight: '40px',
              color: '#1890ff',
            }}
          >
            <Link to="/" style={{ color: '#1890ff' }}>
              PropertyPortal
            </Link>
          </div>
          <Menu
            onClick={(e) => setCurrent(e.key)}
            selectedKeys={[current]}
            mode="horizontal"
            items={menuItems}
            style={{ flex: 1, border: 'none' }}
          />
        </div>

        <div>
          {isAuthenticated && user ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Badge count={0}>
                  <Avatar icon={<UserOutlined />} />
                </Badge>
                <span>{user.name}</span>
              </div>
            </Dropdown>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </AntHeader>
  )
}

export default Header
