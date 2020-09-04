import React,{ Component, Fragment } from "react";
import "./index.scss";
// antd
import { Form, Input, Button, Row, Col, message } from 'antd';
import { UserOutlined, UnlockOutlined } from '@ant-design/icons';
// 验证
import { validata_password } from '../../utils/validata';
// api
import { Login } from "../../api/account";
//组件
import Code from "../../components/code/index";
// 加密
import CryptoJs from "crypto-js";
class LoginForm extends Component{
    constructor(){
        super();
        this.state = {
            username: "",
            password: "",
            code: "",
            module: "login",
            loginLoading: false
        };    
    };

    toggleForm = () => {
        this.props.switchFrom("register");
    }
    // 登录
    onLogin = (values) => {
        const loginData = {
            username: this.state.username,
            password: CryptoJs.MD5(this.state.password).toString(),
            code: this.state.code,
        }
        console.log('登录参数', loginData);
        this.setState({
            loginLoading:true
        })
        // return false
        Login(loginData).then(res =>{
            this.setState({
                loginLoading:false
            })
            // console.log(res)
            if ( res.data.resCode === 0 ) {
                message.success(res.data.message);
            } else if ( res.data.resCode === 1004 ) {
                message.error(res.data.message);
            }
        }).catch(error => {
            // console.log(error)
        })
    };
    // 输入change
    inputChangeUsername = (e) => {
        let value = e.target.value;
        this.setState({
            username:value
        })
    };
    inputChangePassword = (e) => {
        let value = e.target.value;
        this.setState({
            password:value
        })
    };
    inputChangeCode = (e) => {
        let value = e.target.value;
        this.setState({
            code:value
        })
    };
    
    render(){
        const { username, module } = this.state;
        // const _this = this;
        return (
            <Fragment>
                <div className="from-header">
                    <h4 className="column">登录</h4>
                    <span onClick={this.toggleForm}>账号注册</span>
                </div>
                <div className="from-content">
                    <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onLogin}
                    >
                    <Form.Item name="username" rules={[
                        { required: true, message: '请输入邮箱！' },
                        { type: "email", message: '邮箱格式有误！' }
                        // ({ getFieldValue }) => ({
                        //     validator(rule, value) {
                        //       if (validata_email(value)) {
                        //           _this.setState({
                        //             code_btn_disabled:false,
                        //           })
                        //         return Promise.resolve();
                        //       } 
                        //         return Promise.reject('邮箱格式有误!');
                        //     },
                        // }),
                    ]} >
                        <Input 
                            value={ username } 
                            onChange={this.inputChangeUsername} 
                            prefix={<UserOutlined className="site-form-item-icon" />} 
                            placeholder="邮箱" 
                        />
                    </Form.Item>

                    <Form.Item name="password" rules={[
                        { required: true, message: '请输入密码！' },
                        { pattern: validata_password, message: "请输入数字+字母、长度大于6小于16的密码！"}
                    ]} >
                        <Input onChange={this.inputChangePassword}  type="password" prefix={<UnlockOutlined className="site-form-item-icon" />} placeholder="密码" />
                    </Form.Item>

                    <Form.Item name="Code" rules={[
                        { required: true, message: '请输入验证码！' },
                        { len:6, message: "验证码为6位"}
                    ]}>
                        <Row gutter={13}>
                            <Col span={15}>
                                <Input onChange={this.inputChangeCode}  prefix={<UnlockOutlined className="site-form-item-icon" />} placeholder="验证码" />
                            </Col>
                            <Col span={9}>
                                <Code username={username} module={module} />
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item>
                        <Button 
                        type="primary"
                        block 
                        htmlType="submit" 
                        className="login-form-button"
                        loading={this.state.loginLoading}
                        >登录</Button>
                    </Form.Item>
                    </Form>
                </div>
            </Fragment>
        )
    }
}

export default LoginForm;