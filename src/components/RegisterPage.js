import React, { Component } from 'react';
import { Link, Route, BrowserRouter, Switch, withRouter } from 'react-router-dom';
import { Layout, Form, Icon, Input, Checkbox, Typography, message, Tabs, Tooltip, Cascader, Select, Row, Col, Spin, Button, AutoComplete, Modal, PageHeader } from 'antd';
import './RegisterPage.css';
import HeadBar from './HeadBar';
import encodePassword from '../tools/encodePassword';

const { Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const TabPane = Tabs.TabPane;
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

message.config({
    top: 96,
});

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        success: false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                // 判断条件是否满足
                if (values.password !== values.confirm) {
                    message.error('两次输入的密码不一样！');
                } else if (values.agreement !== true) {
                    message.error('请阅读并同意用户协议！');
                } else {
                    // TODO: 这里处理注册
                    this.props.handleWaiting();

                    const postData = {
                        email: values.email,
                        password: encodePassword(values.password),
                        nickname: values.nickname,
                    }

                    fetch('http://localhost:3001/api/register', {
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
                            message.success('注册成功！马上登录吧！');
                            this.setState({
                                success: true,
                            });
                            this.props.handleWaiting(); // 结束运行
                            this.props.handleRegisterRedirect();
                        } else {
                            if (data['existingEmail'] === true && data['existingNickname'] === true) {
                                message.error('注册失败，邮箱和昵称均已被注册！');
                            } else if (data['existingEmail'] === true) {
                                message.error('注册失败，邮箱已被注册！');
                            } else {
                                message.error('注册失败，昵称已被注册！');
                            }
                            this.props.handleWaiting(); // 结束运行
                        }
                    }).catch(() => {
                        console.log('error!');
                        this.props.handleWaiting();
                    });
                }


            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一样！');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="register-form">
                <PageHeader
                    onBack={this.props.handleRegisterRedirect}
                    title="注册账号"
                    subTitle="开始你的VoteLine之旅吧~"
                />
                <Form.Item
                    label={(
                        <span>
                            <Icon type="mail" />&nbsp;
                            电子邮箱
                        </span>
                    )}
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '邮箱格式不对噢！',
                        }, {
                            required: true, message: '空的邮箱地址不行的！',
                        }],
                    })(
                        <Input placeholder="输入邮箱地址" />
                    )}
                </Form.Item>
                <Form.Item
                    label={(
                        <span>
                            <Icon type="lock" />&nbsp;
                            密码
                        </span>
                    )}
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '密码是空的！',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" placeholder="输入密码" />
                    )}
                </Form.Item>
                <Form.Item
                    label={(
                        <span>
                            <Icon type="check-square" />&nbsp;
                            确认密码
                        </span>
                    )}
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请确认你的密码！',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} placeholder="确认你的密码" />
                    )}
                </Form.Item>
                <Form.Item
                    label={(
                        <span>
                            <Tooltip title="别人该怎么称呼你？">
                                <Icon type="smile" />
                            </Tooltip>
                            &nbsp;
                            昵称
                        </span>
                    )}
                >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: '想要别人怎么称呼你呢？', whitespace: true }],
                    })(
                        <Input placeholder="输入你的昵称" />
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    {getFieldDecorator('agreement', {
                        valuePropName: 'checked',
                    })(
                        <Checkbox>我已经阅读并同意了<a onClick={() => { this.props.showAgreement(); }}>用户条款</a></Checkbox>
                    )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">注&nbsp;&nbsp;册&nbsp;&nbsp;用&nbsp;&nbsp;户</Button>
                    <div>已有账号？点<Link to='/login'>这里</Link>登录</div>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);


class RegisterBar extends Component {
    constructor() {
        super();
        this.state = {
            showAgreement: false,
            waiting: false,
        };
    }

    showAgreementModal = () => {
        this.setState({
            showAgreement: true,
        });
    }

    handleOk = () => {
        this.setState({
            showAgreement: false,
        });
    }

    handleCancel = () => {
        this.setState({
            showAgreement: false,
        });
    }

    handleWaiting = () => {
        this.setState({
            waiting: !this.state.waiting,
        });
    }

    render() {
        return (
            <Content className="RegisterContent" >
                <Spin spinning={this.state.waiting} className='spin' size='large' tip='注册中，稍等一会儿哦~'>
                    <WrappedRegistrationForm showAgreement={this.showAgreementModal} handleRegisterRedirect={this.props.handleRegisterRedirect} handleWaiting={this.handleWaiting} />
                    <Modal
                        title="用户条款"
                        visible={this.state.showAgreement}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <Typography>
                            <Paragraph>
                                这只是一个DEMO。
                    </Paragraph>
                            <Paragraph>
                                <Text strong>Just happy hacking!</Text>
                            </Paragraph>
                        </Typography>
                    </Modal>
                </Spin>
            </Content>

        );
    }
}

class RegisterPage extends Component {
    handleRegisterRedirect = () => {
        this.props.history.push('/login');
    }


    render() {
        return (
            <Layout className="RegisterPage">
                <HeadBar />
                <Layout className="RegisterMain">
                    <RegisterBar handleRegisterRedirect={this.handleRegisterRedirect} />
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(RegisterPage);
