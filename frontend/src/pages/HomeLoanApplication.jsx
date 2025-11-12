import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Steps,
  Card,
  Row,
  Col,
  message,
  Divider,
  Table,
  Tag,
  Space,
  Alert
} from 'antd';
import {
  BankOutlined,
  UserOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import api from '../utils/api';
import './HomeLoanApplication.css';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const HomeLoanApplication = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [property, setProperty] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [emiDetails, setEmiDetails] = useState(null);
  const [applicationData, setApplicationData] = useState({});

  useEffect(() => {
    fetchBanks();
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchBanks = async () => {
    try {
      const response = await api.get('/home-loans/banks');
      if (response.data.success) {
        setBanks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
    }
  };

  const fetchProperty = async () => {
    try {
      const response = await api.get(`/properties/${propertyId}`);
      if (response.data.success) {
        setProperty(response.data.data);
        form.setFieldsValue({
          property_value: response.data.data.price,
          down_payment: response.data.data.price * 0.2 // 20% default
        });
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  };

  const calculateEligibility = async () => {
    try {
      const values = form.getFieldsValue(['monthly_income', 'total_existing_emi']);

      const response = await api.post('/home-loans/calculate-eligibility', {
        monthly_income: values.monthly_income,
        existing_emi: values.total_existing_emi || 0
      });

      if (response.data.success) {
        setEligibility(response.data.data);
        message.success(`You are eligible for up to ₹${(response.data.data.eligible_amount / 100000).toFixed(2)} Lakhs`);
      }
    } catch (error) {
      console.error('Error calculating eligibility:', error);
      message.error('Failed to calculate eligibility');
    }
  };

  const calculateEMI = async () => {
    try {
      const values = form.getFieldsValue(['loan_amount', 'interest_rate', 'tenure_months']);

      const response = await api.post('/home-loans/calculate-emi', {
        loan_amount: values.loan_amount,
        interest_rate: values.interest_rate,
        tenure_months: values.tenure_months
      });

      if (response.data.success) {
        setEmiDetails(response.data.data);
        form.setFieldValue('emi_amount', response.data.data.emi_amount);
      }
    } catch (error) {
      console.error('Error calculating EMI:', error);
      message.error('Failed to calculate EMI');
    }
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      setApplicationData({ ...applicationData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const finalData = {
        ...applicationData,
        ...values,
        property_id: propertyId || null
      };

      const response = await api.post('/home-loans/apply', finalData);

      if (response.data.success) {
        message.success('Loan application submitted successfully!');
        navigate(`/profile/loan-applications`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      message.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Loan Details',
      icon: <BankOutlined />
    },
    {
      title: 'Personal Info',
      icon: <UserOutlined />
    },
    {
      title: 'Employment',
      icon: <DollarOutlined />
    },
    {
      title: 'Review',
      icon: <FileTextOutlined />
    }
  ];

  return (
    <div className="home-loan-application">
      <Card className="application-header">
        <h1>Home Loan Application</h1>
        {property && (
          <div className="property-info">
            <Tag color="blue">Applying for: {property.title}</Tag>
            <Tag color="green">Price: ₹{(property.price / 100000).toFixed(2)} Lakhs</Tag>
          </div>
        )}
      </Card>

      <Card className="application-content">
        <Steps current={currentStep} className="application-steps">
          {steps.map((step, index) => (
            <Step key={index} title={step.title} icon={step.icon} />
          ))}
        </Steps>

        <Divider />

        <Form form={form} layout="vertical" className="application-form">
          {/* Step 1: Loan Details */}
          {currentStep === 0 && (
            <div className="form-step">
              <h2>Loan Details</h2>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Bank"
                    name="bank_name"
                    rules={[{ required: true, message: 'Please select a bank' }]}
                  >
                    <Select placeholder="Select bank" size="large">
                      {banks.map(bank => (
                        <Option key={bank.name} value={bank.name}>
                          {bank.name}
                          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
                            ({bank.interest_rates.min}% - {bank.interest_rates.max}%)
                          </span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Loan Type"
                    name="loan_type"
                    initialValue="home_loan"
                    rules={[{ required: true }]}
                  >
                    <Select size="large">
                      <Option value="home_loan">Home Loan</Option>
                      <Option value="loan_against_property">Loan Against Property</Option>
                      <Option value="balance_transfer">Balance Transfer</Option>
                      <Option value="top_up">Top-up Loan</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Property Value (₹)"
                    name="property_value"
                    rules={[{ required: true, message: 'Please enter property value' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₹\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Down Payment (₹)"
                    name="down_payment"
                    rules={[{ required: true, message: 'Please enter down payment' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₹\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Loan Amount (₹)"
                    name="loan_amount"
                    rules={[{ required: true, message: 'Please enter loan amount' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₹\s?|(,*)/g, '')}
                      onChange={calculateEMI}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Interest Rate (%)"
                    name="interest_rate"
                    initialValue={9.0}
                    rules={[{ required: true, message: 'Please enter interest rate' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={1}
                      max={20}
                      step={0.1}
                      onChange={calculateEMI}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Tenure (Months)"
                    name="tenure_months"
                    initialValue={240}
                    rules={[{ required: true, message: 'Please enter tenure' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={12}
                      max={360}
                      onChange={calculateEMI}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Monthly EMI (₹)" name="emi_amount">
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      disabled
                      formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {emiDetails && (
                <Alert
                  message="EMI Calculation"
                  description={
                    <div>
                      <p>Monthly EMI: ₹{emiDetails.emi_amount.toLocaleString()}</p>
                      <p>Total Interest: ₹{emiDetails.total_interest.toLocaleString()}</p>
                      <p>Total Payment: ₹{emiDetails.total_payment.toLocaleString()}</p>
                    </div>
                  }
                  type="info"
                  showIcon
                  style={{ marginTop: '16px' }}
                />
              )}
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Personal Information</h2>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Full Name"
                    name="applicant_name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input size="large" placeholder="Enter full name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="applicant_email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter valid email' }
                    ]}
                  >
                    <Input size="large" placeholder="your@email.com" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Phone Number"
                    name="applicant_phone"
                    rules={[
                      { required: true, message: 'Please enter your phone' },
                      { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10-digit phone' }
                    ]}
                  >
                    <Input size="large" placeholder="10-digit phone number" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="PAN Number"
                    name="applicant_pan"
                    rules={[
                      { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Please enter valid PAN' }
                    ]}
                  >
                    <Input size="large" placeholder="ABCDE1234F" style={{ textTransform: 'uppercase' }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Aadhar Number"
                    name="applicant_aadhar"
                    rules={[
                      { pattern: /^[0-9]{12}$/, message: 'Please enter valid 12-digit Aadhar' }
                    ]}
                  >
                    <Input size="large" placeholder="12-digit Aadhar number" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 3: Employment Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Employment Details</h2>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Employment Type"
                    name="employment_type"
                    rules={[{ required: true, message: 'Please select employment type' }]}
                  >
                    <Select size="large" placeholder="Select employment type">
                      <Option value="salaried">Salaried</Option>
                      <Option value="self_employed">Self Employed</Option>
                      <Option value="business">Business</Option>
                      <Option value="professional">Professional</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Monthly Income (₹)"
                    name="monthly_income"
                    rules={[{ required: true, message: 'Please enter monthly income' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₹\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Company Name" name="company_name">
                    <Input size="large" placeholder="Enter company name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Work Experience (Years)" name="work_experience_years">
                    <InputNumber style={{ width: '100%' }} size="large" min={0} max={50} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Credit Score (CIBIL)" name="credit_score">
                    <InputNumber style={{ width: '100%' }} size="large" min={300} max={900} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Total Existing EMI (₹/month)" name="total_existing_emi">
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/₹\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Button type="dashed" onClick={calculateEligibility} style={{ marginTop: '16px' }}>
                Check Eligibility
              </Button>

              {eligibility && (
                <Alert
                  message="Eligibility Result"
                  description={
                    <div>
                      <p><strong>Eligible Amount:</strong> ₹{(eligibility.eligible_amount / 100000).toFixed(2)} Lakhs</p>
                      <p><strong>Max EMI Allowed:</strong> ₹{eligibility.max_emi_allowed.toLocaleString()}/month</p>
                    </div>
                  }
                  type="success"
                  showIcon
                  style={{ marginTop: '16px' }}
                />
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2>Review Application</h2>
              <Alert
                message="Please review your application details before submitting"
                type="info"
                showIcon
                style={{ marginBottom: '24px' }}
              />

              <Card title="Loan Details" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                  <Col span={12}><strong>Bank:</strong> {form.getFieldValue('bank_name')}</Col>
                  <Col span={12}><strong>Loan Type:</strong> {form.getFieldValue('loan_type')}</Col>
                  <Col span={12}><strong>Property Value:</strong> ₹{form.getFieldValue('property_value')?.toLocaleString()}</Col>
                  <Col span={12}><strong>Loan Amount:</strong> ₹{form.getFieldValue('loan_amount')?.toLocaleString()}</Col>
                  <Col span={12}><strong>Interest Rate:</strong> {form.getFieldValue('interest_rate')}%</Col>
                  <Col span={12}><strong>Tenure:</strong> {form.getFieldValue('tenure_months')} months</Col>
                  <Col span={12}><strong>Monthly EMI:</strong> ₹{form.getFieldValue('emi_amount')?.toLocaleString()}</Col>
                </Row>
              </Card>

              <Card title="Personal Details" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                  <Col span={12}><strong>Name:</strong> {form.getFieldValue('applicant_name')}</Col>
                  <Col span={12}><strong>Email:</strong> {form.getFieldValue('applicant_email')}</Col>
                  <Col span={12}><strong>Phone:</strong> {form.getFieldValue('applicant_phone')}</Col>
                  <Col span={12}><strong>PAN:</strong> {form.getFieldValue('applicant_pan')}</Col>
                </Row>
              </Card>

              <Card title="Employment Details">
                <Row gutter={16}>
                  <Col span={12}><strong>Employment Type:</strong> {form.getFieldValue('employment_type')}</Col>
                  <Col span={12}><strong>Monthly Income:</strong> ₹{form.getFieldValue('monthly_income')?.toLocaleString()}</Col>
                  <Col span={12}><strong>Company:</strong> {form.getFieldValue('company_name') || 'N/A'}</Col>
                  <Col span={12}><strong>Experience:</strong> {form.getFieldValue('work_experience_years') || 0} years</Col>
                </Row>
              </Card>
            </div>
          )}
        </Form>

        <Divider />

        <div className="form-actions">
          {currentStep > 0 && (
            <Button onClick={handlePrevious}>
              Previous
            </Button>
          )}

          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={handleNext}>
              Next
            </Button>
          )}

          {currentStep === steps.length - 1 && (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              loading={loading}
            >
              Submit Application
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomeLoanApplication;
