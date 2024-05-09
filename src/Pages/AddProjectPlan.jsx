import { CloseOutlined, MinusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  DatePicker,
  Row,
  Col,
} from "antd";

const onFinish = (values) => {
  console.log("Received values of form:", values);
};
const AddProjectPlan = () => {
  const [form] = Form.useForm();
  return (
    <Form
      labelCol={{
        span: 6,
      }}
      wrapperCol={{
        span: 18,
      }}
      form={form}
      name="dynamic_form_complex"
      style={{
        maxWidth: 600,
      }}
      autoComplete="off"
      initialValues={{
        items: [{}],
      }}
      onFinish={onFinish}
    >
      <Form.List name="modules">
        {(fields, { add, remove }) => (
          <div
            style={{
              display: "flex",
              rowGap: 16,
              flexDirection: "column",
            }}
          >
            {fields.map((field) => (
              <Card
                size="small"
                title={`Module ${field.name + 1}`}
                key={field.key}
                extra={
                  <CloseOutlined
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                }
              >
                <Form.Item label="Module Id" name={[field.name, "module_id"]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Name" name={[field.name, "module_name"]}>
                  <Input />
                </Form.Item>
                <Row>
                  <Col>
                    <Form.Item
                      label="From Date"
                      name={[field.name, "from_date"]}
                    >
                      <DatePicker />
                    </Form.Item>
                  </Col>
                  <Col>
                    {" "}
                    <Form.Item label="To Date" name={[field.name, "to_date"]}>
                      <DatePicker />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Allocated Time"
                  name={[field.name, "allocated_time"]}
                >
                  <Input />
                </Form.Item>

                {/* Nest Form.List */}
                <Form.Item label="List">
                  <Form.List name={[field.name, "task"]}>
                    {(subFields, subOpt) => (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          rowGap: 16,
                        }}
                      >
                        {subFields.map((subField) => (
                          <Space key={subField.key}>
                            <Form.Item
                              noStyle
                              name={[subField.name, "task_id"]}
                            >
                              <Input placeholder="task_id" />
                            </Form.Item>
                            <Form.Item
                              noStyle
                              name={[subField.name, "task_name"]}
                            >
                              <Input placeholder="first" />
                            </Form.Item>
                            <Form.Item
                              noStyle
                              name={[subField.name, "allocated_time"]}
                            >
                              <Input placeholder="Allocated Time" />
                            </Form.Item>

                            <MinusCircleOutlined
                              onClick={() => {
                                subOpt.remove(subField.name);
                              }}
                            />
                          </Space>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => subOpt.add()}
                          block
                        >
                          + Add Task
                        </Button>
                      </div>
                    )}
                  </Form.List>
                </Form.Item>
              </Card>
            ))}

            <Button type="dashed" onClick={() => add()} block>
              + Add Module
            </Button>
          </div>
        )}
      </Form.List>

      <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>
  );
};
export default AddProjectPlan;
