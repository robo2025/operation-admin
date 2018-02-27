import React, { Component } from 'react';
import { Form, Spin, Cascader, Input, Row, Col, Upload, Icon, Modal, Button, Tabs, message } from 'antd';
import RichEditor from '../../components/RichEditor/RichEditor';
import { checkFile, getFileSuffix } from '../../utils/tools';

import styles from './product-info.less';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const FILE_TYPES = ['jpg', 'png', 'gif', 'jpeg']; // 支持上传的文件类型

function getStanrdCatalog(data) {
  data.forEach((val) => {
    val.value = val.id;
    val.label = val.category_name;
    if (val.children.length > 0) {
      getStanrdCatalog(val.children);
    }
  });
}

@Form.create({
  mapPropsToFields(props) {
    const { data } = props;
    const fields = {};
    Object.keys(data).forEach((key) => {
      fields[key] = Form.createFormField({
        value: data[key],
      });
    });
    return {
      ...fields,
    };
  },
  onValuesChange(props, values) {
    props.onChange(values);
  },
})
class ProductForm extends Component {
  constructor(props) {
    super(props);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.handleUploaderChange = this.handleUploaderChange.bind(this);    
    this.state = {
      previewVisible: false,
      previewImage: '',
      file: { uid: '', name: '' },      
    };
  }

  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange(key, value) {
    const tempJson = {};
    tempJson[key] = value;
    this.props.onAttrChange(tempJson);
  }

   // 图片上传前处理：验证文件类型
   beforeUpload(key, file) {
    this.setState({ file });
    // console.log('before', file);
    if (checkFile(file.name, ['cad'])) {
      this.setState({ isCad: true });
    } else if (checkFile(file.name, FILE_TYPES)) {
      this.setState({ isPicture: true });
    }
    if (key === 'cad_url') {
      if (!checkFile(file.name, ['cad'])) {
        message.error(`${file.name} 暂不支持上传`);
        this.setState({ isCad: false });
        return false;
      } 
    } else if (!checkFile(file.name, FILE_TYPES)) {
      message.error(`${file.name} 暂不支持上传`);
      this.setState({ isPicture: false });
      return false;
    }
  }

  // cad和图片上传时处理
  handleUploaderChange(key, fileList) {
    console.log('文件上传', key, fileList);
    const { pics, cad_url } = this.state;
    const { onAttrChange } = this.props;
    // 如果上传的是cad文件
    if (key === 'cad_url' && this.state.isCad) {
      fileList.slice(-1).forEach((file) => {
        if (file.status === 'done') {
          this.setState({ cad_url: [...cad_url, file.response.key] });
          onAttrChange({ cad_url: [...cad_url, file.response.key] });
        }
      });
      return;
    }
    // 如果上传的是图片
    if (this.state.isPicture) {
      const tempJson = {};
      tempJson[key] = fileList;
      this.setState(tempJson);
      // console.log('状态改变', fileList);
      const that = this;
      // 上传成功，则将图片放入state里的pics数组内
      fileList.map((file) => {
        if (file.status === 'done') {
          message.success(`${file.name} 文件上传成功`);
          // that.setState({ file_url: file.response.key });
          if (key === 'a') {
            this.setState({ pics: [...pics, { img_type: '正面', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { img_type: '正面', img_url: file.response.key }] });
          } else if (key === 'b') {
            this.setState({ pics: [...pics, { img_type: '反面', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { img_type: '反面', img_url: file.response.key }] });
          } else if (key === 'c') {
            this.setState({ pics: [...pics, { img_type: '侧面', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { img_type: '侧面', img_url: file.response.key }] });
          } else if (key.substr(0, 1) === 'd') {
            this.setState({ pics: [...pics, { img_type: '包装图', img_url: file.response.key }] });
            onAttrChange({ pics: [...pics, { img_type: '包装图', img_url: file.response.key }] });
          }
        } else if (file.status === 'error') {
          message.error(`${file.name} 文件上传失败`);
        }
        return file;
      });
    } else if (this.state.isCad) {
      console.log('cad fileList', fileList);
    }
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 12 },
    };
    const UPLOAD_URL = '//up.qiniu.com'; // 文件上传地址
    const { getFieldDecorator } = this.props.form;
    const { data, catalog, loading, uploadToken } = this.props;
    const { category, cad_url } = data;
    const slectedCatagory = category ? [
      category.id,
      category.children.id,
      category.children.children.id,
      category.children.children.children.id,
    ] : [];
    const { previewVisible, previewImage, file } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    let uploaders = [];
    if (data.pics) {
      uploaders = data.pics.map(val => (
        <Col span={8} key={val.id}>
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            listType="picture-card"
            fileList={[{
              uid: -1,
              name: '测试',
              url: val.img_url,
            }]}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
          />
          <p className="upload-pic-desc">{val.img_type}</p>
        </Col>
      ));
    } else {
      return <Spin spinning={loading || true} />;
    }

    getStanrdCatalog(catalog);// 将服务器目录结构转换成组件标准结构
    const cadFileList = cad_url.map((val, idx) => ({
      uid: idx,
      name: 'cad图',
      status: 'done',
      reponse: '200', // custom error message to show
      url: val,
    }));
    console.log('产品详情', cadFileList);


    return (
      <div className={styles['product-info-wrap']} >
        {/* 产品主要属性 */}
        <div style={{ float: 'left', width: '50%' }}>
          <Form layout="horizontal">
            <FormItem
              label="所属分类"
              {...formItemLayout}
            >
              <Cascader
                defaultValue={slectedCatagory}
                options={catalog}
                placeholder="请您选择类目"
                onChange={(values) => { console.log('您选择的是', values); }}
              />
            </FormItem>
            <FormItem
              label="产品名称"
              {...formItemLayout}
            >
              {getFieldDecorator('product_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="产品ID"
              {...formItemLayout}
              style={{ display: 'none' }}
            >
              {getFieldDecorator('pno', {
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="型号"
              {...formItemLayout}
            >
              {getFieldDecorator('partnumber', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="品牌"
              {...formItemLayout}
            >
              {getFieldDecorator('brand_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="英文名"
              {...formItemLayout}
            >
              {getFieldDecorator('english_name', {
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              label="产地"
              {...formItemLayout}
            >
              {getFieldDecorator('prodution_place', {
              })(
                <Input />
              )}
            </FormItem>
          </Form>
          <Row gutter={24}>
            <Col span={24}>
              <FormItem
                label="CAD图"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 12 }}
              >
                <Upload
                  name="file"
                  action={UPLOAD_URL}
                  defaultFileList={cadFileList}
                  beforeUpload={(currFile) => { this.beforeUpload('cad_url', currFile); }}
                  onChange={({ fileList }) => { this.handleUploaderChange('cad_url', fileList); }}
                  data={
                    {
                      token: uploadToken,
                      key: `/product/${file.uid}.${getFileSuffix(file.name)}`,
                    }
                  }
                >
                  <Button icon="upload">上传</Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
        </div >
        {/* 产品图片 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal >
        <div style={{ float: 'left', width: 360 }}>
          <h3>产品图片</h3>
          <Row gutter={24}>
            {uploaders}
            {
              (data.pics && data.pics.length < 6) ?
                (
                  <Col span={8} >
                    <Upload
                       name="file"
                       action={UPLOAD_URL}
                       listType="picture-card"
                       onPreview={this.handlePreview}
                       beforeUpload={(currFile) => { this.beforeUpload('a', currFile); }}
                       onChange={({ fileList }) => { this.handleUploaderChange('a', fileList); }}
                       data={
                         {
                           token: uploadToken,
                           key: `/product/${file.uid}.${getFileSuffix(file.name)}`,
                         }
                       }
                    >
                      {uploadButton}
                    </Upload>
                    <p className="upload-pic-desc">包装图</p>
                  </Col>
                )
                : null
            }
          </Row>
        </div>
        {/* 商品描述、详情 */}
        <div style={{ clear: 'both' }} />
        <div className="good-desc">
          <Tabs defaultActiveKey="1" onChange={(key) => { console.log(key); }}>
            <TabPane tab="商品概述" key="1">
              <RichEditor
                onChange={(html) => { this.handleChange('summary', html); }}
                token={uploadToken}                
                defaultValue={data.summary}
              />
            </TabPane>
            <TabPane tab="商品详情" key="2">
              <RichEditor
                onChange={(html) => { this.handleChange('description', html); }}
                token={uploadToken}                                
                defaultValue={data.description}
              />
            </TabPane>
            <TabPane tab="常见问题FAQ" key="3" >
              <RichEditor
                onChange={(html) => { this.handleChange('faq', html); }}
                token={uploadToken}                                
                defaultValue={data.faq}
              />
            </TabPane>
          </Tabs>
        </div>
      </div >
    );
  }
}

export default ProductForm;
