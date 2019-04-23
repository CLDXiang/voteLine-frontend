import React, { Component } from 'react';
import { Link, Route, BrowserRouter, withRouter } from 'react-router-dom';
import { Layout, Icon, Input, Switch, Radio, Checkbox, Typography, message, Tabs, Tooltip, DatePicker, Cascader, Select, Row, Col, Spin, Button, AutoComplete, Modal, PageHeader,List, Avatar, Skeleton, BackTop } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import './SearchPage.css';
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

class ResultsBar extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: false,
            hasMore: true,
            startIndex: 0,
        }
    }

    count = 100;

    componentDidMount() {
        this.fetchData((res) => {
            this.setState({
                data: res.results,
            });
        });
    }

    fetchData = (callback) => {
        const postData = {
            count: this.count,
            startIndex: this.state.startIndex,
            itype: "",
            "pattern": this.props.pattern,
            "orderBy": "new",
        }

        console.log(postData);

        fetch('http://localhost:3001/api/getinvlist', {
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
                this.setState({
                    startIndex: this.state.startIndex + this.count,
                });
                callback(data);
            } else {
                message.success('这就是全部了~');
                this.setState({
                    hasMore: false,
                })
            }
        }).catch(() => {
            console.log('error!');
        });
    }

    handleInfiniteOnLoad = () => {
        let data = this.state.data;
        this.setState({
            loading: true,
        });
        if (!this.state.hasMore) {
            message.warning('这就是全部了~');
            this.setState({
                loading: false,
            });
            return;
        }
        this.fetchData((res) => {
            data = data.concat(res.results);
            this.setState({
                data,
                loading: false,
            });
        });
    }

    render() {
        const IconText = ({ type, text }) => (
            <span>
                <Icon type={type} style={{ marginRight: 8 }} />
                {text}
            </span>
        );
        return (
            <Layout className="inv-form" >
                <Typography >
                    <Title className="title" level={3}>
                        标题中有“{ this.props.pattern }”的投票：
                    </Title>
                </Typography>
                <div className="SearchResult">
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        dataSource={this.state.data}
                        itemLayout="vertical"
                        renderItem={item => (
                            <List.Item actions={[<IconText type="star-o" text="收藏" />, <IconText type="like-o" text="喜欢" />, <IconText type="message" text="评论" />, <div><Icon type="fire" theme="twoTone" twoToneColor="orange" /> 投票人数：{item.votercount}</div>]}>
                                <Skeleton avatar title={false} loading={item.loading} active>
                                    <List.Item.Meta
                                        title={<Link to={`/inv/${item.iid}`}>{item.title}</Link>}
                                        description={item.description}
                                    />
                                </Skeleton>
                            </List.Item>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div className="LoadingContainer">
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
            </Layout>

        );
    }

}


class SearchBar extends Component {
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
            pattern: this.props.pattern,
        }

        return (
            <Content className="SearchContent" >
                <ResultsBar {...sub_props} />
            </Content>

        );
    }
}

class SearchPage extends Component {
    render() {
        const pattern = this.props.match.params.pattern || '';

        return (
            <Layout className="SearchPage">
                <HeadBar />
                <Layout className="SearchMain">
                    <SearchBar pattern={pattern} />
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(SearchPage);
