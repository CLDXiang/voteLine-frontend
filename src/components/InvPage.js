import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Form, Icon, Avatar, Radio, Checkbox, Typography, message, Row, Col, Button, Popconfirm } from 'antd';
import createG2 from 'g2-react';
import moment from 'moment';
import './InvPage.css';
import HeadBar from './HeadBar';
import { config } from '../config';

const { url_back, port_back } = config;
const url_server = `${url_back}:${port_back}`;
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

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
        fetch(`${url_server}/api/getinv?iid=${this.props.iid}&uid=${window.sessionStorage.uid}`, {
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
    };


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

                const postData = {
                    options: options,
                    uid: parseInt(uid),
                    ip: ip,
                    region: region || '',
                };

                console.log(postData);


                fetch(`${url_server}/api/vote`, {
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
    };


    handleDelete = (item) => {
        // 验证用户身份
        console.log(item);
        const uid = window.sessionStorage.getItem('uid') || -1;
        const userType = window.sessionStorage.getItem('userType') || 'visitor';
        console.log(uid, userType);
        if (parseInt(uid) !== parseInt(item.createruid) && userType !== 'root') {
            message.error("只能删除自己创建的投票！");
            return;
        }

        const postData = {
            iid: item.iid,
        };

        console.log(postData);

        fetch(`${url_server}/api/deleteinv`, {
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
                console.log(data);
                message.success('删除投票成功！');
                this.props.handleInvRedirect();
            }
        }).catch(() => {
            console.log('error!');
        });
    };

    render() {
        const DeleteIconText = ({ type, text, item }) => (
            <Popconfirm onConfirm={() => { this.handleDelete(item); }} title="确定要删除吗" icon={<Icon type="question-circle-o" style={{ color: 'orange' }} />}>
                <span style={{ cursor: "pointer" }}>
                    <Icon type={type} style={{ marginRight: 8 }} />
                    {text}
                </span>
            </Popconfirm>
        );
        const { getFieldDecorator } = this.props.form;
        const voted = (this.state.data && this.state.data.voted) || false;
        const votedOptions = (this.state.data && this.state.data.votedOptions) || [];

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
                    <Paragraph>
                        <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginRight: "10px" }}>{this.state.data && this.state.data.createrName.substring(0, 1)}</Avatar>
                        <Text>{this.state.data && this.state.data.createrName} 创建于 {this.state.data && moment(this.state.data.inv.createdAt).format('YYYY-MM-DD HH:mm:ss')}  </Text>
                        <DeleteIconText type="delete" text="删除" item={this.state.data && this.state.data.inv} />
                    </Paragraph>
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
            chartData: [],
            width: 800,
            height: 500,
            plotCfg: {
                margin: [0, 0, 0, 0]
            },
        };
    }



    componentDidMount() {
        this.fetchData((res) => {
            console.log(res);
            let maxLength = 0;
            let chartData = [];
            let index = res.options.length;
            for (let option of res.options.reverse()) {
                maxLength = option.content.length > maxLength ? option.content.length : maxLength;
                maxLength = maxLength > 15 ? 20 : maxLength; // 不超过15
                chartData.push({ "option": option.content.length > 15 ? `选项${index}：${option.content.substring(0, 15)}...` : `选项${index}：${option.content}`, "num": option.number, "content": `选项${index}：${option.content}` });
                index--;
            }
            console.log(chartData);
            console.log(maxLength);
            this.setState({
                data: res,
                chartData: chartData,
                height: res.options.length > 10 ? 500:res.options.length * 50,
                plotCfg: {
                    margin: [0, 30, 0, 17 * (maxLength + 4)]
                },
            });
        });
    }

    fetchData = (callback) => {
        // 从后端获取该投票数据
        fetch(`${url_server}/api/getinv?iid=${this.props.iid}&uid=${window.sessionStorage.uid}`, {
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
    };


    handleDelete = (item) => {
        // 验证用户身份
        console.log(item);
        const uid = window.sessionStorage.getItem('uid') || -1;
        const userType = window.sessionStorage.getItem('userType') || 'visitor';
        console.log(uid, userType);
        if (parseInt(uid) !== parseInt(item.createruid) && userType !== 'root') {
            message.error("只能删除自己创建的投票！");
            return;
        }

        const postData = {
            iid: item.iid,
        };

        console.log(postData);

        fetch(`${url_server}/api/deleteinv`, {
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
                console.log(data);
                message.success('删除投票成功！');
                this.props.handleInvRedirect();
            }
        }).catch(() => {
            console.log('error!');
        });
    };

    render() {
        const DeleteIconText = ({ type, text, item }) => (
            <Popconfirm onConfirm={() => { this.handleDelete(item); }} title="确定要删除吗" icon={<Icon type="question-circle-o" style={{ color: 'orange' }} />}>
                <span style={{ cursor: "pointer" }}>
                    <Icon type={type} style={{ marginRight: 8 }} />
                    {text}
                </span>
            </Popconfirm>
        );
        const Chart = createG2(chart => {
            chart.axis('option', {
                title: '选项'
            });
            chart.axis('num', {
                title: '票数'
            });

            chart.coord('rect').transpose();
            chart.interval().position('option*num').color('option').label('num', {
                textStyle: {
                    fill: '#8d8d8d'
                },
                offset: 10
            });
            chart.legend(false);
            chart.tooltip({
                map: {
                    title: 'option',
                    name: '票数',
                    value: 'num'
                }
            });
            chart.render();
        });
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
                    <Paragraph>
                        <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginRight: "10px" }}>{this.state.data && this.state.data.createrName.substring(0, 1)}</Avatar>
                        <Text>{this.state.data && this.state.data.createrName} 创建于 {this.state.data && moment(this.state.data.inv.createdAt).format('YYYY-MM-DD HH:mm:ss')}  </Text>
                        <DeleteIconText type="delete" text="删除" item={this.state.data && this.state.data.inv} />
                    </Paragraph>
                    <Paragraph className="paragraph">
                        {(this.state.data && this.state.data.inv.description) || ''}
                    </Paragraph>
                </Typography>
                <Layout className="chart">
                    <Chart
                        data={this.state.chartData}
                        forceFit={true}
                        width={this.state.width}
                        height={this.state.height}
                        plotCfg={this.state.plotCfg}
                    />
                </Layout>
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
    };


    render() {
        const sub_props = {
            changeShow: this.changeShow,
            iid: this.props.iid,
            userType: this.props.userType,
            handleInvRedirect: this.props.handleInvRedirect,
            handleGoLogin: this.props.handleGoLogin,
        };

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
    };

    handleGoLogin = () => {
        this.props.history.push('/login');
    };

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
