import React, { Component } from 'react';
import { Link, Route, BrowserRouter, withRouter } from 'react-router-dom';
import { Layout, Form, Icon, Input, Switch, Radio, Checkbox, Typography, message, Tabs, Tooltip, DatePicker, Cascader, Select, Row, Col, Spin, Button, AutoComplete, Modal, PageHeader } from 'antd';
import './NewInvPage.css';
import HeadBar from './HeadBar';
import encodePassword from '../tools/encodePassword';

const { Content, Sider } = Layout;
const { TextArea } = Input;
const { Title, Paragraph, Text } = Typography;
const TabPane = Tabs.TabPane;
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

message.config({
    top: 96,
});

class NewInvForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        success: false,
    };

    id = 2;

    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);

                if (!values.options.length || values.options.length < 2) {
                    // 没有选项
                    message.error('至少需要两个选项！');
                } else {
                    // TODO 这里处理后端
                    this.props.handleWaiting();

                    const postData = {
                        title: values.title,
                        description: values.description || '',
                        timeEnd: Date(values.timeEnd.format('l')),
                        multiple: values.multiple,
                        itype: values.itype,
                        createrUid: window.sessionStorage.getItem('uid'),
                        options: values.options,
                    }

                    console.log(postData);

                    fetch('http://localhost:3001/api/newinv', {
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
                            message.success('发起投票成功！');
                            this.setState({
                                success: true,
                            });
                            this.props.handleWaiting(); // 结束运行
                            this.props.handleNewInvRedirect(data['iid']); // 参数传入iid
                        } else {
                            message.error('发起投票失败');
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

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

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
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
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


        getFieldDecorator('keys', { initialValue: [0, 1] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                {...formItemLayout}
                label={'选项'}
                required={true}
                key={k}
            >
                {getFieldDecorator(`options[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: "请输入选项内容或删除该选项",
                    }],
                })(
                    <Input placeholder="在这里输入选项内容" style={{ width: '80%', marginRight: 8 }} />
                )}
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="newinv-form" >
                <PageHeader
                    onBack={this.props.handleNewInvRedirect}
                    title="发起投票"
                    subTitle="创建你自己的投票"
                    style={{background: 'transparent'}}
                />
                <Form.Item
                    label="投票类型"
                >
                    {getFieldDecorator('itype', {
                        rules: [{
                            required: true, message: '请选一个投票类型',
                        }],
                        initialValue: "others",
                    })(
                        <Radio.Group>
                            <Radio.Button value="discuss"><Icon type="weibo" /> 热点讨论</Radio.Button>
                            <Radio.Button value="question"><Icon type="pie-chart" /> 问卷调查</Radio.Button>
                            <Radio.Button value="activity"><Icon type="team" /> 活动投票</Radio.Button>
                            <Radio.Button value="others"><Icon type="profile" /> 杂七杂八</Radio.Button>
                        </Radio.Group>
                    )}
                </Form.Item>
                <Form.Item
                    label={(
                        <span>
                            投票标题
                        </span>
                    )}
                >
                    {getFieldDecorator('title', {
                        rules: [{
                            max: 45, message: '标题不能超过45个字哦！',
                        }, {
                            required: true, message: '空标题是不行的！',
                        }],
                    })(
                        <Input placeholder="对于巴黎圣母院失火事件，你的态度更接近哪一种？" />
                    )}
                </Form.Item>
                <Form.Item
                    label={(
                        <span>
                            描述
                        </span>
                    )}
                >
                    {getFieldDecorator('description', {
                        rules: [{
                            max: 255, message: '描述不能超过255个字哦！',
                        }],
                    })(
                        <TextArea placeholder="有人欢喜有人愁。" />
                    )}
                </Form.Item>
                <Form.Item
                    label="截止时间"
                >
                    {getFieldDecorator('timeEnd', {
                        rules: [{ type: 'object', required: true, message: '请选择截止时间！' }],
                    })(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    )}
                </Form.Item>
                <Form.Item
                    label="是否可多选"
                >
                    {getFieldDecorator('multiple', { valuePropName: 'checked' })(
                        <Switch />
                    )}
                </Form.Item>
                {formItems}
                <Form.Item {...tailFormItemLayout}>
                    <Button type="dashed" onClick={this.add} style={{ width: '80%' }}>
                        <Icon type="plus" />增加选项
                    </Button>
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">发起投票</Button>
                </Form.Item>

            </Form>
        );
    }
}

const WrappedNewInvForm = Form.create({ name: 'new_inv' })(NewInvForm);


class NewInvBar extends Component {
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
            <Content className="NewInvContent" >
                <Spin spinning={this.state.waiting} className='spin' size='large' tip='正在创建新投票，请稍候...'>
                    <WrappedNewInvForm showAgreement={this.showAgreementModal} handleNewInvRedirect={this.props.handleNewInvRedirect} handleWaiting={this.handleWaiting} />
                </Spin>
            </Content>

        );
    }
}

class NewInvPage extends Component {
    constructor() {
        super();
        this.state = {
            userType: window.sessionStorage.getItem('userType') || 'visitor',
        };
    }
    handleNewInvRedirect = () => {
        this.props.history.push('/'); // 这里应该跳转到新建的投票页面/inv/:iid
    }

    render() {
        if (this.state.userType === 'visitor') {
            message.warning('要先登录才能发起投票哦！');
            this.props.history.push('/login');
        }

        return (
            <Layout className="NewInvPage">
                <HeadBar />
                <Layout className="NewInvMain">
                    <NewInvBar handleNewInvRedirect={this.handleNewInvRedirect} handleGoLogin={this.handleGoLogin} />
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(NewInvPage);
