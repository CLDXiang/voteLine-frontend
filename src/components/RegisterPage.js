import React, { Component } from 'react';
import { Link, Route, BrowserRouter, Switch, withRouter } from 'react-router-dom';
import { Layout, Form, Icon, Input, Checkbox, Typography, message, Tabs, Tooltip, Cascader, Select, Row, Col, Button, AutoComplete, Modal } from 'antd';
import './RegisterPage.css';
import HeadBar from './HeadBar';

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
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                // TODO 这里处理注册

                message.success('注册成功！马上登录吧！');
                this.props.handleRegisterRedirect();
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

    render() {
        return (
            <Content className="RegisterContent" >
                <WrappedRegistrationForm showAgreement={this.showAgreementModal} handleRegisterRedirect={this.props.handleRegisterRedirect} />
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
