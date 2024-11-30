import { Navigate } from "react-router-dom";

function getToken() {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');

  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');

    if (cookieName === "token") {
      return cookieValue;
    }
  }

  return null;
}

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  const isAuthenticated = token !== null;

  if (!isAuthenticated) {
    alert("Session timed out, please login")
    return <Navigate to={'/'}/>
  }

  return (
    <>  
      {children}
    </>
  )
};

export default ProtectedRoute;