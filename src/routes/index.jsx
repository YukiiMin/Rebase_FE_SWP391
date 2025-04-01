import { Navigate, Routes, Route } from "react-router-dom";
import { publicRoutes, guestOnlyRoutes } from "./publicRoutes";
import { userRoutes, adminRoutes, staffRoutes } from "./privateRoutes";

// Component bảo vệ các routes cần xác thực
const ProtectedRoute = ({ 
  element: Component, 
  isLoggedIn, 
  decodedToken,
  authChecked,
  guestOnly, 
  userOnly, 
  adminOnly, 
  doctorOnly, 
  nurseOnly,
  ...rest 
}) => {
  if (!authChecked) {
    // Đang kiểm tra xác thực, hiển thị loading
    return <div>Loading...</div>;
  }
  
  if (guestOnly && isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  if ((userOnly || adminOnly || doctorOnly || nurseOnly) && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (decodedToken?.scope !== "ADMIN")) {
    console.log("Access denied: Admin role required, current role:", decodedToken?.scope);
    return <Navigate to="/" replace />;
  }

  if (doctorOnly && (decodedToken?.scope !== "DOCTOR")) {
    console.log("Access denied: Doctor role required, current role:", decodedToken?.scope);
    return <Navigate to="/" replace />;
  }

  if (nurseOnly && (decodedToken?.scope !== "NURSE")) {
    console.log("Access denied: Nurse role required, current role:", decodedToken?.scope);
    return <Navigate to="/" replace />;
  }

  return <Component {...rest} />;
};

// Tạo các routes đã được bảo vệ
const getRoutes = (
  isLoggedIn, 
  decodedToken,
  authChecked,
  isDevelopment = false
) => {
  // Các public routes (không yêu cầu đăng nhập)
  const routes = [
    ...publicRoutes.map(route => ({ 
      path: route.path, 
      element: route.element 
    })),
    
    // Guest-only routes (chỉ dành cho người chưa đăng nhập)
    ...guestOnlyRoutes.map(route => ({ 
      path: route.path, 
      element: <ProtectedRoute 
                element={route.element} 
                guestOnly 
                isLoggedIn={isLoggedIn}
                decodedToken={decodedToken}
                authChecked={authChecked}
              /> 
    })),
    
    // User routes (yêu cầu đăng nhập)
    ...userRoutes.map(route => ({ 
      path: route.path, 
      element: <ProtectedRoute 
                element={route.element} 
                userOnly 
                isLoggedIn={isLoggedIn}
                decodedToken={decodedToken}
                authChecked={authChecked}
              /> 
    })),
  ];

  // Trong môi trường development, không kiểm tra role
  if (isDevelopment) {
    // Thêm admin routes nhưng chỉ yêu cầu đăng nhập
    routes.push(
      ...adminRoutes.map(route => ({ 
        path: route.path, 
        element: <ProtectedRoute 
                  element={route.element} 
                  userOnly 
                  isLoggedIn={isLoggedIn}
                  decodedToken={decodedToken}
                  authChecked={authChecked}
                /> 
      })),
      
      // Thêm staff routes nhưng chỉ yêu cầu đăng nhập
      ...staffRoutes.map(route => ({ 
        path: route.path, 
        element: <ProtectedRoute 
                  element={route.element} 
                  userOnly 
                  isLoggedIn={isLoggedIn}
                  decodedToken={decodedToken}
                  authChecked={authChecked}
                /> 
      }))
    );
  } else {
    // Trong môi trường production, kiểm tra role đầy đủ
    routes.push(
      ...adminRoutes.map(route => ({ 
        path: route.path, 
        element: <ProtectedRoute 
                  element={route.element} 
                  adminOnly 
                  isLoggedIn={isLoggedIn}
                  decodedToken={decodedToken}
                  authChecked={authChecked}
                /> 
      })),
      
      // Staff routes với kiểm tra role
      ...staffRoutes.map(route => ({ 
        path: route.path, 
        element: <ProtectedRoute 
                  element={route.element} 
                  doctorOnly 
                  nurseOnly 
                  isLoggedIn={isLoggedIn}
                  decodedToken={decodedToken}
                  authChecked={authChecked}
                /> 
      }))
    );
  }

  return routes;
};

// Router component gộp từ Router.jsx
const Router = ({ isLoggedIn, decodedToken, authChecked }) => {
  // Lấy danh sách routes dựa vào trạng thái đăng nhập
  const appRoutes = getRoutes(
    isLoggedIn, 
    decodedToken, 
    authChecked,
    true // isDevelopment = true (sử dụng môi trường dev)
  );

  return (
    <Routes>
      {appRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export { ProtectedRoute, getRoutes };
export default Router;
