/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Popconfirm, Skeleton, Table, message } from "antd";
import useList from "../../hooks/useList";
import useDelete from "../../hooks/useDelete";
import { Link } from "react-router-dom";

const UserListPage = () => {
  const { data, isLoading, error, isError, mutate: refetch } = useList({ resource: "users" });
  const { mutate } = useDelete({
    resource: "users",
    onSuccess: () => {
      message.success("Xóa người dùng thành công!");
      refetch(); // Cập nhật lại danh sách sau khi xóa
    },
    onError: () => {
      message.error("Xóa người dùng thất bại!");
    },
  });

  const dataSource = data?.data?.map((user: any) => ({
    key: user.id,
    ...user,
  }));

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Giới tính",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, user: any) => (
        <div className="flex space-x-3">
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc muốn xóa người dùng này không?"
            onConfirm={() => mutate(user.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>Không có người dùng nào</div>;

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold">Danh sách tài khoản</h2>
      </div>
      <Table dataSource={dataSource} columns={columns} rowKey="id" />
    </div>
  );
};

export default UserListPage;
