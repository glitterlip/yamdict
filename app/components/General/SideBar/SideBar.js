import { Icon, Layout, Menu } from 'antd';

import { Link } from 'react-router-dom';
import React from 'react';
import routes from '../../../constants/routes';
import style from './SideBar.css';

const { SubMenu } = Menu;
const { Sider } = Layout;
const SideBar = () => {
  const ROUTEARR = Object.keys(routes).map(item => {
    return {
      key: item,
      children: routes[item].children ? routes[item].children : null,
      path: routes[item].path,
      icon: routes[item].icon,
      type: routes[item].type,
      name: routes[item].name
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
              key={item.path}
              title={
                <span>
                  <Icon type={item.icon} />
                  {item.name}
                </span>
              }
            >
              {item.children.map(child => {
                return (
                  <Menu.Item key={child.name}>
                    <Link to={child.path} className={style.link}>
                      <Icon type={child.icon} />
                      {child.name}
                    </Link>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        })}
      </Menu>
    </Sider>
  );
};
export default SideBar;
