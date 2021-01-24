import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function LoginPage() {
  const history = useHistory();

  const onFinish = async (values) => {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(values.email, values.password);
    history.push('/dashboard');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <Form
        {...layout}
        name='basic'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name='remember' valuePropName='checked'>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;
