import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Form, Icon, Input, Button, Checkbox, message, Spin, PageHeader } from 'antd';
import './LoginPage.css';
import HeadBar from './HeadBar';
import encodePassword from '../tools/encodePassword';

const { Content } = Layout;

message.config({
  top: 96,
});

class NormalLoginForm extends React.Component {
  state = {
    success: true,
  };

  handleSubmit = (e) => {
    console.log('click!');
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // TODO: 这里得到用户输入的密码，交给后端验证后登录
        this.props.handleWaiting();

        const postData = {
          email: values.email,
          password: encodePassword(values.password),
        }

        fetch('http://localhost:3001/api/login', {
          method: 'POST',
          body: JSON.stringify(postData),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          console.log(res);
          return res.json();
        }).then((data) => {
          console.log(data);
          if (data['success'] === true) {
            message.success('登录成功，欢迎回来！' + data['nickname']);
            this.setState({
              success: true,
            });
            window.sessionStorage.setItem('nickname', data['nickname']);
            window.sessionStorage.setItem('userType', data['userType']);
            window.sessionStorage.setItem('uid', data['uid']);
            this.props.handleWaiting(); // 结束运行
            this.props.handleLoginRedirect();

          } else {
            if (data['wrongEmail'] === true) {
              message.error('登录失败，邮箱未注册！');
            } else if (data['wrongPwd'] === true) {
              message.error('登录失败，密码错误！');
            }
            this.props.handleWaiting(); // 结束运行
          }
        }).catch(() => {
          console.log('error!');
          this.props.handleWaiting();
        });

      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <PageHeader
          onBack={this.props.handleLoginRedirect}
          title="登录"
          subTitle="欢迎回来~"
        />
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: '邮箱格式不对噢！',
            }, {
              required: true, message: '不可以是空的邮箱地址！',
            }],
          })(
            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="电子邮箱" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '把你密码给我交咯！' }],
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
  constructor() {
    super();
    this.state = {
      waiting: false,
    }
  }

  handleWaiting = () => {
    this.setState({
      waiting: !this.state.waiting,
    });
  };


  render() {
    return (
      <Content className="LoginContent">
        <Spin spinning={this.state.waiting} className='spin' size='large' tip='登录中，稍等一会儿哦~'>

          <WrappedNormalLoginForm handleLoginRedirect={this.props.handleLoginRedirect} handleWaiting={this.handleWaiting} />
        </Spin>
      </Content>
    );
  }
}

class LoginPage extends Component {
  handleLoginRedirect = () => {
    this.props.history.push('/');
  };

  render() {
    return (
      <Layout className="LoginPage">
        <HeadBar />
        <Layout className="LoginMain">
          <LoginBar handleLoginRedirect={this.handleLoginRedirect} />
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(LoginPage);

