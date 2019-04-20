import React, { Component } from 'react';
import { Link, Route, BrowserRouter, Switch, withRouter } from 'react-router-dom';
import { Layout, Form, Icon, Input, Checkbox, Typography, message, Tabs, Tooltip, Cascader, Select, Row, Col, Spin, Button, AutoComplete, Modal } from 'antd';
import './RegisterPage.css';
import HeadBar from './HeadBar';
import { config } from '../config';

const port_back = config.port_back;

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
                    return false;
                } else if (values.agreement === false) {
                    message.error('请阅读并同意用户协议！');
                } else {
                    // TODO 这里处理注册
                    this.props.handleWaiting();

                    const postData = {
                        email: values.email,
                        password: values.password,
                        nickname: values.nickname,
                    }

                    fetch('http://localhost:3001/api/register', {
                        method: 'POST',
                        body: JSON.stringify(postData),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            // 'Access-Control-Allow-Origin': 'http://localhost:5000'
                        },
                    }).then((res) => {
                        console.log(res);
                        return res.json();
                    }).then((data) => {
                        console.log(data);
                        if (data['res'] === 'success') {
                            // this.props.handleChangeOutput(data['log'], data['file_path'], data['img_path']);
                            message.success('注册成功！马上登录吧！');
                            this.setState({
                                success: true,
                            })
                            
                        } else if (data['res'] === 'no_main') {
                            // this.no_main_warning();
                            
                        } else {
                            // this.props.handleChangeOutput('程序运行失败', '输出文件储存路径：', '输出图像储存路径：');
                            // this.error();
                            message.error('注册失败...');
                        }
                        this.props.handleWaiting(); // 结束运行
                        this.props.handleRegisterRedirect();
                    }).catch(() => {
                        this.error();
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

    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
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
                <Spin spinning={this.state.waiting} className='spin' size='large' tip='稍等一会儿哦~'>
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
