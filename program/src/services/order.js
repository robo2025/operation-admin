import Cookies from 'js-cookie';
import qs from 'qs';
import { ORDERS_URL } from '../constant/config';
import lyRequest from '../utils/lyRequest';

const ORDER_SYS_URL = `${ORDERS_URL}/v1/chief`;
const SUPPLIER_SYS_URL = `${ORDERS_URL}/v1/supplier`;
const ORDER_URL = `${ORDERS_URL}/v1/order`;

// ------------------ 请求订单信息---------------------

/**
 *  获取服务器客户订单列表
*/
export async function queryOrders({ offset = 0, limit = 10 }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}


/**
 * 获取服务器异常订单列表
 */
export async function queryExceptionOrders({ offset = 0, limit = 10 }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order?is_type=1&offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}


/**
 * 获取服务器订单详情
 */
export async function queryOrderDetail({ orderId }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}

/**
 * 取消订单接口
 */
export async function queryCancelOrder({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'delete',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}

/**
 * 无货同意并退款接口
 */
export async function queryAgreeNoGood({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}

/**
 * 无货驳回接口
 * 
 */
export async function queryRejectNoGood({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}


// 同意延期接口
export async function queryAgreeDelay({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}

// 驳回延期接口
export async function queryRejectDelay({ orderId, data }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order/${orderId}`, {
    method: 'put',
    headers: {
      Authorization: accessToken,
    },
    data: {
      ...data,
    },
  });
}

/**
 * 搜索接口
 * 
 */
export async function querySearchResults({ offset = 0, limit = 10, params }) {
  const accessToken = Cookies.get('access_token');
  return lyRequest(`${ORDER_SYS_URL}/order?offset=${offset}&limit=${limit}&${qs.stringify(params)}`, {
    headers: {
      Authorization: accessToken,
    },
  });
}
