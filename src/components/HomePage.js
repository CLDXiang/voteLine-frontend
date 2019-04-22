import React, { Component } from 'react';
import { Link, Route, BrowserRouter, Switch } from 'react-router-dom';
import { Layout, Input, Menu, Icon, Typography, Tabs, Button } from 'antd';
import './HomePage.css';
import HeadBar from './HeadBar';
import VoteList from './VoteList';

const { Content, Sider } = Layout;
const { Title } = Typography;
const TabPane = Tabs.TabPane;


class ContentBar extends Component {
  render() {
    return (
      <Content className="Content">
        <Title level={4} style={{ color: "orange" }}><Icon type="fire" theme="twoTone" twoToneColor="red" /> 热门投票</Title>
        <Tabs defaultActiveKey="1" onChange={() => { }} style={{ flex: 1 }}>

          <TabPane tab={<span><Icon type="weibo" />热点讨论</span>} key="1"><VoteList /></TabPane>
          <TabPane tab={<span><Icon type="pie-chart" />问卷调查</span>} key="2">问卷调查</TabPane>
          <TabPane tab={<span><Icon type="team" />活动投票</span>} key="3">活动投票</TabPane>
          <TabPane tab={<span><Icon type="profile" />杂七杂八</span>} key="4">杂七杂八</TabPane>
        </Tabs>
      </Content>
    );
  }
}

class SideBar extends Component {
  render() {
    return (
      <Sider width="300" theme="light" className="Sider">
        <Menu selectable={false}>
          <Menu.Item key="createInv" style={{ borderBottom: "0" }}>
            <Link to='/newinv'><Icon type="form" /> 发起投票</Link>
          </Menu.Item>
          <Menu.Item key="myInv" style={{ borderBottom: "0" }}>
            <Link to='/'><Icon type="bar-chart" /> 查看我发起的投票</Link>
          </Menu.Item>
          <Menu.Item key="myVote" style={{ borderBottom: "0" }}>
            <Link to='/'><Icon type="book" /> 查看我的投票</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}


class HomePage extends Component {
  render() {
    return (
      <Layout className="HomePage">
        <HeadBar />
        <Layout className="Main">
          <SideBar />
          <ContentBar />
        </Layout>
      </Layout>
    );
  }
}

export default HomePage;
