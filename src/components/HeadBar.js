import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Input, Menu, Icon, message } from 'antd';
import './HeadBar.css';
import logoImg from '../assets/logo.png';

const { SubMenu } = Menu;
const { Header } = Layout;
const Search = Input.Search;


class HeadBar extends Component {
  constructor() {
    super();
    this.state = {
      nickname: window.sessionStorage.getItem('nickname') || '',
      userType: window.sessionStorage.getItem('userType') || 'visitor',
    };
  }

  handleLogout = () => {
    window.sessionStorage.removeItem('nickname');
    window.sessionStorage.removeItem('userType');
    this.setState({
      nickname: null,
      userType: 'visitor',
    });
  };

  handleSearch = async (pattern) => {
    if (!pattern) {
      message.warning('请输入要搜索的内容噢！');
    } else {
      await this.props.history.push('/');
      await this.props.history.push(`/search/${pattern}`);
    }
  };

  render() {
    const { userType, nickname } = this.state;

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
            onSearch={pattern => { this.handleSearch(pattern); }}
          />
        </div>
        <div className="UserInfo">
          <Menu mode="horizontal" selectable={false}>
            {((userType === 'normal' || userType === 'root')
              && <SubMenu key="user" style={{ borderBottom: "0" }} title={<span><Icon type="user" /> {(this.state.userType === 'root' && "管理员") || (this.state.userType === 'normal' && "普通会员")} {nickname || ''}</span>}>
                <Menu.Item key="logout" onClick={this.handleLogout}>退出</Menu.Item>
              </SubMenu>)
              || <Menu.Item key="user" style={{ borderBottom: "0" }}><Link to='/login'><Icon type="user" /> {"点这里登录哦！"}</Link></Menu.Item>}
          </Menu>
        </div>
      </Header>
    );
  }
}

export default withRouter(HeadBar);
