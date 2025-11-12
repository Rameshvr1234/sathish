import { useSelector } from 'react-redux'
import { Card, Descriptions, Tag } from 'antd'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)

  const getRoleTag = (role) => {
    const colors = {
      user: 'blue',
      seller: 'green',
      branch_admin: 'orange',
      super_admin: 'red',
    }
    return <Tag color={colors[role] || 'default'}>{role?.toUpperCase().replace('_', ' ')}</Tag>
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <Card title="My Profile">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user?.phone}</Descriptions.Item>
          <Descriptions.Item label="Role">{getRoleTag(user?.role)}</Descriptions.Item>
          {user?.branch && (
            <>
              <Descriptions.Item label="Branch">{user.branch.name}</Descriptions.Item>
              <Descriptions.Item label="Region">{user.branch.region}</Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Card>
    </div>
  )
}

export default Profile
