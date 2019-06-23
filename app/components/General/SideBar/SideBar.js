import { Icon, Layout, Menu } from 'antd';

import { Link } from 'react-router-dom';
import React from 'react';
import routes from '../../../constants/routes';
import style from './SideBar.css';

const { SubMenu } = Menu;
const { Sider } = Layout;
const SideBar = () => {
  const ROUTEARR = Object.keys(routes).map((item, key) => {
    return {
      key,
      path: item.path,
      icon: item.icon,
      type: item.type,
      name: item.name
    };
  });

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        {ROUTEARR.map(item => {
          return item.type === 'single' ? (
            <Menu.Item key={item.key}>
              <Link to={item.path} className={style.link}>
                <Icon type={item.icon} />
                {item.name}
              </Link>
            </Menu.Item>
          ) : (
            <SubMenu
              key="sub3"
              title={
                <span>
                  <Icon type="notification" />
                  单词本
                </span>
              }
            >
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          );
        })}
      </Menu>
    </Sider>
  );
};
export default SideBar;
