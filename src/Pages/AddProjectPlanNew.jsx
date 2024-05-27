import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import {
  getAllModules,
  createModule,
  editModule,
  deleteModule,
  getAllProjects,
  getJobRoleList,
  CONFIG_OBJ,
} from "../Config.js";
import axios from "axios";
// Editable cell component
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const App = () => {
  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const getModuleListWithTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/getAllModule/13/?page=1&pageSize=100000&search=`,
        CONFIG_OBJ
      );
      console.log("module with their tasks length", response.data.data.length);
      setDataSource(response.data.data);
      setCount(response.data.data.length);
      // setTaskData(response.data.data.tasks);
      //   if (response.data.results !== undefined) {
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    getModuleListWithTasks();
  }, []);
  const edit = (record) => {
    form.setFieldsValue({
      module_id: "",
      module_name: "",
      from_date: "",
      to_date: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleAdd = () => {
    const newData = {
      key: count.toString(),
      module_id: "new module",
      module_name: "module",
      from_date: "122",
      to_date: "12",
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns = [
    {
      title: (
        <div>
          <p style={{ marginTop: "1rem" }}>S.No.</p>
          {/* {expandedRowKeys.length === 0 ? (
            <PlusCircleOutlined
              onClick={handleExpandAll}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-4rem,-0.5rem )",
              }}
            />
          ) : (
            <MinusCircleOutlined
              onClick={handleCollapseAll}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-4rem,-0.5rem )",
              }}
            />
          )} */}
        </div>
      ),
      dataIndex: "module_id",
      key: "module_id",
      // render: (_, record, index) => {
      //   // Calculate the serial number based on the current page and the index of the item
      //   return (pagination.currentPage - 1) * pagination.pageSize + index + 1;
      // },
      width: "5%",
      align: "center",
    },
    {
      title: (
        <div>
          Module Name
          {/* {
            <ArrowUpOutlined
              style={{ marginLeft: 12, fontSize: "1rem" }}
              onClick={handleSortChange}
              rotate={sortOrder === "ASC" ? 0 : 180}
            />
          } */}
        </div>
      ),
      dataIndex: "module_name",
      key: "module_name",
      render: (text) => (
        <p className="text-capitalize fs-6 fw-medium">{text}</p>
      ),
    },

    {
      title: "Schd. St. Dt.",
      dataIndex: "from_date",
      key: "from_date",
      render: (text) => (
        <span className="fs-6 fw-medium">
          {moment(text).utcOffset("+05:30").format("DD/MM/YYYY")}
        </span>
      ),
      // render: (text) => moment(text).utcOffset("+05:30").format("DD/MM/YYYY"),
      width: "10%",
    },
    {
      title: "Schd. End Dt.",
      dataIndex: "to_date",
      key: "to_date",
      render: (text) => (
        <span className="fs-6 fw-medium">
          {moment(text).utcOffset("+05:30").format("DD/MM/YYYY")}
        </span>
      ),

      // render: (text) => moment(text).utcOffset("+05:30").format("DD/MM/YYYY"),
      width: "10%",
    },

    // {
    //   title: "Status  ",
    //   dataIndex: "status",
    //   key: "status",

    //   render: (text) => <p className="text-capitalize">{text}</p>,
    //   width: "10%",
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        let color = "";
        switch (text) {
          case "ongoing":
            color = "text-primary";
            break;
          case "notstarted":
            color = "text-warning";
            break;
          case "completed":
            color = "text-success";
            break;
          case "scrapped":
            color = "text-danger";
            break;
          default:
            color = "text-dark";
            break;
        }
        return (
          <p className={`text-capitalize ${color} fs-6 fw-medium`}>{text}</p>
        );
      },
      width: "10%",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <a style={{ marginLeft: 8 }}>Delete</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={dataSource}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default App;
