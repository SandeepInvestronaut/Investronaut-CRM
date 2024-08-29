import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//ligh mode style
import "../../Theme/Lightmode.css";
import "../../Theme/Global.css";
import "../../Components/Credentials/Login.css";

//login bg image
import crmLogo from "../../Assets/crm_logo.png";

//password toggle image
import hide from "../../Assets/hide.png";
import visible from "../../Assets/visible.png";

//signup page text json data file
import CredentialData from "../../Json-Data/Credentials-Data/Credentials_Data.json";

/* react toaster */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  //Login Label state
  const [labels, setlabels] = useState({});
  //Show Hide Password UseState
  const [showPassword, setShowPassword] = useState(false);
    //submit btn disabled state
    const [submitDisabled,setsubmitDisabled]=useState(true);

    const [error, setError] = useState("");

  //Input value state
  const [formData, setformData] = useState({
    loginData: "",
    loginPassword: "",
  });

  //disabled login page form submit button if values are empty
  useEffect(()=>{
const isFormValid = 
formData.loginData.trim() !== "" && formData.loginPassword.trim() !=="";
setsubmitDisabled(!isFormValid)

  },[formData])

  //geting all login lable data from CredentialData.json file handler
  useEffect(() => {
    setlabels(CredentialData);
    console.log(labels.Login);
  }, [labels]);


  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/; // For a 10-digit phone number
    return phoneRegex.test(phoneNumber);
  };

  //handleChanges Event Data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "loginData") {
      if (isValidEmail(value)) {
       return true;
      } else if (isValidPhoneNumber(value)) {
        return true;
      } else {
        return false;
      }
    }
  };


   

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!isValidEmail(formData.loginData) && !isValidPhoneNumber(formData.loginData)) {
      toast.warn("Please enter valid email or phone number", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if(!passwordRegex.test(formData.loginPassword)){
      toast.warn(
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      return;
    }
    toast.success("Login Success!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    console.log(formData)
  }

  //show password hide password handler
  const handleToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div className="login_wrapper vh-100">
      <div className="login_wrapper_inner h-100 mw-100 w-100">
        <div className="h-100 mw-100">
          <div className="row justify-content-center h-100 mw-100 flex-row-reverse">
            <div className="col-md-6 p-0">
              <div className="login_page h-100 d-flex align-items-center">
                {labels.Login && (
                  <fieldset className="mw-100 w-100">
                    <form onSubmit={handleLoginSubmit}>
                      <h1>{labels.Login.Heading}</h1>
                      <p>{labels.Login.Text}</p>
                      <div className="mb-2">
                        <label htmlFor="firstName" className="form-label">
                          {labels.Login.Email}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="loginData"
                          aria-describedby="loginData"
                          placeholder={labels.Login.EmailPhonePlaceholder}
                          name="loginData"
                          value={formData.loginData}
                          onChange={handleChange}
                        />
                        {error && <p className="text-danger">{error}</p>}
                      </div>
                      <div className="mb-2">
                        <label htmlFor="text" className="form-label">
                          {labels.Login.Password}
                        </label>
                        <div className="password_toggle_btn position-relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="loginPassword"
                            aria-describedby="loginPassword"
                            placeholder="**********"
                            name="loginPassword"
                            value={formData.loginPassword}
                            onChange={handleChange}
                          />
                          <button
                            type="button"
                            onClick={handleToggle}
                            className="position-absolute"
                          >
                            {showPassword ? (
                              <img src={hide} alt="hide" />
                            ) : (
                              <img src={visible} alt="visible" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="remember_forgot_section d-flex justify-content-between pt-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            for="flexCheckDefault"
                          >
                            {labels.Login.Remember}
                          </label>
                        </div>
                        <p className="forgot_password">{labels.Login.Forgot}</p>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary mx-auto d-flex"
                        disabled={submitDisabled}
                      >
                        {labels.Login.LoginButton}
                      </button>
                      <div className="divider d-flex position-relative justify-content-center align-items-center pt-4">
                        <p className="position-absolute"></p>
                        <p>{labels.Login.or}</p>
                        <p className="position-absolute"></p>
                      </div>
                      <p className="login_OTP text-center">
                        {labels.Login.LoginOTP}
                      </p>
                      <p className="login_text">
                        {labels.Login.Account}
                        {/* <span> {labels.Login.SignUpButton}</span> */}
                        <span onClick={() => navigate("/")}>
                          {labels.Login.SignUpButton}
                        </span>
                      </p>
                      <ToastContainer />
                    </form>
                  </fieldset>
                )}
              </div>
            </div>
            <div className="col-md-6 p-0">
              <div className="slider_animation h-100">
                <div className="login_slider_img h-100 position-relative">
                  <img
                    src={crmLogo}
                    className="mw-100 p-4 position-absolute"
                    alt="crm logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
