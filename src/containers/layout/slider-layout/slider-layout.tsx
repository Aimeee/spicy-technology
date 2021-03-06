import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import * as PropTypes from 'prop-types';
import { NavLink} from 'react-router-dom';
import { ENVConfig } from '../../../environment/environment';
import { connect } from 'react-redux';
import { ISubmenu } from '../interface';
import Breadcrumb from '../../../component/breadcrumb/breadcrumb';
import './slider-layout.scss';
/** 
 * Todo 这一部分暂时是写死的
 * mock数据
 */
import { mockApi } from '../../../_mock/mockApi';

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

class SlideLayout extends React.Component<any, any>  {
    static propTypes = {
        // getGlobalData: PropTypes.func.isRequired,
        location: PropTypes.object
        // loadUserInfo: PropTypes.func.isRequired
    };

    constructor(public props: any) {
        super(props);

        this.state = {
            collapsed: false,
            menu: [],
            isLoadingMenu: false
        };
    }

    public componentDidMount() {
        this.loadMenu();
    }

    /** 加载菜单 */
    public loadMenu() {
        this.setState({
            isLoadingMenu: true
        });

        mockApi.slideMenuList.post({}, {}).then(res => {
            if (res.status === 200) {
                const menu: any[] = res.data || [];
                this.setState({
                    menu,
                    isLoadingMenu: false
                });
            }
        });
    }

    public toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    /** 构建副菜单 */
    public buildSubMenu = (item: any) => {
        if (item.children) {
            const subTitle = <span><Icon type={item.tags} />{item.title}</span>;

            return <SubMenu key={item.key} title={subTitle}>
                        {
                            item.children.map((child: ISubmenu) => {
                                return child.children && child.children.length > 0 ? 
                                        child.children.map((c: ISubmenu) => {
                                            return this.buildSubMenu(c);
                                        }) :
                                        <Menu.Item key={child.key}>
                                            <Icon type={child.tags || "tags"} />
                                            <span className="span-link">
                                                <NavLink className="selected" to={child.path}>{child.title}</NavLink>
                                            </span>
                                        </Menu.Item>
                            })
                        }
                    </SubMenu>
        } else {
            return <Menu.Item key={item.key}>
                        <Icon type={item.tags || "tags"} />
                        <span className="span-link">
                            <NavLink className="selected" to={item.path}>{item.title}</NavLink>
                        </span>
                    </Menu.Item>;
        }
    }

    public render() {
        const { location } = this.props; //  userInfo, 
        const slideMenu: ISubmenu[] = this.state.menu || [];
        return (
            <Layout>
                <Sider trigger={null} collapsible={true} collapsed={this.state.collapsed}>
                    <div className="logo">
                        <img alt="logo" src={ENVConfig.siderLogo} />
                    </div>
                    <Menu className="menuList-box" theme="dark" mode="inline" defaultSelectedKeys={['3']}>
                        {
                            slideMenu.length > 0 ? slideMenu.map((menu: ISubmenu) => {
                                return this.buildSubMenu(menu);
                            }) : <Menu.Item key="1">
                                    <Icon type="home" />
                                    <span className="span-link">
                                        <NavLink className="selected" to='/home'>home</NavLink>
                                    </span>
                                </Menu.Item>
                        }
                    </Menu>
                </Sider>

                <Layout className={this.props.collapse ? 'kisure-ant-layout-main-collapse' : 'kisure-ant-layout-main'}>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <div className="header-box">
                            <div className="header-icon">
                                <Icon
                                    className="trigger"
                                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                    onClick={this.toggle}/>
                            </div>
                            {
                                ENVConfig.headTitle && <div className="header-title">{ENVConfig.headTitle}</div>
                            }
                        </div>
                    </Header>
                    <Content style={{overflow:'auto',textAlign:'center'}}>
                        <Breadcrumb className='kisure-breadcrumb' menu={slideMenu} location={location} />
                        <div className='kisure-antd-layout-content'>
                            { this.props.children }
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        { ENVConfig.footerText }
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        // menu: state.saasCommon.menu
    }
}

function mapDispatchToProps() {
    return { }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps()
)(SlideLayout);