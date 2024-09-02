import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

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
/* react otp-input */
import OtpInput from "react-otp-input";

function Login() {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();
  //Login Label state
  //geting all login lable data from CredentialData.json file handler
  const [labels, setlabels] = useState({});
  //Show Hide Password UseState
  const [showPassword, setShowPassword] = useState(false);
  //submit btn disabled state
  const [submitDisabled, setsubmitDisabled] = useState(true);
  //Input value state
  const [formData, setformData] = useState({
    loginData: "",
    loginPassword: "",
  });

  //Login with otp state
  const [getMobileNumber, setgetMobileNumber] = useState("");

  //Login with otp btn disabled state
  const [getbtnDisabled, setgetbtnDisabled] = useState(true);

  //Loder get otp
  const [loader, setLoader] = useState(false);

  //OTP enter modal state
  const [loginwithOTP, setloginwithOTP] = useState(true);

  //OTP enter modal state
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  //Getting mobile otp for login state
  const [getMobileOTP, setMobileOTP] = useState("");
  //error for wrong otp value
  const [InvalidOPTError, setInvalidOPTError] = useState(false);
  //disabled login with otp text while correct otp
  const [otpbtnDisabled, setoptbtnDisabled] = useState(false);
  //Signup mobile otp modal dismis state
  const [DismissModal, setDismissModal] = useState("");

  const optloginRef = useRef(null);

  //forgot password modal state

  //dignup mobile otp modal auto dismis handler
  const handleDismiss = () => {
    const optlogin = optloginRef.current;
    const modalBackdrop = document.querySelector(".modal-backdrop");

    // Hide email modal if it exists
    if (optlogin) {
      optlogin.classList.remove("show");
      optlogin.style.display = "none";
    }

    // Remove modal-related classes from the body
    if (optlogin) {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
    }

    // Remove the backdrop if it exists
    if (modalBackdrop) {
      modalBackdrop.remove();
    }

    setDismissModal("modal");
    console.log("Modal closed");
  };

  //restrict login mobile otp values handler
  const restrictOTP = (char) => {
    return /^\d$/.test(char);
  };

  //get mobile otp handler
  const getMobileOTPhandler = (otp) => {
    const filteredOtp = otp.split("").filter(restrictOTP).join("");
    setMobileOTP(filteredOtp);
    console.log(getMobileOTP);
  };

  //verification mobile otp for login
  const mobileOTPVerifyHandler = () => {
    if (getMobileOTP === "1234") {
      setLoader(true);
      setInvalidOPTError(false);
      setTimeout(() => {
        setoptbtnDisabled(true);
        handleDismiss();
      }, 1000);
    } else {
      setInvalidOPTError(true);
    }
  };

  //disabled login page form submit button if values are empty
  useEffect(() => {
    const isFormValid =
      formData.loginData.trim() !== "" && formData.loginPassword.trim() !== "";
    setsubmitDisabled(!isFormValid);
  }, [formData]);

  //geting all login lable data from CredentialData.json file handler
  useEffect(() => {
    setlabels(CredentialData);
    console.log(labels.Login);
  }, [labels]);

  //validation for login by email
  const isValidEmail = (email) => {
    return emailRegex.test(email);
  };

  //validation for login by phone number
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/; // For a 10-digit phone number
    return phoneRegex.test(phoneNumber);
  };

  //handleChanges form inout data Event Data
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

  //Login form submit handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (
      !isValidEmail(formData.loginData) &&
      !isValidPhoneNumber(formData.loginData)
    ) {
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
    if (!passwordRegex.test(formData.loginPassword)) {
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
    console.log(formData);
  };

  //show password hide password handler
  const handleToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  //restrict loginwith otp mobile number handler
  function restrictNumber(e) {
    let x = e.which || e.keycode;
    if (x >= 48 && x <= 57) {
      return true;
    } else {
      return false;
    }
  }

  //Geting onChanges events values login with otp
  const getMobileHandle = (e) => {
    const { name, value } = e.target;
    let sanitizedMobileValue = value;
    if (name === "getphoneNumber") {
      sanitizedMobileValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    }
    setgetMobileNumber(sanitizedMobileValue);
  };

  //Submit input for mobile otp handler
  const getMobileOTPhanlder = (e) => {
    e.preventDefault();
    if (getMobileNumber.length !== 10) {
      toast.error("Please enter 10 numbers", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoader(false);
      return;
    }
    toast.success("OPT sent", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    setLoader(true);
    setOtpModalVisible(false);
    setTimeout(() => {
      setLoader(false);
      setloginwithOTP(false);
      setOtpModalVisible(true);
    }, 5000);

    console.log(getMobileNumber);
  };

  //login with otp btn disabled useeffect
  useEffect(() => {
    const ismobileEmpty = getMobileNumber.trim() !== "";
    setgetbtnDisabled(!ismobileEmpty);
  }, [getMobileNumber]);


  //forgot email handler code

  const { register, handleSubmit } = useForm({
    defaultValues:{
      forgotEmail:''
    }
  });




  const forgotemailSubmit = (d) => {
    const forgotEmailData = d.forgotEmail;
    if(forgotEmailData === ''){
      toast.error("Please enter email", {
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
    if(!emailRegex.test(forgotEmailData)){
      toast.error("Please enter valid email", {
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
    else{
      toast.success("Email sent", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
     
      console.log(forgotEmailData)
    }
  };


  return (
    <>
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
                              htmlFor="flexCheckDefault"
                            >
                              {labels.Login.Remember}
                            </label>
                          </div>
                          <p
                            className="forgot_password"
                            data-bs-toggle="modal"
                            data-bs-target="#forgotmodal"
                          >
                            {labels.Login.Forgot}
                          </p>
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
                        <p
                          className={
                            otpbtnDisabled
                              ? "login_OTP text-center d-flex justify-content-center mx-auto border-0 disabled-text bg-transparent"
                              : "login_OTP text-center d-flex justify-content-center mx-auto border-0 bg-transparent"
                          }
                          data-bs-toggle="modal"
                          data-bs-target="#optlogin"
                          disabled={otpbtnDisabled}
                        >
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

      {labels.LoginOTP && (
        <div
          className="modal fade"
          id="optlogin"
          ref={optloginRef}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss={DismissModal}
                  onClick={handleDismiss}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body d-flex flex-column gap-2">
                <h5 className="modal-title" id="exampleModalLabel">
                  {loginwithOTP ? (
                    `${labels.LoginOTP.Heading}`
                  ) : otpModalVisible ? (
                    ``
                  ) : (
                    <p></p>
                  )}
                </h5>
                <p className="p-0">
                  {loginwithOTP ? (
                    `${labels.LoginOTP.Text}`
                  ) : otpModalVisible ? (
                    `${labels.GetOTP.Text}`
                  ) : (
                    <p></p>
                  )}
                </p>
                <form>
                  {loginwithOTP ? (
                    <div className="mb-2 mt-3">
                      <label htmlFor="text" className="form-label">
                        {labels.LoginOTP.PhoneNumber}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="getphoneNumber"
                        aria-describedby="getphoneNumber"
                        placeholder={labels.LoginOTP.PhoneNumber}
                        name="getphoneNumber"
                        maxLength="10"
                        onChange={getMobileHandle}
                        value={getMobileNumber}
                        onKeyUp={(event) => {
                          return restrictNumber(event);
                        }}
                      />
                    </div>
                  ) : otpModalVisible ? (
                    <div className="otp-input-flex d-flex flex-column gap-4 mt-3">
                      <OtpInput
                        className="d-flex gap-2 otp_input"
                        value={getMobileOTP}
                        onChange={getMobileOTPhandler}
                        numInputs={4}
                        renderInput={(inputProps, index) => (
                          <input
                            {...inputProps}
                            key={index}
                            className={InvalidOPTError ? "invalid_otp" : ""}
                          />
                        )}
                      />
                    </div>
                  ) : (
                    <p></p>
                  )}
                  {loginwithOTP ? (
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                      >
                        {labels.LoginOTP.Accept}
                      </label>
                    </div>
                  ) : otpModalVisible ? (
                    ""
                  ) : (
                    <p></p>
                  )}

                  {loginwithOTP ? (
                    <div className="modal-footer border-0 p-3 justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary m-0"
                        onClick={getMobileOTPhanlder}
                        disabled={getbtnDisabled}
                      >
                        {loader
                          ? "OTP sent..."
                          : `${labels.LoginOTP.GetOTPButton}`}
                      </button>
                    </div>
                  ) : otpModalVisible ? (
                    <div className="modal-footer d-flex flex-column justify-content-between border-0 p-1">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={mobileOTPVerifyHandler}
                      >
                        {loader
                          ? "loading..."
                          : `${labels.GetOTP.VerifyButton}`}
                      </button>
                      <p className="d-flex justify-content-between w-100">
                        {labels.GetOTP.ResendOTPMSG}{" "}
                        <span>{labels.GetOTP.ResendOTP}</span>
                      </p>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {labels.ForgotPassword && (
        // <-- Forgot Modal -->
        <div
          className="modal fade"
          id="forgotmodal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog  modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body d-flex flex-column gap-2">
                <h5 className="modal-title" id="exampleModalLabel">
                  {labels.ForgotPassword.Title}
                </h5>
                <p>{labels.ForgotPassword.Text}</p>
                <form onSubmit={handleSubmit(forgotemailSubmit)}>
                  <div className="mb-3">
                    <label for="exampleInputEmail1" className="form-label">
                      {labels.ForgotPassword.Email}
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="forgotEmail"
                      aria-describedby="forgotEmail"
                      {...register("forgotEmail")}
                      placeholder={labels.ForgotPassword.Emailplcaholder}
                    />
                  </div>
                  <div className="modal-footer border-0">
                    <button type="submit" className="btn btn-primary m-auto">
                      {labels.ForgotPassword.SendEmailButton}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>

    
  );
}


export default Login;
