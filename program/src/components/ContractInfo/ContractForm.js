import React, { Fragment } from "react";
import UUID from "uuid";
import {
  Form,
  Input,
  Button,
  Card,
  DatePicker,
  Upload,
  Icon,
  message,
  Divider
} from "antd";
import { QINIU_SERVER, FILE_SERVER } from "../../constant/config";
import { getFileSuffix } from "../../utils/tools";
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
@Form.create({
  mapPropsToFields(props) {
    const fields = {};
    if (props) {
      Object.keys(props).forEach(key => {
        fields[key] = Form.createFormField({
          value: props[key]
        });
      });
    }
    return { ...fields };
  },
  onValuesChange(props, values) {
    props.onChange(values);
  }
})
export default class ContractForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadToken: {},
      fileList: []
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.contract_urls) {
      this.setState({
        fileList: [nextProps.contract_urls]
      });
    }
  }
  beforeUpload = currFile => {
    const suffixArr = currFile.name.split(".");
    const suffix = suffixArr[suffixArr.length - 1].toLowerCase();
    if (suffix !== "pdf") {
      message.warning("文件格式不正确");
      return false;
    }
    const isLt2M = currFile.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.warning("图片大小必须小于5M!");
      return false;
    }
    const { upload_token } = this.props;
    let cadId = UUID().replace(/-/g, "");
    this.setState({
      uploadToken: {
        token: upload_token,
        key: `contract/cad/${cadId}.${getFileSuffix(currFile.name)}`
      }
    });
  };
  removePdf = () => {
    const { form } = this.props;
    this.setState({
      fileList: []
    });
    form.resetFields(["contract_urls"]);
  };
  normFile = e => {
    console.log("Upload event:", e);
    if (e.file.status) {
      if (e.file.response) {
        e.file.url = `${FILE_SERVER}${e.file.response.key}`;
      }
      this.setState({
        fileList: [e.file]
      });
    } else {
      return this.state.fileList[0];
    }
    if (e.file.status === "done") {
      message.success("上传成功", 1);
      return e && e.file;
    } else if (e.file.status === "error") {
      message.error("上传失败");
      this.setState({
        fileList: []
      });
    }
  };
  render() {
    const { onFormSubmit, form, isChooseCompany, id } = this.props;
    const { getFieldDecorator } = form;
    const { uploadToken, fileList } = this.state;
    const formItemLayout = {
      labelCol: {
        md: { span: 7 },
        xs: { span: 7 }
      },
      wrapperCol: {
        md: { span: 11 },
        xs: { span: 11 }
      }
    };
    return (
      <Fragment>
        <Form onSubmit={e => onFormSubmit(form, e)}>
          <Card bordered={false}>
            {id ? null : (
              <FormItem label="企业信息" {...formItemLayout}>
                <Button type="primary" onClick={this.props.showModal}>
                  {isChooseCompany ? "重选企业" : "选择企业"}
                </Button>
              </FormItem>
            )}
            <FormItem
              label="企业名称"
              {...formItemLayout}
              style={{ display: "none" }}
            >
              {getFieldDecorator("id")(<Input disabled />)}
            </FormItem>
            <FormItem label="企业名称" {...formItemLayout}>
              {getFieldDecorator("company")(<Input disabled />)}
            </FormItem>
            <FormItem label="法人" {...formItemLayout}>
              {getFieldDecorator("legal")(<Input disabled />)}
            </FormItem>
            <FormItem label="账号" {...formItemLayout}>
              {getFieldDecorator("username")(<Input disabled />)}
            </FormItem>
            <FormItem label="手机" {...formItemLayout}>
              {getFieldDecorator("mobile")(<Input disabled />)}
            </FormItem>
            <FormItem label="联系邮箱" {...formItemLayout}>
              {getFieldDecorator("email")(<Input disabled />)}
            </FormItem>
          </Card>
          <Card bordered={false} style={{ marginTop: 30 }}>
            <FormItem label="合同类型" {...formItemLayout}>
              {getFieldDecorator("contract_type", {
                rules: [
                  { required: true, message: "请输入合同类型" },
                  {
                    max: 50,
                    message: "请确保输入长度小于50"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="合同编号" {...formItemLayout}>
              {getFieldDecorator("contract_no", {
                rules: [
                  { required: true, message: "请输入合同编号" },
                  {
                    max: 50,
                    message: "请确保输入长度小于50"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="合同有效期" {...formItemLayout}>
              {getFieldDecorator("create_time", {
                rules: [{ required: true, message: "请选择合同有效期" }]
              })(<RangePicker />)}
            </FormItem>
            <FormItem label="合同电子档" {...formItemLayout}>
              {getFieldDecorator("contract_urls", {
                valuePropName: "file",
                getValueFromEvent: this.normFile,
                rules: [{ required: true, message: "请上传文件" }]
              })(
                <Upload
                  name="file"
                  action={QINIU_SERVER}
                  data={uploadToken}
                  beforeUpload={this.beforeUpload}
                  fileList={this.state.fileList}
                  onRemove={this.removePdf}
                >
                  <Button
                    style={{
                      border: "1px solid #b3d8ff",
                      color: "#409eff",
                      background: "#ecf5ff"
                    }}
                  >
                    <Icon type="upload" />
                    {fileList.length ? "重新上传" : "上传"}
                  </Button>
                </Upload>
              )}
              <div style={{ fontSize: "12px" }}>
                （请上传合同扫描件的PDF文件，文件大小不大于5M）
              </div>
            </FormItem>
            <div style={{ textAlign: "center", margin: "20px 0 40px 0" }}>
              <Button type="primary" htmlType="submit">
                {id ? "确认修改" : "确认提交"}
              </Button>
            </div>
          </Card>
        </Form>
      </Fragment>
    );
  }
}
