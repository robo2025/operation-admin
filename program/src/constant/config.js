/*
* 后台管理系统常量：
* */

// 单点登录URL
export const URL = 'https://login.robo2025.com';

// 网站内容接口URL
export const API_URL = 'https://api.robo2025.com/scm/operation';


// 操作日志URL
export const OPERATION_URL = 'https://api.robo2025.com/scm';

// 上传文件获取token URL
export const UPLOAD_URL = 'https://api.robo2025.com/common';

// 用户管理系统API URL
export const USERS_URL = 'https://api.robo2025.com/user/service';

export const MAIN_URL = '//api.robo2025.com';

// 用户管理系统URL
export const USERS_SERVER = '//api.robo2025.com/user';

// 方案中心URL
export const SOLUTION_URL = '//api.robo2025.com/slncenter';

// 方案订单接口
export const SLN_ORDER_URL = '//api.robo2025.com/sln-order';
// export const SLN_ORDER_URL = 'http://192.168.2.109:9009';

// 订单系统接口
export const ORDERS_URL = 'https://api.robo2025.com/order';
// export const ORDERS_URL = 'http://192.168.2.109:8009';

// 验证登录接口URL
export const LOGIN_URL = `${URL}/server/authorize`;

// 注册接口URL
export const REGISTER_URL = `${URL}/register`;

// 登录接口URL
export const LOGOUT_URL = `${URL}/logout`;

// 静态web服务器地址,端口和地址必须要写，80端口可不写
const myHost = `${window.location.protocol}//${window.location.host}`;

// 前端登录验证URL
export const NEXT_URL = `${myHost}/#/test`;

// 前端首页URL
export const HOME_PAGE = `${myHost}/#/product/menu`;

// 前端验证URL
export const VERIFY_PAGE = `${myHost}/#/test`;

// 七牛云上传地址
export const QINIU_SERVER = '//upload.qiniup.com';

// 文件服务器URL
export const FILE_SERVER = '//imgcdn.robo2025.com/';

// 七牛云上传地址

// 分页：每页显示多少记录
export const PAGE_SIZE = 10;

// 接口请求状态码
export const SUCCESS_STATUS = 10000; // 操作成功
export const FAIL_STATUS = 10001; // 操作失败
export const NO_TOKEN = 20001; // token不存在
export const EXPIRED_TOKEN = 20002; // token过期
export const ILLEGAL_TOKEN = 20003; // 非法token
export const LOGIN_TIMEOUT = 20004; // 登录超时
export const NO_AUTH = 30001; // 无权限
