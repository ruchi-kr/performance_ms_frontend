import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import SideNavbar from "../Components/SideNavbar";
import Footer from "../Components/Footer";
import { toast } from "react-toastify";

import {
  Checkbox,
  Radio,
  Form,
  InputNumber,
  Input,
  Button,
  Row,
  Col,
} from "antd";
import axios from "axios";

const { TextArea } = Input;
const SystemSettings = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [systemSettings, setSystemSettings] = useState([]);
  const [componentDisabled, setComponentDisabled] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAll();
  }, []);
  const fetchAll = async () => {
    const resp = await axios.get(
      "http://localhost:8000/api/admin/systemsettings"
    );
    console.log("response", resp?.data?.data[0]?.manHrsPerDay);
    const response = resp?.data?.data[0];
    console.log("resp", resp.data.data.length);
    // console.log("response length",response.length)
    setComponentDisabled(true);
    if (resp.data.data.length === 0) {
      console.log("running for length 0");
      setIsAdding(true);
      setIsEditing(false);
    } else {
      console.log("running for length > 0");
      setIsAdding(false);
      setIsEditing(true);
      setSystemSettings(response);
      form.setFieldsValue({
        settings_id: response.settings_id,
        manHrsPerDay: response.manHrsPerDay,
      });
    }
  };
  const onFinish = async (values) => {
    console.log("values inside form submit", values);
    if (isAdding && !isEditing) {
      console.log("adding first time");
      try {
        const resp = await axios.post(
          "http://localhost:8000/api/admin/systemsettings",
          values
        );
        toast.success("Settings Added");
        // window.location.reload();
        setComponentDisabled(true);
        setIsAdding(false);
      } catch (error) {
        toast.error("Failed to add settings!");

        console.log("error occured in adding");
      }
    } else if (!isAdding && isEditing) {
      console.log("editing settings");
      try {
        const resp = await axios.patch(
          `http://localhost:8000/api/admin/editsystemsettings/${values.settings_id}`,
          values
        );
        toast.success("Settings Modified");
        // window.location.reload();
        componentDisabled(false);
        fetchAll();
      } catch (error) {
        console.log("errro occured in editing");
      }
    }
  };
  const onFinishFailed = () => {
    console.log("form submit failed");
    toast.error("Failed to edit settings!");
  };
  return (
    <>
      <Header />
      <SideNavbar />
      <div className="content-wrapper bg-white">
        <div className="content">
          <div className="container-fluid bg-white">
            <div className="row my-5">
              <div className="col-12 mx-auto">
                {/* <div className="d-flex justify-content-between"> */}
                <h3 className="text-primary">System Settings</h3>
                <div>
                  <Checkbox
                    checked={componentDisabled}
                    style={{ marginTop: "2rem" }}
                    onChange={(e) => setComponentDisabled(e.target.checked)}
                  >
                    Disable Form
                  </Checkbox>
                  <Form
                    form={form}
                    layout="horizontal"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    disabled={componentDisabled}
                    style={{ marginTop: "1.5rem" }}
                  >
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          name="settings_id"
                          label="Settings Id"
                          hidden
                        >
                          <InputNumber style={{ width: "60%" }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          name="manHrsPerDay"
                          label="Man Hours Per Day"
                          rules={[
                            {
                              required: true,
                              message: "Please input number between 8 & 24 !",
                            },
                          ]}
                        >
                          <InputNumber
                            min={8}
                            max={24}
                            precision={0}
                            style={{ width: "60%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item style={{ marginTop: "1rem" }}>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SystemSettings;
