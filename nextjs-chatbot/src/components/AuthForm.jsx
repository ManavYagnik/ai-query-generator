'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, Space, Spin, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, LoadingOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import api from '@/lib/api';

const { Title, Text } = Typography;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .auth-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
  }

  .auth-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
    animation: float 6s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  .auth-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 24px;
    box-shadow: 
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .auth-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    border-radius: 24px 24px 0 0;
  }

  .auth-card:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 35px 60px -12px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.15);
  }

  .auth-title {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .auth-subtitle {
    color: #64748b;
    font-weight: 400;
    text-align: center;
    margin-bottom: 2rem;
  }

  .ant-form-item {
    margin-bottom: 1.5rem;
  }

  .modern-input {
    height: 56px;
    border-radius: 16px;
    border: 2px solid #e2e8f0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    font-size: 16px;
    padding: 0 20px;
  }

  .modern-input:hover {
    border-color: #cbd5e1;
    background: rgba(255, 255, 255, 0.9);
  }

  .modern-input:focus,
  .modern-input.ant-input-focused {
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 1);
  }

  .modern-input .ant-input {
    background: transparent;
    border: none;
    box-shadow: none;
    padding-left: 16px;
    font-size: 16px;
    font-weight: 500;
  }

  .modern-input .anticon {
    color: #94a3b8;
    font-size: 18px;
    transition: all 0.3s ease;
  }

  .modern-input:focus .anticon,
  .modern-input.ant-input-focused .anticon {
    color: #667eea;
  }

  .ant-input::placeholder,
  .ant-input-password .ant-input::placeholder {
    color: #94a3b8 !important;
    font-weight: 500;
  }

  .modern-button {
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .modern-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .modern-button:hover::before {
    opacity: 1;
  }

  .modern-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }

  .modern-button:active {
    transform: translateY(0);
  }

  .modern-button span {
    position: relative;
    z-index: 1;
  }

  .toggle-link {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    position: relative;
    transition: all 0.3s ease;
  }

  .toggle-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
  }

  .toggle-link:hover::after {
    width: 100%;
  }

  .toggle-link:hover {
    color: #764ba2;
    text-decoration: none;
  }

  .floating-shapes {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    pointer-events: none;
  }

  .shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float-shapes 8s ease-in-out infinite;
  }

  .shape:nth-child(1) {
    width: 100px;
    height: 100px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  .shape:nth-child(2) {
    width: 150px;
    height: 150px;
    top: 70%;
    right: 10%;
    animation-delay: 2s;
  }

  .shape:nth-child(3) {
    width: 80px;
    height: 80px;
    top: 40%;
    left: 80%;
    animation-delay: 4s;
  }

  @keyframes float-shapes {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-30px) rotate(120deg); }
    66% { transform: translateY(15px) rotate(240deg); }
  }

  .loading-spinner {
    color: #667eea;
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    .auth-card {
      margin: 1rem;
      padding: 2rem 1.5rem;
      border-radius: 20px;
    }
    
    .auth-title {
      font-size: 1.75rem;
    }
    
    .modern-input {
      height: 52px;
      font-size: 16px; /* Prevents zoom on iOS */
    }
    
    .modern-button {
      height: 52px;
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    .auth-card {
      margin: 0.5rem;
      padding: 1.5rem 1rem;
    }
    
    .auth-title {
      font-size: 1.5rem;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .modern-input {
      border-width: 3px;
    }
    
    .auth-card {
      background: rgba(255, 255, 255, 1);
      border-width: 2px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .auth-card,
    .modern-input,
    .modern-button,
    .toggle-link,
    .shape {
      animation: none;
      transition: none;
    }
    
    .auth-card:hover {
      transform: none;
    }
    
    .modern-button:hover {
      transform: none;
    }
  }
`;

const AuthForm = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/signup';
      
      const requestData = isLogin ? {
        email: values.email,
        password: values.password
      } : {
        username: values.username,
        email: values.email,
        password: values.password
      };
      
      console.log('Frontend: Making request to', url, requestData);
      
      const response = await api.post(url, requestData);
      console.log('Frontend: Response received', response.data);
      
      if (isLogin) {
        console.log("AuthForm: Login successful, token:", response.data.token);
        localStorage.setItem('token', response.data.token);
        messageApi.success({
          content: 'Login successful! Redirecting...',
          duration: 2,
        });
        setTimeout(() => {
          console.log("AuthForm: Calling onLoginSuccess");
          onLoginSuccess();
        }, 1500);
      } else {
        messageApi.success({
          content: 'Account created successfully!',
          duration: 2,
        });
        setTimeout(() => {
          setIsLogin(true);
          form.resetFields();
        }, 1500);
      }
    } catch (err) {
      console.error('Frontend: Error occurred', err);
      messageApi.error({
        content: err.response?.data?.message || 'An error occurred',
        duration: 4,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{styles}</style>
      {contextHolder}
      
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <Row className="min-h-screen" align="middle" justify="center">
        <Col xs={22} sm={20} md={16} lg={12} xl={10} xxl={8}>
          <div className="auth-card">
            <div>
              <Title level={1} className="auth-title">
                {isLogin ? 'Welcome Back' : 'Join Us Today'}
              </Title>
              <Text className="auth-subtitle">
                {isLogin ? 'Sign in to continue your journey' : 'Create your account and get started'}
              </Text>
            </div>

            <Spin 
              spinning={loading} 
              indicator={<LoadingOutlined className="loading-spinner" style={{ fontSize: 28 }} spin />}
            >
              <Form
                form={form}
                layout="vertical"
                name="auth_form"
                onFinish={handleSubmit}
                autoComplete="off"
                size="large"
              >
                {!isLogin && (
                  <Form.Item
                    name="username"
                    rules={[
                      { required: true, message: 'Please enter your username' },
                      { min: 3, message: 'Username must be at least 3 characters' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Choose a username"
                      className="modern-input"
                    />
                  </Form.Item>
                )}

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email address' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Enter your email address"
                    className="modern-input"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter your password' },
                    { min: 6, message: 'Password must be at least 6 characters long' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Enter your password"
                    className="modern-input"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item style={{ marginBottom: '1rem' }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    block
                    className="modern-button"
                    loading={loading}
                  >
                    {isLogin ? 'Sign In to Account' : 'Create New Account'}
                  </Button>
                </Form.Item>
              </Form>
            </Spin>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Text style={{ color: '#64748b', fontSize: '15px' }}>
                {isLogin ? "New to our platform? " : "Already have an account? "}
                <a 
                  onClick={toggleAuthMode}
                  className="toggle-link"
                  style={{ cursor: 'pointer' }}
                >
                  {isLogin ? 'Create an account' : 'Sign in instead'}
                </a>
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuthForm;