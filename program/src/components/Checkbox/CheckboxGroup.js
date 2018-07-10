import React, { PureComponent } from 'react';
import { Checkbox, Row, Col } from 'antd';

import styles from './checkbox-group.less';

const plainOptions = ['pno', 'product_name', 'brand_name', 'registration_place', 'category', 'english_name', 'spec', 'creator', 'created_time', 'model_count'];

// 产品导出数据选择项目
export default class CheckboxGroup extends PureComponent {
    state = {
        checkedList: [],
    }
    componentWillReceiveProps(nextProps) {
        console.log('接受参数', nextProps);
        this.setState({
            checkedList: nextProps.isCheckAll ? plainOptions : nextProps.checkedList,
        });
    }
    onChange = (checkedList) => {
        this.props.onChange(checkedList);
    }

    render() {
        return (
            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} value={this.state.checkedList}>
                {/* <Row className={styles['tips-row']}>
                    <Col span={24} className="tips">请选择导出项目：</Col>
                </Row> */}
                <Row className={styles['checkbox-row']}>
                    <Col span={6}><Checkbox value="pno">产品ID</Checkbox></Col>
                    <Col span={6}><Checkbox value="product_name">产品名称</Checkbox></Col>
                    <Col span={6}><Checkbox value="brand_name">品牌</Checkbox></Col>
                    <Col span={6}><Checkbox value="registration_place">产地</Checkbox></Col>
                    <Col span={6}><Checkbox value="category">所属类目</Checkbox></Col>
                    <Col span={6}><Checkbox value="english_name">英文名</Checkbox></Col>
                    <Col span={6}><Checkbox value="spec">规格参数项</Checkbox></Col>
                    <Col span={6}><Checkbox value="creator">创建人</Checkbox></Col>
                    <Col span={6}><Checkbox value="created_time">创建时间</Checkbox></Col>
                    <Col span={7}><Checkbox value="model_count">已有产品型号条数</Checkbox></Col>
                </Row>
            </Checkbox.Group>
        );
    }
}
