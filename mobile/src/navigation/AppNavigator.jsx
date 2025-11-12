import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {restoreAuth} from '../redux/slices/authSlice';
import {storage} from '../utils/storage';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/home/HomeScreen';
import PropertyListScreen from '../screens/property/PropertyListScreen';
import PropertyDetailScreen from '../screens/property/PropertyDetailScreen';
import CreatePropertyScreen from '../screens/property/CreatePropertyScreen';
import MyPropertiesScreen from '../screens/property/MyPropertiesScreen';
import SavedPropertiesScreen from '../screens/property/SavedPropertiesScreen';
import ServiceBookingScreen from '../screens/services/ServiceBookingScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import Loading from '../components/common/Loading';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Properties') {
            iconName = 'home-city';
          } else if (route.name === 'Chat') {
            iconName = 'chat';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1890ff',
        tabBarInactiveTintColor: '#8c8c8c',
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#1890ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Real Estate Portal'}}
      />
      <Tab.Screen
        name="Properties"
        component={PropertyListScreen}
        options={{title: 'Properties'}}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{title: 'Messages'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore auth state on app launch
    const restoreAuthState = async () => {
      try {
        const token = await storage.getToken();
        const user = await storage.getUser();

        if (token && user) {
          dispatch(restoreAuth({token, user}));
        }
      } catch (error) {
        console.error('Error restoring auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuthState();
  }, [dispatch]);

  if (isLoading) {
    return <Loading message="Loading..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1890ff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{title: 'Create Account'}}
            />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PropertyDetail"
              component={PropertyDetailScreen}
              options={{title: 'Property Details'}}
            />
            <Stack.Screen
              name="CreateProperty"
              component={CreatePropertyScreen}
              options={{title: 'Post New Property'}}
            />
            <Stack.Screen
              name="MyProperties"
              component={MyPropertiesScreen}
              options={{title: 'My Properties'}}
            />
            <Stack.Screen
              name="SavedProperties"
              component={SavedPropertiesScreen}
              options={{title: 'Saved Properties'}}
            />
            <Stack.Screen
              name="ServiceBooking"
              component={ServiceBookingScreen}
              options={({route}) => ({
                title: `Book ${route.params?.type?.charAt(0).toUpperCase() + route.params?.type?.slice(1)} Service`,
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
