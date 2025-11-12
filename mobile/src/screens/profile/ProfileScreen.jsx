import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../../redux/slices/authSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from '../../components/common/Card';

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const menuItems = [
    {
      icon: 'account-edit',
      title: 'Edit Profile',
      onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon'),
    },
    {
      icon: 'home-city',
      title: 'My Properties',
      onPress: () => navigation.navigate('MyProperties'),
      visible: user?.role === 'seller',
    },
    {
      icon: 'briefcase',
      title: 'My Service Bookings',
      onPress: () => Alert.alert('Coming Soon', 'Service bookings history will be available soon'),
    },
    {
      icon: 'heart',
      title: 'Saved Properties',
      onPress: () => navigation.navigate('SavedProperties'),
    },
    {
      icon: 'chat',
      title: 'Messages',
      onPress: () => navigation.navigate('Chat'),
    },
    {
      icon: 'bell',
      title: 'Notifications',
      onPress: () => Alert.alert('Coming Soon', 'Notifications will be available soon'),
    },
    {
      icon: 'help-circle',
      title: 'Help & Support',
      onPress: () => Alert.alert('Help & Support', 'For assistance, please contact: support@realestate.com'),
    },
    {
      icon: 'information',
      title: 'About',
      onPress: () => Alert.alert('Real Estate Portal', 'Version 1.0.0\n\nYour trusted partner in finding the perfect property.'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Icon name="account" size={48} color="#1890ff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems
          .filter(item => item.visible !== false)
          .map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}>
              <Icon name={item.icon} size={24} color="#595959" />
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Icon name="chevron-right" size={24} color="#bfbfbf" />
            </TouchableOpacity>
          ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#ff4d4f" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#262626',
  },
  userEmail: {
    fontSize: 14,
    color: '#8c8c8c',
    marginTop: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1890ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  roleText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#262626',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4d4f',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#bfbfbf',
  },
});

export default ProfileScreen;
