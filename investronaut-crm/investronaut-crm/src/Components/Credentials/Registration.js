import React, { useEffect, useState,useRef  } from "react";
import "./Registration.css";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

/* ligh mode */
import "../../Theme/Lightmode.css";
import "../../Theme/Global.css";
import crmLogo from "../../Assets/crm_logo.png";
import hide from "../../Assets/hide.png";
import visible from "../../Assets/visible.png";

/* signup page text json data file */
import CredentialData from "../../Json-Data/Credentials-Data/Credentials_Data.json";
/* react toaster */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/* react otp-input */
import OtpInput from "react-otp-input";
/* bootstrap button */
import Button from "react-bootstrap/Button";

//Common Signup Page

function Registration() {
  const navigate = useNavigate();
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
  //SignUp Label state
    //geting all login lable data from CredentialData.json file handler
  const [labels, setlabels] = useState({});
  //Signup form btn disbabled state
  const [btnDisabled, setbtnDisabled] = useState(true);
  //Signup after mobile-email opt verify tag disabled state
  const [OTPverifydisb, setOTPverifydisb] = useState(false);
  //Signup mobile otp modal dismis state
  const [DismissModal, setDismissModal] = useState("");
  //Signup mobile otp tag css class state
  const [InvalidOPTError, setInvalidOPTError] = useState(false);
  //Signup page form disabled after wrong mobile entered state
  const [formDisbaled, setformDisabled] = useState(false);
  //signup page form freeze after wrong otp attempts state
  const [pageFreeze, setpageFreeze] = useState(false);
  //mobile otp varify loading after success state
  const [loading, setLoading] = useState(false);

  //Email otp
  const [emailverifyTag, setemailverifyTag] = useState("");
  const [emailOTP, setemailOTP] = useState("");
  const [emailOTPverifydis, setemailOTPverifydis] = useState(false);

  //Mobile otp
  const [mobileVerify, setmobileVerify] = useState("");
  const [getOtp, setgetOtp] = useState("");
  const [verifyBtndisabled, setverifyBtndisabled] = useState(true);

  //Signup mobile opt attempt state = 3
  const [MobileOtpAttempt, setMobileOtpAttempt] = useState(3);
  //Signup email opt attempt state = 3
  const [EmailOtpAttempt, setEmailOtpAttempt] = useState(3);

  const emobileOTPModallRef = useRef(null);
  const emailOTPModalRef = useRef(null);

  //manage changes in form input fields/get all form input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    if (name === "phoneNumber") {
      sanitizedValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      // console.log('replace')
      if (sanitizedValue.length === 10) {
        setmobileVerify("verify");
      } else {
        setmobileVerify("");
      }
    }
    const emailRegex1 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name === "email") {
      let testEmail = emailRegex1.test(value);
      if (testEmail) {
        console.log("✔️ Email");
        setemailverifyTag("verify");
      } else {
        console.log("❌ Email");
        setemailverifyTag("");
      }
    }

    setformData({
      ...formData,
      [name]: sanitizedValue,
    });
  };

  //signup form submit handler
  const handleDataSubmit = (e) => {
    e.preventDefault();
    const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(formData.fullName)) {
      toast.error("Please enter your full name, e.g., John Doe.", {
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

    if (!emailRegex.test(formData.email)) {
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
    if (formData.createPassword !== formData.confirmPassword) {
      toast.warn("Password and Confirm pasword should be same", {
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

    if (
      !passwordRegex.test(formData.createPassword) &&
      !passwordRegex.test(formData.confirmPassword)
    ) {
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

    if (formData.phoneNumber.length !== 10) {
      toast.error("Please enter correct phone number", {
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

    if (emailverifyTag !== "Verified") {
      toast.error("Please verify email", {
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


    if (mobileVerify !== "Verified") {
      toast.error("Please verify mobile number", {
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

    toast.success("Registration success!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    // console.log(formData);

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(formData.createPassword, saltRounds);

    // Update formData with hashed passwords
    const encryptData = {
      ...formData,
      createPassword: hashedPassword,
      confirmPassword: hashedPassword, // This is optional; usually, you don't need to send confirmPassword
    };
    console.log(encryptData);
  };

  //show password hide password handler
  const handleToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  //geting all signup lable data from CredentialData.json file handler
  useEffect(() => {
    setlabels(CredentialData);
    console.log(labels);
  }, [labels]);

  //disabled signup page form submit button if values are empty
  useEffect(() => {
    const isFormValid =
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phoneNumber.trim() !== "" &&
      formData.createPassword.trim() !== "" &&
      formData.confirmPassword.trim() !== "";
    setbtnDisabled(!isFormValid);
  }, [formData]);

  //restrict signup mobile number handler
  function restrictNumber(e) {
    let x = e.which || e.keycode;
    if (x >= 48 && x <= 57) {
      return true;
    } else {
      return false;
    }
  }

  //restrict signup mobile otp values handler
  const restrictOTP = (char) => {
    return /^\d$/.test(char);
  };

  //dignup mobile otp modal auto dismis handler
  const handleDismiss = () => {
    const emailModal = emobileOTPModallRef.current;
    const mobileModal = emailOTPModalRef.current;

    const modalBackdrop = document.querySelector(".modal-backdrop");

    // Hide email modal if it exists
    if (emailModal) {
      emailModal.classList.remove("show");
      emailModal.style.display = "none";
    }

    // Hide mobile modal if it exists
    if (mobileModal) {
      mobileModal.classList.remove("show");
      mobileModal.style.display = "none";
    }

    // Remove modal-related classes from the body
    if (emailModal || mobileModal) {
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


  //get signup mobile otp and perform validation on it handler
  const getOTPhandler = (otp) => {
    const filteredOtp = otp.split("").filter(restrictOTP).join("");
    setgetOtp(filteredOtp);
    setemailOTP(filteredOtp);
    setverifyBtndisabled(filteredOtp.length !== 4);
  };

  //signup mobile otp verify handler
  const mobileOTPverify = () => {
    if (getOtp === "1234") {
      setLoading(true);
      setmobileVerify("Verified");
      setOTPverifydisb(true);
      setInvalidOPTError(false);
      setTimeout(() => {
        setLoading(false);
        handleDismiss();
      }, 2000); // Simulate delay of 2 seconds before closing the modal
    } else {
      // setmobileVerify("verify");
      setInvalidOPTError(true);
      setMobileOtpAttempt((prev) => prev - 1);

      if (MobileOtpAttempt - 1 === 0) {
        setformDisabled(true);
        setpageFreeze(true);
        toast.error("Your account has been frozen for 2 minutes.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          setformDisabled(false);
          setMobileOtpAttempt(4); // Reset OTP attempts after freezing
        }, 120000); // 2 minutes in milliseconds

        handleDismiss();
      } else {
        toast.error(`Wrong OTP. ${MobileOtpAttempt - 1} Attempts remaining`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  //signup email otp verify handler
  const emailOTPVerifyHandler = () => {
    if (emailOTP === "5678") {
      setLoading(true);
      setemailverifyTag("Verified");
      setemailOTPverifydis(true);
      setInvalidOPTError(false);
      setTimeout(() => {
        setLoading(false);
        handleDismiss();
      }, 2000); // Simulate delay of 2 seconds before closing the modal
    } else {
      // setmobileVerify("verify");
      setInvalidOPTError(true);
      setEmailOtpAttempt((prev) => prev - 1);

      if (EmailOtpAttempt - 1 === 0) {
        setformDisabled(true);
        setpageFreeze(true);
        toast.error("Your account has been frozen for 2 minutes.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          setformDisabled(false);
          setEmailOtpAttempt(4); // Reset OTP attempts after freezing
        }, 120000); // 2 minutes in milliseconds

        handleDismiss();
      } else {
        toast.error(`Wrong OTP. ${EmailOtpAttempt - 1} Attempts remaining`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  //body for signup page
  return (
    <>
      <div className="registration_wrapper vh-100">
        <div className="registration_wrapper_inner h-100 mw-100 w-100">
          <div className="h-100 mw-100">
            <div className="row justify-content-center h-100 mw-100 flex-row-reverse">
              <div className="col-md-6 p-0">
                <div className="registration_page h-100 d-flex align-items-center">
                  {labels.SignUp && (
                    <fieldset
                      disabled={formDisbaled}
                      className={
                        pageFreeze ? "page-freeze mw-100 w-100" : "mw-100 w-100"
                      }
                    >
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
                            placeholder={labels.SignUp.FullNamePlacholder}
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="mb-2">
                          <label htmlFor="Email" className="form-label">
                            {labels.SignUp.Email}
                          </label>
                          <div className="email_code d-flex align-items-center position-relative">
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              aria-describedby="email"
                              placeholder={labels.SignUp.EmailPlaceholder}
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              disabled={emailOTPverifydis}
                            />
                            {
                              <Button
                                data-bs-toggle="modal"
                                data-bs-target="#emailOTPModal"
                                disabled={emailOTPverifydis}
                                className="emailOtpbtn"
                              >
                                {emailverifyTag}
                              </Button>
                            }
                          </div>
                        </div>
                        <div className="mb-2">
                          <label htmlFor="Number" className="form-label">
                            {labels.SignUp.PhoneNumber}
                          </label>
                          <div className="country_phone d-flex align-items-center position-relative">
                            <div className="county_code">+91</div>
                            <input
                              type="text"
                              className="form-control"
                              id="phoneNumber"
                              aria-describedby="phoneNumber"
                              placeholder={labels.SignUp.PhoneNumberPlaceholder}
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              maxLength="10"
                              onKeyUp={(event) => {
                                return restrictNumber(event);
                              }}
                              disabled={OTPverifydisb}
                            />

                            {
                              <Button
                                data-bs-toggle="modal"
                                data-bs-target="#mobileOTPModal"
                                disabled={OTPverifydisb}
                                className="mobileOtpbtn"
                              >
                                {mobileVerify}
                              </Button>
                            }
                          </div>
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
                                <img src={hide} alt="hide" />
                              ) : (
                                <img src={visible} alt="visible" />
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
                          {/* <span> {labels.SignUp.LoginButton}</span> */}
                          <span
                            onClick={() => navigate("/login")}>
                            {labels.SignUp.LoginButton}
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
                  <div className="slider_img h-100 position-relative">
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

      {labels.GetOTP && (
        <>
          {/* Conditionally render the modal based on mobileVerify and emailverifyTag */}
          {mobileVerify && (
            <div
              className="modal fade"
              id="mobileOTPModal"
              ref={emailOTPModalRef}
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
                  <div className="modal-body d-flex flex-column gap-1">
                    <h5 className="modal-title" id="exampleModalLabel">
                      {labels.GetOTP.Title}
                    </h5>
                    <p className="p-0">{labels.GetOTP.Text}</p>
                    <div className="otp-input-flex d-flex flex-column gap-4 mt-3">
                      <OtpInput
                        className="d-flex gap-2 otp_input"
                        value={getOtp}
                        onChange={getOTPhandler}
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
                  </div>
                  <div className="modal-footer d-flex flex-column justify-content-between border-0 p-1">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={mobileOTPverify}
                      disabled={verifyBtndisabled || loading}
                    >
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        labels.GetOTP.VerifyButton
                      )}
                    </button>
                    <p  className="d-flex justify-content-between w-100">
                        {labels.GetOTP.ResendOTPMSG}{" "}
                        <span>{labels.GetOTP.ResendOTP}</span>
                      </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {emailverifyTag && (
            <div
              className="modal fade"
              id="emailOTPModal"
              ref={emobileOTPModallRef}
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
                  <div className="modal-body d-flex flex-column gap-1">
                    <h5 className="modal-title" id="exampleModalLabel">
                      {labels.GetOTP.Title2}
                    </h5>
                    <p className="p-0">{labels.GetOTP.Text2}</p>
                    <div className="otp-input-flex d-flex flex-column gap-4 mt-3">
                      <OtpInput
                        className="d-flex gap-2 otp_input"
                        value={getOtp}
                        onChange={getOTPhandler}
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
                  </div>
                  <div className="modal-footer d-flex flex-column justify-content-between border-0 p-1">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={emailOTPVerifyHandler}
                      disabled={verifyBtndisabled || loading}
                    >
                      {loading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        labels.GetOTP.VerifyButton
                      )}
                    </button>
                    <p className="d-flex justify-content-between w-100">
                        {labels.GetOTP.ResendOTPMSG}{" "}
                        <span>{labels.GetOTP.ResendOTP}</span>
                      </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Registration;
