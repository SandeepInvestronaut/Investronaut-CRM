import React from "react";
import crmLogo from "../../Assets/crm_logo.png";

function Login() {
  return (
    <div className="login_wrapper">
      <div className="login_inner_section">
        <div className="col-md-6 p-0">
          <div className="registration_page h-100">
            <img src={crmLogo} className="mw-100 p-4" />
            {labels.Login && (
              <form>
                <h1>{labels.Login.Heading}</h1>
                <p>{labels.Login.Text}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

