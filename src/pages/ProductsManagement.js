import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";

const ProductsManagement = () => {
  const hostProduct = process.env.REACT_APP_HOST_PRODUCTS;

  const [showAdd, setShowAdd] = React.useState(false);
  const closeAddProduct = () => setShowAdd(false);
  const openAddProduct = () => setShowAdd(true);

  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdateProduct = () => setUpdate(false);
  const openUpdateProduct = () => setUpdate(true);

  const [categorySelected, setCategorySelected] = React.useState("ALL");
  const [productsFollowCate, setProductsFollowCate] = React.useState([]);

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }
  const [products, setProducts] = React.useState([]);

  // for POST product
  const [productPrice, setProductPrice] = React.useState();
  const [productName, setProductName] = React.useState("");
  const [productDescription, setProductDescription] = React.useState("");
  const [cateId, setCateId] = React.useState(1);
  const [categoryName, setCategoryName] = React.useState("");
  const [productRemain, setProductRemain] = React.useState("");
  const [featureIds, setFeatureIds] = React.useState([]);
  const [imageUrl, setImageUrl] = React.useState([]);

  //for update products
  const [productUpdate, setProductUpdate] = React.useState({});

  React.useEffect(() => {
    fetch(hostProduct)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setProductsFollowCate(data);
      })
      .catch((err) => console.log(err));
  }, [hostProduct]);

  const AddProduct = async () => {
    const featureIdsAfterSplice = GetFeatureIds(featureIds);
    const response = await fetch(hostProduct, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productPrice: productPrice,
        productName: productName,
        productDescription: productDescription,
        cateId: cateId,
        categoryName: categoryName,
        productRemain: productRemain,
        featureIds: featureIdsAfterSplice,
        imageUrls: [imageUrl],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }
    const data = await response.json();
    console.log(data.productId);
    products.push(data);
    setProducts(products);
    if (data.categoryName === categorySelected) {
      productsFollowCate.push(data);
      setProductsFollowCate(productsFollowCate);
    }
    closeAddProduct();
    alert("Product is being uploaded!");
  };

  const DeleteProduct = async (id) => {
    console.log(id);
    const response = await fetch(hostProduct + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete propduct");
    }
    const data = await response.json();
    console.log(data);
    const updatedProducts1 = products.filter(
      (product) => product.productId !== id
    );
    const updateProducts2 = productsFollowCate.filter(
      (product) => product.productId !== id
    );
    setProducts(updatedProducts1);
    setProductsFollowCate(updateProducts2);
  };

  const GetCate = (price) => {
    if (price < 150) {
      return [1, "cheaps"];
    } else if (price <= 250) {
      return [2, "average"];
    } else {
      return [3, "expensive"];
    }
  };

  const GetFeatureIds = (featureIds) => {
    for (let index = 0; index < featureIds.length; index++) {
      if (featureIds[index] === "") {
        featureIds.splice(index, 1);
      }
    }
    return featureIds;
  };

  const UpdatedProduct = async (id) => {
    console.log(productUpdate.imageUrls); //
    const cate = GetCate(productUpdate.productPrice);
    let imgUrls = productUpdate.imageUrls;
    let imgUrlsArray = String(imgUrls).split(",");
    console.log(imgUrlsArray);
    console.log("hello");

    const response = await fetch(hostProduct + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productPrice: productUpdate.productPrice,
        productName: productUpdate.productName,
        productDescription: productUpdate.productDescription,
        cateId: cate[0],
        categoryName: cate[1],
        productRemain: productUpdate.productRemain,
        featureIds: productUpdate.featureIds,
        imageUrls: imgUrlsArray,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    const data = await response.json();
    console.log(data.imageUrls);

    let updateProducts2 = productsFollowCate.map((product) => {
      if (product.productId === data.productId) {
        return {
          ...product,
          productPrice: data.productPrice,
          productName: data.productName,
          productDescription: data.productDescription,
          cateId: data.cateId,
          categoryName: data.categoryName,
          productRemain: data.productRemain,
          imageUrls: imgUrlsArray,
        };
      }
      return product;
    });
    setProductsFollowCate(updateProducts2);

    let updateProducts1 = products.map((product) => {
      if (product.productId === data.productId) {
        return {
          ...product,
          productPrice: data.productPrice,
          productName: data.productName,
          productDescription: data.productDescription,
          cateId: data.cateId,
          categoryName: data.categoryName,
          productRemain: data.productRemain,
          imageUrls: imgUrlsArray,
        };
      }
      return product;
    });
    setProducts(updateProducts1);

    if (categorySelected !== "ALL") {
      let updateProductsCate = updateProducts2.filter(
        (product) => product.categoryName === categorySelected
      );
      setProductsFollowCate(updateProductsCate);
    }
  };

  const SetProductsFollowCate = (cateName) => {
    if (cateName !== "ALL") {
      let result = products.filter(
        (product) => product.categoryName === cateName
      );
      setProductsFollowCate(result);
    } else {
      setProductsFollowCate(products);
    }
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <Button variant="info" onClick={openAddProduct} className="btn-add">
              Add Product
            </Button>

            <div className="select">
              <select
                className="form-select"
                id="select-option"
                onChange={(e) => {
                  SetProductsFollowCate(e.target.value);
                  setCategorySelected(e.target.value);
                }}
              >
                <option value="ALL">All products</option>
                <option value="cheaps">Cheaps products</option>
                <option value="average">Average products</option>
                <option value="expensive">Expensive products</option>
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Remain</th>
                    <th>Category</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {productsFollowCate &&
                    productsFollowCate.map((product, index) => (
                      <tr key={index}>
                        <td>
                          {
                            <img
                              src={product.imageUrls[0]}
                              alt="img"
                              style={{ height: "100px", width: "70px" }}
                            />
                          }
                        </td>
                        <td>{product.productId}</td>
                        <td>{product.productName}</td>
                        <td>{product.productDescription}</td>
                        <td>{product.productPrice}</td>
                        <td>{product.productRemain}</td>
                        <td>
                          <button className="btn-outline-status">
                            {product.categoryName}
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-update"
                            onClick={() => {
                              let item = product;
                              console.log(item);
                              setProductUpdate({});
                              setProductUpdate(item);
                              openUpdateProduct();
                            }}
                          >
                            update
                          </button>
                        </td>
                        <td>
                          {
                            <button
                              className="btn-delete"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you wish to delete this item?"
                                  )
                                )
                                  DeleteProduct(product.productId);
                              }}
                            >
                              delete
                            </button>
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>

          {/* Add product */}
          <Modal className="modal" show={showAdd} onHide={closeAddProduct}>
            <Modal.Header closeButton>
              <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Product name</Form.Label>
                  <Form.Control
                    id="inputProductName"
                    type="text"
                    placeholder="Product name"
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Price($)</Form.Label>
                  <Form.Control
                    id="inputProductPrice"
                    type="number"
                    pattern="/^[0-9]\d*$/"
                    placeholder="Price"
                    onChange={(e) => {
                      setProductPrice(e.target.value);
                      if (e.target.value < 150) {
                        setCateId(1);
                        setCategoryName("cheaps");
                      } else if (e.target.value <= 250) {
                        setCateId(2);
                        setCategoryName("average");
                      } else {
                        setCateId(3);
                        setCategoryName("expensive");
                      }
                    }}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    id="inputDescription"
                    type="text"
                    placeholder="Description"
                    onChange={(e) => setProductDescription(e.target.value)}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Remain</Form.Label>
                  <Form.Control
                    id="inputRemain"
                    type="number"
                    pattern="[0-9]*"
                    placeholder="Remain"
                    onChange={(e) => setProductRemain(e.target.value)}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Image(url)</Form.Label>
                  <Form.Control
                    id="inputImageUrl"
                    type="text"
                    placeholder="URL"
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        featureIds[0] = e.target.value;
                        setFeatureIds(featureIds);
                      }
                    }}
                  >
                    {/* value la featureFeatureId (id) cua option */}
                    <option value="">Select</option>
                    <option value="10026">Apple</option>
                    <option value="2">Samsung</option>
                    <option value="3">Xiaomi</option>
                    <option value="4">Vivo</option>
                    <option value="5">Oppo</option>
                    <option value="6">Huawei</option>
                    <option value="7">Realme</option>
                    <option value="11">Lenovo</option>
                    <option value="12">Motorola</option>
                    <option value="13">Tecno</option>
                    <option value="14">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Camera</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        featureIds[1] = e.target.value;
                        setFeatureIds(featureIds);
                      }
                    }}
                  >
                    <option value="">Select</option>
                    <option value="15">HD</option>
                    <option value="21">Full HD</option>
                    <option value="22">QHD+</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Ram</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        featureIds[2] = e.target.value;
                        setFeatureIds(featureIds);
                      }
                    }}
                  >
                    <option value="">Select</option>
                    <option value="23">2gb</option>
                    <option value="24">3gb</option>
                    <option value="25">4gb</option>
                    <option value="26">5gb</option>
                    <option value="27">6gb</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Rom</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      if (e.target.value !== "") {
                        featureIds[3] = e.target.value;
                        setFeatureIds(featureIds);
                      }
                    }}
                  >
                    <option value="">Select</option>
                    <option value="28">8gb</option>
                    <option value="29">16gb</option>
                    <option value="30">32gb</option>
                    <option value="32">64gb</option>
                    <option value="33">128gb</option>
                    <option value="34">256gb</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeAddProduct}>
                Close
              </Button>
              <Button variant="primary" onClick={AddProduct}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Update product  */}
          <Modal show={showUpdate} onHide={closeUpdateProduct}>
            <Modal.Header closeButton>
              <Modal.Title>Update product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    id="inputProductName"
                    type="text"
                    value={productUpdate.productName}
                    placeholder="Product name"
                    onChange={(e) => {
                      setProductUpdate({
                        ...productUpdate,
                        productName: e.target.value,
                      });
                    }}
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    id="inputProductPrice"
                    type="number"
                    pattern="[0-9]*"
                    placeholder="only number..."
                    value={productUpdate.productPrice}
                    onChange={(e) =>
                      setProductUpdate({
                        ...productUpdate,
                        productPrice: parseInt(e.target.value),
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    id="inputDescription"
                    type="text"
                    as="textarea"
                    rows={3}
                    placeholder="Description"
                    value={productUpdate.productDescription}
                    onChange={(e) =>
                      setProductUpdate({
                        ...productUpdate,
                        productDescription: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Remain</Form.Label>
                  <Form.Control
                    id="inputRemain"
                    type="number"
                    pattern="[0-9]*"
                    placeholder="only number..."
                    value={productUpdate.productRemain}
                    onChange={(e) =>
                      setProductUpdate({
                        ...productUpdate,
                        productRemain: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group as={Row} className="mp-3">
                  <Form.Label>Image Url</Form.Label>
                  <Form.Control
                    id="inputImageUrl"
                    type="text"
                    placeholder="image urls..."
                    readOnly={false}
                    value={productUpdate.imageUrls}
                    onChange={(e) =>
                      setProductUpdate({
                        ...productUpdate,
                        imageUrls: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeUpdateProduct}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  UpdatedProduct(productUpdate.productId);
                  closeUpdateProduct();
                }}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ProductsManagement;
