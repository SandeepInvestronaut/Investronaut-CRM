import React, { useEffect, useState } from "react";
import "./Registration.css";

import registerImg from "../../Assets/register_img.png";
import crmLogo from "../../Assets/crm_logo.png";
import hide from "../../Assets/hide.png";
import visible from "../../Assets/visible.png";

import CredentialData from "../../Json-Data/Credentials-Data/Credentials_Data.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from 'react-phone-number-input'
//Admin Role

function Registration() {
  //SignUp UseState
  const [formData, setformData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    createPassword: "",
    confirmPassword: "",
  });
  //Show Hide Password UseState
  const [showPassword, setShowPassword] = useState(false);
  //SignUp Label UseState
  const [labels, setlabels] = useState({});
  const [btnDisabled, setbtnDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDataSubmit = (e) => {
    e.preventDefault();
    const nameRegex = /^[a-zA-Z\s]{3,}$/;

    if (nameRegex.test(formData.fullName)) {
      toast.success("Registration success", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(formData);
    } else {
      toast.error("Fullname must contain letters", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    setlabels(CredentialData);
    console.log(labels);
  }, []);

  useEffect(() => {
    const isFormValid =
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phoneNumber.trim() !== "" &&
      formData.createPassword.trim() !== "" &&
      formData.confirmPassword.trim() !== "";
    setbtnDisabled(!isFormValid);
  }, [formData]);

  return (
    <>
      <div className="registration_wrapper vh-100">
        <div className="registration_wrapper_inner h-100 mw-100 w-100">
          <div className="h-100 mw-100">
            <div className="row justify-content-center h-100 mw-100">
              <div className="col-md-6 p-0">
                <div className="registration_page h-100">
                  <img src={crmLogo} className="mw-100 p-4" />
                  {labels.SignUp && (
                    <form onSubmit={handleDataSubmit}>
                      <h1>{labels.SignUp.Heading}</h1>
                      <p>{labels.SignUp.Text}</p>
                      <div className="mb-2">
                        <label htmlFor="firstName" className="form-label">
                          {labels.SignUp.FullName}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          aria-describedby="fullName"
                          placeholder="Enter your First name"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-2">
                        <label htmlFor="Email" className="form-label">
                          {labels.SignUp.Email}
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          aria-describedby="email"
                          placeholder="Enter your Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="Number" className="form-label">
                          {labels.SignUp.PhoneNumber}
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="phoneNumber"
                          aria-describedby="phoneNumber"
                          placeholder="Enter your Phone Number"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                        />
                      </div>

                

                      <div className="mb-2">
                        <label htmlFor="text" className="form-label">
                          {labels.SignUp.CreatePassword}
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="createPassword"
                          aria-describedby="createPassword"
                          placeholder="**********"
                          name="createPassword"
                          value={formData.createPassword}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="text" className="form-label">
                          {labels.SignUp.ConfirmPassword}
                        </label>
                        <div className="password_toggle_btn position-relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="confirmPassword"
                            aria-describedby="confirmPassword"
                            placeholder="**********"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                          <button
                            type="button"
                            onClick={handleToggle}
                            className="position-absolute"
                          >
                            {showPassword ? (
                              <img src={hide} />
                            ) : (
                              <img src={visible} />
                            )}
                          </button>
                        </div>
                      </div>
                      <button
                        disabled={btnDisabled}
                        type="submit"
                        className="btn btn-primary mx-auto d-flex"
                      >
                        {labels.SignUp.SignButton}
                      </button>
                      <p className="login_text">
                        {labels.SignUp.AlreadyLogin}
                        <span> {labels.SignUp.LoginButton}</span>
                      </p>
                      <ToastContainer />
                    </form>
                  )}
                </div>
              </div>
              <div className="col-md-6 p-0">
                <div className="slider_animation h-100">
                  <div className="slider_img h-100">
                    <img
                      src={registerImg}
                      className="mw-100"
                      alt="registerImg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
