import React, { Component } from 'react';
import { Link, Route, BrowserRouter, withRouter } from 'react-router-dom';
import { Layout, Form, Icon, Input, Switch, Radio, Checkbox, Typography, message, Tabs, Tooltip, DatePicker, Cascader, Select, Row, Col, Spin, Button, AutoComplete, Modal, PageHeader } from 'antd';
import './InvPage.css';
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

class InvForm extends React.Component {
    constructor() {
        super();
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            success: false,
            data: null,
        };
    }

    componentDidMount() {
        this.fetchData((res) => {
            console.log(res);
            this.setState({
                data: res,
            });
        });
    }

    fetchData = (callback) => {
        // 从后端获取该投票数据
        fetch(`http://localhost:3001/api/getinv?iid=${this.props.iid}&uid=${window.sessionStorage.uid}`, {
            method: 'GET',
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
                callback(data);
            } else if (data['wrongIid'] === true) {
                message.error('这个投票并不存在！');
                this.props.handleInvRedirect();
            }
        }).catch(() => {
            console.log('error!');
        });
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                console.log(window.sessionStorage.getItem('ip'), window.sessionStorage.getItem('region'));

                const userType = window.sessionStorage.getItem('userType') || 'visitor';
                let options = [];

                if (userType === 'visitor') {
                    message.warning('要先登录才能投票哦！');
                    this.props.handleGoLogin();
                    return;
                }

                if (!values.multiple && !values.single) {
                    message.warning('请选择至少一个选项！');
                    return;
                }

                if (values.multiple && values.multiple.length > 0) {
                    options = values.multiple;
                } else if (values.single) {
                    options = [values.single];
                }

                const uid = window.sessionStorage.getItem('uid');
                const ip = window.sessionStorage.getItem('ip');
                const region = window.sessionStorage.getItem('region');


                // TODO: 这里处理后端
                const postData = {
                    options: options,
                    uid: parseInt(uid),
                    ip: ip,
                    region: region || '',
                }

                console.log(postData);


                fetch('http://localhost:3001/api/vote', {
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
                        message.success('投票成功！');
                        this.setState({
                            success: true,
                        });
                        this.props.changeShow();
                    } else if (data['existingChoose'] === true) {
                        message.error('你已经投过票了哦！');
                    }
                }).catch(() => {
                    console.log('error!');
                });

            }
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const voted = (this.state.data && this.state.data.voted) || false;
        const votedOptions = (this.state.data && this.state.data.votedOptions) || [];

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (
            <Form onSubmit={this.handleSubmit} className="inv-form" >
                <Typography >
                    <Title className="title" level={3}>
                        {(this.state.data && this.state.data.inv.title) || ''}
                        <Button.Group size="middle">
                            <Button type="primary" disabled>
                                <Icon type="left" />返回投票
                            </Button>
                            <Button type="primary" onClick={this.props.changeShow}>
                                查看结果<Icon type="right" />
                            </Button>
                        </Button.Group>
                    </Title>
                    <Paragraph className="paragraph">
                        {(this.state.data && this.state.data.inv.description) || ''}
                    </Paragraph>
                </Typography>
                {(this.state.data && this.state.data.inv.multiple === true) ?
                    <Form.Item
                        className="FormItem"
                    >
                        {getFieldDecorator("multiple", {
                            initialValue: votedOptions,
                        })(
                            <Checkbox.Group style={{ width: "100%" }}>
                                {this.state.data && this.state.data.options.map((option, key) => (
                                    <Row align="middle" justify="center" style={{ margin: "12px 0" }} key={key}>
                                        <Col span={24}><Checkbox value={option.oid} style={{ fontSize: "15px", lineHeight: "1.6" }} disabled={voted}>选项{key + 1}: {option.content}</Checkbox></Col>
                                    </Row>
                                ))}
                            </Checkbox.Group>
                        )}
                    </Form.Item> :
                    <Form.Item
                        className="FormItem"
                    >
                        {getFieldDecorator('single', {
                            initialValue: votedOptions[0],
                        })(
                            <Radio.Group>
                                {/* <Radio style={radioStyle} value="a">item 1</Radio>
                                <Radio style={radioStyle} value="b">item 2</Radio>
                                <Radio style={radioStyle} value="c">item 3</Radio> */}
                                {this.state.data && this.state.data.options.map((option, key) => (
                                    <Row align="middle" justify="center" style={{ margin: "12px 0" }} key={key}>
                                        <Col span={24}><Radio value={option.oid} style={{ fontSize: "15px", lineHeight: "1.6" }} disabled={voted}>选项{key + 1}: {option.content}</Radio></Col>
                                    </Row>
                                ))}
                            </Radio.Group>
                        )}
                    </Form.Item>}
                <Form.Item className="FormItem">
                    <Button type="primary" htmlType="submit" disabled={voted}>我要投这{(this.state.data && this.state.data.inv.multiple === true) ? '些' : '个'}！</Button>
                </Form.Item>

            </Form>
        );
    }
}

const WrappedInvForm = Form.create({ name: 'new_inv' })(InvForm);

class ResultsBar extends Component {
    constructor() {
        super();
        this.state = {
            success: false,
            data: null,
        };
    }

    componentDidMount() {
        this.fetchData((res) => {
            console.log(res);
            this.setState({
                data: res,
            });
        });
    }

    fetchData = (callback) => {
        // 从后端获取该投票数据
        fetch(`http://localhost:3001/api/getinv?iid=${this.props.iid}&uid=${window.sessionStorage.uid}`, {
            method: 'GET',
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
                callback(data);
            } else if (data['wrongIid'] === true) {
                message.error('这个投票并不存在！');
                this.props.handleInvRedirect();
            }
        }).catch(() => {
            console.log('error!');
        });
    }

    render() {
        return (
            <Layout className="inv-form" >
                <Typography >
                    <Title className="title" level={3}>
                        {(this.state.data && this.state.data.inv.title) || ''}
                        <Button.Group size="middle">
                            <Button type="primary" onClick={this.props.changeShow}>
                                <Icon type="left" />返回投票
                            </Button>
                            <Button type="primary" disabled>
                                查看结果<Icon type="right" />
                            </Button>
                        </Button.Group>
                    </Title>
                    <Paragraph className="paragraph">
                        {(this.state.data && this.state.data.inv.description) || ''}
                    </Paragraph>
                </Typography>
            </Layout>

        );
    }

}


class InvBar extends Component {
    constructor() {
        super();
        this.state = {
            showResults: false,
        };
    }

    changeShow = () => {
        this.setState({
            showResults: !this.state.showResults,
        });
    }


    render() {
        const sub_props = {
            changeShow: this.changeShow,
            iid :this.props.iid,
            userType:this.props.userType,
            handleInvRedirect:this.props.handleInvRedirect,
            handleGoLogin:this.props.handleGoLogin,
        }

        return (
            <Content className="InvContent" >
                    {this.state.showResults ? <ResultsBar {...sub_props} /> :
                        <WrappedInvForm {...sub_props} />}
            </Content>

        );
    }
}

class InvPage extends Component {
    constructor() {
        super();
        this.state = {
            userType: window.sessionStorage.getItem('userType') || 'visitor',
        };
    }
    handleInvRedirect = () => {
        this.props.history.push('/');
    }

    handleGoLogin = () => {
        this.props.history.push('/login');
    }

    render() {
        const iid = this.props.match.params.iid;
        const userType = this.state.userType;

        return (
            <Layout className="InvPage">
                <HeadBar />
                <Layout className="InvMain">
                    <InvBar handleInvRedirect={this.handleInvRedirect} handleGoLogin={this.handleGoLogin} iid={iid} userType={userType} />
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(InvPage);
