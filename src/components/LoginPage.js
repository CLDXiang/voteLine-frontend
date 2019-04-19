import React, { Component } from 'react';
import { Link, Route, BrowserRouter, Switch, withRouter } from 'react-router-dom';
import { Layout, Form, Icon, Input, Button, Checkbox, Typography, Tabs, message } from 'antd';
import './LoginPage.css';
import HeadBar from './HeadBar';

const { Content, Sider } = Layout;
const { Title } = Typography;
const TabPane = Tabs.TabPane;

message.config({
  top: 96,
});

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    console.log('click!');
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // TODO 这里得到用户输入的密码，交给后端验证后登录
        // 假设成功登录，试试webstorage
        window.sessionStorage.setItem('userName',values.userName);
        window.sessionStorage.setItem('userType', 'root');
        this.props.handlelogin();
        message.success("登录成功，欢迎你！"+values.userName);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '把你用户名给我交咯！' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '空密码是认真的吗？' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住我</Checkbox>
          )}
          <a className="login-form-forgot" href="">忘记密码</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          或者 <Link to="/register">现在注册！</Link>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

class LoginBar extends Component {
  render() {
    return (
      <Content className="LoginContent">
        <WrappedNormalLoginForm handlelogin={this.props.handlelogin}/>
      </Content>
    );
  }
}

class LoginPage extends Component {
  handleLogin = ()=>{
    this.props.history.push('/');
  }

  render() {
    return (
      <Layout className="LoginPage">
        <HeadBar />
        <Layout className="LoginMain">
          <LoginBar handlelogin={this.handleLogin}/>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(LoginPage);

