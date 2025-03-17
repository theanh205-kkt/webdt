/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Popconfirm, Skeleton, Table } from "antd";
import useList from "../../hooks/useList";
import { IProduct } from "../../interface/type";
import { Link } from "react-router-dom";
import useDelete from "../../hooks/useDelete";
// import { IProduct } from "../../interface/type";

const ProductListPage = () => {
  const { data, isLoading, error, isError } = useList({ resource: "products" });

  const { mutate } = useDelete({ resource: "products" });

  const dataSource = data?.data?.map((product: IProduct) => ({
    key: product.id,
    ...product,
  }));

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <img src={image} width={50} alt="" />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (_: any, item: IProduct) => {
        // console.log(params2);
        return (
          <div className="flex space-x-3">
            <Link to={`/admin/products/update/${item.id}`}>
              <Button type="primary">Sửa</Button>
            </Link>
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có chắc muốn xóa sản phẩm này không?"
              onConfirm={() => mutate(item.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Xóa</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>Không có sản phẩm nào</div>;

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
        <Link to={"/admin/products/create"}>
          <Button type="primary">Thêm mới</Button>
        </Link>
      </div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};
export default ProductListPage;
