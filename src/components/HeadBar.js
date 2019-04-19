import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Input, Menu, Icon } from 'antd';
import './HeadBar.css';
import logoImg from '../assets/logo.svg';

const { Header } = Layout;
const Search = Input.Search;



class HeadBar extends Component {
    constructor() {
        super();
        this.state = {
            userName: window.sessionStorage.getItem('userName') || null,
            userType: window.sessionStorage.getItem('userType') || 'visitor',
        };
    }

    render() {
      return (
        <Header className="Header">
          <div className="Logo"><img src={logoImg} alt="" /></div>
          <div className="Navigation">
            <Menu mode="horizontal" selectable={false}>
              <Menu.Item key="home" style={{ borderBottom: "0" }}>
                <Link to='/'><Icon type="home" /> 首页</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className="SearchBar">
            <Search
              placeholder="搜索想要的内容"
              onSearch={value => console.log(value)}
            />
          </div>
          <div className="UserInfo">
            <Menu mode="horizontal">
              <Menu.Item key="user" style={{ borderBottom: "0" }}>
                <Link to='/login'><Icon type="user" /> {(this.state.userType==='root' && "管理员") || '游客'} {this.state.userName || ''}</Link>
              </Menu.Item>
            </Menu>
          </div>
        </Header>
      );
    }
  }

  export default HeadBar;
  