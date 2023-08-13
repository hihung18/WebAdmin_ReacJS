import React, { useRef, useState } from "react";
import "./Form.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const hostSignin = process.env.REACT_APP_HOST_AUTH_SIGNIN;
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const HandleLogin = async () => {
    const credentials = {
      username: username,
      password: password,
    };
    console.log(username, password);
    const response = await fetch(hostSignin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      setStatus("user not found!");
    }
    const data = await response.json();
    localStorage.setItem("auth", JSON.stringify(data));
    console.log(data.roles);
    navigate("/");
    window.location.reload();
  };
  const LogonButton = useRef();
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(LogonButton);
      HandleLogin().catch((err) => console.log(err));
    }
  };
  return (
    <div className="form-container">
      <div className="form-content-left">
        <img src="img/admin.png" alt="spaceship" className="form-img" />
      </div>
      <div className="form-content-right">
        <form className="form">
          <h1 style={{color: "#000"}}>Login</h1>
          <div className="form-inputs">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              className="form-input"
              placeholder="Enter admin's username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-inputs">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter admin's password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {status && <div className="status">{status}</div>}

          <button
            ref={LogonButton}
            className="form-input-btn"
            type="button"
            onClick={() => {
              HandleLogin();
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
