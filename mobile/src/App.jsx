import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {store} from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import {requestUserPermission, setupNotifications} from './utils/notifications';

const App = () => {
  useEffect(() => {
    // Request notification permissions on app launch
    requestUserPermission();

    // Setup notification handlers
    const unsubscribe = setupNotifications(notification => {
      console.log('Received notification:', notification);
      // Handle notification display
    });

    return unsubscribe;
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <StatusBar barStyle="light-content" backgroundColor="#1890ff" />
        <AppNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
