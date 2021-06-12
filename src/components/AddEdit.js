import React, { useState, useEffect } from "react";
import firebaseDb from "../firebase";
import { useParams, useHistory } from "react-router-dom";
import { isEmpty } from "lodash";

const AddEdit = () => {
  const values = {
    fullName: "",
    mobile: "",
    email: "",
    address: "",
  };
  const [initialState, setState] = useState(values);
  const [data, setData] = useState({});

  //   console.log("currentId", currentId);

  const { fullName, mobile, email, address } = initialState;

  const currentId = useParams();
  const history = useHistory();

  const { id } = currentId;

  console.log("currentId", currentId);

  useEffect(() => {
    firebaseDb.child("contacts").on("value", (snapshot) => {
      if (snapshot.val() !== null) {
        setData({
          ...snapshot.val(),
        });
      } else {
        setData({});
      }
    });
  }, [id]);

  useEffect(() => {
    if (isEmpty(id)) {
      console.log("initialState", initialState);
      setState({ ...values });
    } else {
      setState({ ...data[id] });
    }
  }, [id, data]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setState({
      ...initialState,
      [name]: value,
    });
  };

  const handleSubmit = (e, obj) => {
    e.preventDefault();
    console.log("initialState", initialState);
    if (isEmpty(id)) {
      firebaseDb.child("contacts").push(initialState, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } else {
      firebaseDb.child(`contacts/${id}`).set(initialState, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    history.push("/");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="bmd-label-floating">Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="bmd-label-floating">Mobile</label>
              <input
                type="number"
                className="form-control"
                name="mobile"
                value={mobile}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="bmd-label-floating">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="bmd-label-floating">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={address}
                onChange={handleInputChange}
              />
            </div>
            <button className="btn btn-default">Cancel</button>
            <button type="submit" className="btn btn-success btn-raised">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEdit;
