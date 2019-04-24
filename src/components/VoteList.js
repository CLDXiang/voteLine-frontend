import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List, Avatar, Button, Skeleton, BackTop, Spin, message, Icon, Popconfirm } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import './VoteList.css';

message.config({
    top: 96,
});

class VoteList extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            loading: false,
            hasMore: true,
            startIndex: 0,
        }
    }

    count = 10;

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
            itype: this.props.itype,
            "pattern": "",
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
        }

        console.log(postData);

        fetch('http://localhost:3001/api/deleteinv', {
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
                this.setState({
                    data: [],
                    loading: false,
                    hasMore: true,
                    startIndex: 0,
                });
                this.fetchData((res) => {
                    this.setState({
                        data: res.results,
                    });
                });
            }
        }).catch(() => {
            console.log('error!');
        });
    }



    render() {
        const IconText = ({ type, text }) => (
            <span >
                <Icon type={type} style={{ marginRight: 8 }} />
                {text}
            </span>
        );
        const DeleteIconText = ({ type, text, item }) => (
            <Popconfirm onConfirm={() => { this.handleDelete(item); }} title="确定要删除吗" icon={<Icon type="question-circle-o" style={{ color: 'orange' }} />}>
                <span >
                    <Icon type={type} style={{ marginRight: 8 }} />
                    {text}
                </span>
            </Popconfirm>
        );
        return (
            <div className="InfiniteContainer">
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
                            <List.Item actions={[
                                <IconText type="star-o" text="收藏" />,
                                <IconText type="like-o" text="喜欢" />,
                                <IconText type="message" text="评论" />,
                                <DeleteIconText type="delete" text="删除" item={item} />,
                                <div><Icon type="fire" theme="twoTone" twoToneColor="orange" /> 投票人数：{item.votercount}</div>
                            ]}>
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
        );
    }
}


export default VoteList;