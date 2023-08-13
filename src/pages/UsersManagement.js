import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
const UsersManagement = () => {
  const hostUsers = process.env.REACT_APP_HOST_USERS;

  const [showAdd, setShowAdd] = React.useState(false);
  const closeAddUser = () => setShowAdd(false);
  const openAddUser = () => setShowAdd(true);

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdateUser = () => setUpdate(false);
  const openUpdateUser = () => setUpdate(true);

  //for post user
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("ROLE_USER");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [address, setAddress] = React.useState("");

  //update
  const [userUpdate, setUserUpdate] = React.useState({});

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }
  const [users, setUsers] = React.useState([]);
  const [usersFollowRole, setUsersFollowRole] = React.useState([]);
  const roleUser = "ROLE_USER";
  const roleShop = "ROLE_ADMIN";
  const [roleSelected, setRoleSelected] = React.useState("ALL");

  const isValidEmail = (email) => {
    // Sử dụng biểu thức chính quy để kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  React.useEffect(() => {
    fetch(hostUsers, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
      },
    })
      .then((res) => res.json())
      .then((users) => {
        setUsers(users);
        setUsersFollowRole(users);
      })
      .catch((err) => console.log(err));
  }, [hostUsers, userDetail.token]);

  const AddUser = async () => {
    console.log(username, role, email, address, firstName, lastName);
    if (!isValidEmail(email) ) {
      alert("Email invalidate!")
      return
    }
    const response = await fetch(hostUsers, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        role: role,
        firstName: firstName,
        lastName: lastName,
        address: address,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }
    const data = await response.json();
    console.log(data);
    users.push(data);
    setUsers(users);
    if (data.role === roleSelected) {
      usersFollowRole.push(data);
      setUsersFollowRole(usersFollowRole);
    }
    closeAddUser();
    alert("User is being uploaded!");
  };

  const DeleteUser = async (id) => {
    console.log(id);
    const response = await fetch(hostUsers + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    const data = await response.json();
    console.log(data);
    const updatedUser1 = usersFollowRole.filter((user) => user.id !== id);
    const updatedUser2 = users.filter((user) => user.id !== id);
    setUsersFollowRole(updatedUser1);
    setUsers(updatedUser2);
  };

  const UpdateUser = async (id) => {
    console.log(userUpdate);
    const response = await fetch(hostUsers + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userUpdate.username,
        email: userUpdate.email,
        role: userUpdate.role,
        firstName: userUpdate.firstName,
        lastName: userUpdate.lastName,
        address: userUpdate.address,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const data = await response.json();
    console.log(data);

    let updateUsers1 = usersFollowRole.map((user) => {
      if (user.id === data.id) {
        return {
          ...user,
          email: userUpdate.email,
          role: userUpdate.role,
          firstName: userUpdate.firstName,
          lastName: userUpdate.lastName,
          address: userUpdate.address,
        };
      }
      return user;
    });
    let updateUsers2 = users.map((user) => {
      if (user.id === data.id) {
        return {
          ...user,
          email: userUpdate.email,
          role: userUpdate.role,
          firstName: userUpdate.firstName,
          lastName: userUpdate.lastName,
          address: userUpdate.address,
        };
      }
      return user;
    });
    setUsersFollowRole(updateUsers1);
    if (roleSelected !== "ALL") {
      let updatedUsersRole1 = updateUsers1.filter(
        (user) => user.role === roleSelected
      );
      setUsersFollowRole(updatedUsersRole1);
    }

    setUsers(updateUsers2);
  };

  const SetUserFollowRole = (userRole) => {
    if (userRole !== "ALL") {
      let usersFollowRole = users.filter((user) => user.role === userRole);
      setUsersFollowRole(usersFollowRole);
    } else {
      setUsersFollowRole(users);
    }
  };

  console.log(usersFollowRole);
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <Button variant="info" onClick={openAddUser} className="btn-add">
              Add User
            </Button>
            <div className="select">
              <select
                className="form-select"
                id="select-option"
                onChange={(e) => {
                  SetUserFollowRole(e.target.value);
                  setRoleSelected(e.target.value);
                }}
              >
                <option value="ALL">All user</option>
                <option value={roleUser}>Role user</option>
                <option value={roleShop}>Role admin</option>
              </select>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Full name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Open</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {usersFollowRole &&
                    usersFollowRole.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.lastName + " " + user.firstName}</td>
                        <td>{user.email}</td>
                        <td>{user.address}</td>
                        <td>
                          <button className="btn-outline-status">
                            {user.role}
                          </button>
                        </td>
                        <td>
                          {user.role === roleUser && (
                            <Link to={"/users/" + user.id}>
                              <button className="btn-open">Open</button>
                            </Link>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-update"
                            onClick={() => {
                              setUserUpdate(user);
                              openUpdateUser();
                            }}
                          >
                            update
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you wish to delete this item?"
                                )
                              )
                                DeleteUser(user.id);
                            }}
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* add user */}
      <Modal show={showAdd} onHide={closeAddUser}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                <option value={roleUser}>User</option>
                <option value={roleShop}>Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                id="inputUserName"
                type="text"
                placeholder="User name"
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                id="inputPassword"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                id="inputEmail"
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                id="inputFirstName"
                type="text"
                placeholder="First name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                id="inputLastName"
                type="text"
                placeholder="Last name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                id="inputAddress"
                type="text"
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddUser}>
            Close
          </Button>
          <Button variant="primary" onClick={AddUser}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* update user */}
      <Modal show={showUpdate} onHide={closeUpdateUser}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                id="inputUserName"
                type="text"
                value={userUpdate.username}
                placeholder="User name"
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                id="inputEmail"
                type="text"
                value={userUpdate.email}
                placeholder="Email"
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                id="inputFirstName"
                type="text"
                placeholder="First name"
                value={userUpdate.firstName}
                onChange={(e) =>
                  setUserUpdate({
                    ...userUpdate,
                    firstName: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                id="inputLastName"
                type="text"
                placeholder="Last name"
                value={userUpdate.lastName}
                onChange={(e) =>
                  setUserUpdate({
                    ...userUpdate,
                    lastName: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                id="inputAddress"
                type="text"
                placeholder="Address"
                value={userUpdate.address}
                onChange={(e) =>
                  setUserUpdate({
                    ...userUpdate,
                    address: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdateUser}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              UpdateUser(userUpdate.id);
              closeUpdateUser();
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersManagement;
