import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {register} from '../../redux/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, error} = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';

    if (!formData.phone) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = 'Phone must be 10 digits';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validate()) {
      const {confirmPassword, ...registerData} = formData;
      dispatch(register(registerData));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to find your dream property</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={text => setFormData({...formData, name: text})}
            placeholder="Enter your name"
            icon="account"
            error={errors.name}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={text =>
              setFormData({...formData, email: text.toLowerCase()})
            }
            placeholder="Enter your email"
            icon="email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Phone"
            value={formData.phone}
            onChangeText={text => setFormData({...formData, phone: text})}
            placeholder="10 digit mobile number"
            icon="phone"
            keyboardType="phone-pad"
            error={errors.phone}
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={text => setFormData({...formData, password: text})}
            placeholder="Enter password (min 6 characters)"
            icon="lock"
            secureTextEntry
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={text =>
              setFormData({...formData, confirmPassword: text})
            }
            placeholder="Re-enter password"
            icon="lock-check"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'user' && styles.roleButtonActive,
                ]}
                onPress={() => setFormData({...formData, role: 'user'})}>
                <Text
                  style={[
                    styles.roleButtonText,
                    formData.role === 'user' && styles.roleButtonTextActive,
                  ]}>
                  Buyer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === 'seller' && styles.roleButtonActive,
                ]}
                onPress={() => setFormData({...formData, role: 'seller'})}>
                <Text
                  style={[
                    styles.roleButtonText,
                    formData.role === 'seller' && styles.roleButtonTextActive,
                  ]}>
                  Seller
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Login here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#262626',
  },
  subtitle: {
    fontSize: 16,
    color: '#8c8c8c',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleButtonActive: {
    backgroundColor: '#1890ff',
    borderColor: '#1890ff',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#595959',
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  registerButton: {
    marginTop: 8,
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#595959',
  },
  loginTextBold: {
    fontWeight: '700',
    color: '#1890ff',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default RegisterScreen;
