import "./App.css";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LayoutAdmin from "./components/LayoutAmin";
import Authenticated from "./components/Authenticated";
import Dashboard from "./pages/Dashboard";
import ProductListPage from "./pages/products/list";
import ProductAdd from "./pages/products/create";
import ProductUpdate from "./pages/products/update";
import UserListPage from "./pages/users/list";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="admin"
          element={
            <Authenticated fallback={<Navigate to="/login" replace />}>
              <LayoutAdmin>
                <Outlet />
              </LayoutAdmin>
            </Authenticated>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products">
            <Route index element={<ProductListPage />} />
            <Route path="create" element={<ProductAdd />} />
            <Route path="update/:id" element={<ProductUpdate />} />
          </Route>

          <Route path="users">
            <Route index element={<UserListPage />} />
          </Route>
        </Route>
        <Route path="login" element={<h1>Login</h1>} />
        <Route path="*" element={<h1>404 not found</h1>} />
      </Routes>
    </>
  );
}

export default App;
