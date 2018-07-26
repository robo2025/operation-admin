import { querySuppliers, queryDetail, accountAudit } from '../services/supAudit';

export default {
  namespace: 'supAudit',

  state: {
    supplierList: [],
    profile: {},
    pagination: { current: 1, pageSize: 10 },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const pagination = yield select((state) => {
        return state.supAudit.pagination;
      });
      const { current, pageSize } = pagination;
      const params = {
        offset: (current - 1) * pageSize,
        limit: pageSize,
      };
      const response = yield call(querySuppliers, {
        ...payload,
        ...params,
      });
      const { data, headers, rescode } = response;
      if (rescode === '10000') {
        const dataWithKey = data.map((item) => {
          return { ...item, key: item.id };
        });
        yield put({
          type: 'save',
          payload: dataWithKey,
        });
      } else {
        yield put({
          type: 'save',
          payload: data,
        });
      }
      const newPagination = {
        ...pagination,
        total: parseInt(headers['x-content-total'], 10),
      };
      yield put({
        type: 'savePagination',
        payload: newPagination,
      });
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryDetail, { id: payload });
      yield put({
        type: 'saveProfile',
        payload: { ...response.data },
      });
      const { rescode, data, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, data);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    *accountAudit({ payload, callback }, { call, put }) {
      const response = yield call(accountAudit, { ...payload });
      const { rescode, msg } = response;
      if (rescode === '10000') {
        if (callback) {
          callback(true, msg);
        }
      } else if (callback) {
        callback(false, msg);
      }
    },
    
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        supplierList: payload,
      };
    },
    savePagination(state, { payload }) {
      return {
        ...state,
        pagination: payload,
      };
    },
    saveProfile(state, { payload }) {
      return {
        ...state,
        profile: payload,
      };
    },
  },
};