/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, InputNumber, message, TreeSelect } from "antd";
import useList from "../../hooks/useList";
import useCreate from "../../hooks/useCreate";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

const ProductAdd = () => {
  const { data } = useList({ resource: "categories" });
  const { mutate, isPending } = useCreate({ resource: "products" });
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const treeData = data?.data?.map((category: any) => ({
    title: category.name,
    value: category.id,
  }));

  const onSubmit = async (formData: any) => {
    // try {
    //   const response = await axios.post(
    //     `http://localhost:3000/products`,
    //     formData
    //   );
    //   console.log(formData);
    //   console.log("Thêm thành công");
    //   return response.data;
    // } catch (error) {
    //   console.log(error);
    // }
    mutate(formData, {
      onSuccess: () => {
        messageApi.success("Thêm thành công");
        navigate("/admin/products");
      },
      onError: () => messageApi.error("Thêm thất bại"),
    });
    // console.log(formData);
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold">Thêm sản phẩm</h2>
      </div>

      <Form
        form={form}
        style={{ maxWidth: 600 }}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        onFinish={onSubmit}
      >
        <Form.Item label="Tên sản phẩm" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Giá" name="price">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Số lượng" name="quantity">
          <InputNumber />
        </Form.Item>
        <Form.Item label="Danh mục" name="categoryID">
          <TreeSelect treeData={treeData} />
        </Form.Item>
        <Form.Item label="Hình ảnh" name="image">
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            {isPending ? <span>Đang tải...</span> : <span>Thêm sản phẩm</span>}
          </Button>
        </Form.Item>
      </Form>
      {contextHolder}
    </div>
  );
};
export default ProductAdd;
