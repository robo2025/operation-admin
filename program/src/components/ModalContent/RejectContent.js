/*
 * @Author: lll 
 * @Date: 2018-03-05 10:15:16 
 * @Last Modified by: lll
 * @Last Modified time: 2018-06-05 16:48:25
 */

import React, { PureComponent } from 'react';
import moment from 'moment';
import { Form, Row, Col, Input } from 'antd';

import styles from './modal-content.less';

const { TextArea } = Input;
const FormItem = Form.Item;

// 无货驳回弹出层内容 
@Form.create()
export default class RejectContent extends PureComponent {
  componentDidMount() {
    const { bindFormObj } = this.props;
    if (bindFormObj) {
      bindFormObj(this.props.form);
    }
  }

  render() {
    const { data } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div className={styles['modal-content']}>
        <Row>
          <Col span={12}>订单号：{data.son_order_sn}</Col>
          <Col span={12}>下单时间：{moment(data.add_time * 1000).format('YYYY-MM-DD h:mm')}</Col>
        </Row>
        <Row>
          <Col span={12}>客户公司名称：{data.guest_name}</Col>
        </Row>
        <Row>
          <Col span={12}>供应商公司名称：{data.supplier_name}</Col>
        </Row>
        <Row>
          <FormItem
            label="说明"
            {...formItemLayout}
          >
            {
              getFieldDecorator('desc', {
                rules: [{
                  required: true,
                  message: '你必须填写审核说明',
                }],
                initialValue: data.supplier_remarks || '',                
              })(
                <TextArea />
              )
            }
          </FormItem>
          {/* 以下是隐藏项 */}
          <FormItem
            label="无货驳回"
            {...formItemLayout}
            style={{ display: 'none' }}
          >
            {
              getFieldDecorator('status', {
                rules: [{
                  required: true,
                  message: '你必须填写审核说明',
                }],
                initialValue: 3,
              })(
                <input />
              )
            }
          </FormItem>
          <FormItem
            label="无货驳回"
            {...formItemLayout}
            style={{ display: 'none' }}
          >
            {
              getFieldDecorator('is_pass', {
                rules: [{
                  required: true,
                  message: '是否通过',
                }],
                initialValue: 0,
              })(
                <input />
              )
            }
          </FormItem>
        </Row>
        
      </div>
    );
  }
}
