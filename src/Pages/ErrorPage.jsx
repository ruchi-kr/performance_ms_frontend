import React, {useState,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const ErrorPage = () => {
  const [counter, setCounter] = useState(5);

  const navigate = useNavigate();
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    return () => clearInterval(timer);
  }, [counter]);
  const token = sessionStorage.getItem("token");
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{ height: "100vh" }}
      >
        <h1 className="text-center text-danger display-3">Page Not Found</h1>
        <br />
        {!token ? (
          <>
            {counter > 0 ? (
              <div className="d-flex justify-content-center align-items-center">
              <h4 className="text-center text-decoration-underline text-primary ">
               <LoadingOutlined className="me-3" />Redirecting to login Page in {counter}s
              </h4>
              </div>
            ) : (
             navigate("/login")
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default ErrorPage;
