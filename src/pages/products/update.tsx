/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Skeleton,
  TreeSelect,
} from "antd";
import useList from "../../hooks/useList";
import { useNavigate, useParams } from "react-router-dom";
import useUpdate from "../../hooks/useUpdate";
import useOne from "../../hooks/useOne";
// import axios from "axios";

const ProductUpdate = () => {
  const { data } = useList({ resource: "categories" });
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const getOne = useOne({ resource: "products", id: Number(id) });
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const treeData = data?.data?.map((category: any) => ({
    title: category.name,
    value: category.id,
  }));

  const { mutate, isPending } = useUpdate({
    resource: "products",
    id: Number(id),
  });

  const onSubmit = async (formData: any) => {
    mutate(formData, {
      onSuccess: () => {
        messageApi.success("Sửa thành công");
        navigate("/admin/products");
      },
      onError: () => messageApi.error("Sửa thất bại"),
    });
    // console.log(formData);
  };

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold">Sửa sản phẩm</h2>
      </div>

      <Skeleton loading={getOne.isLoading} active avatar>
        <Form
          form={form}
          style={{ maxWidth: 600 }}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          onFinish={onSubmit}
          initialValues={{
            ...getOne.data?.data,
            categoryID: Number(getOne.data?.data?.categoryID),
          }}
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
              {isPending ? <span>Đang tải...</span> : <span>Sửa sản phẩm</span>}
            </Button>
          </Form.Item>
        </Form>
      </Skeleton>

      {contextHolder}
    </div>
  );
};
export default ProductUpdate;
