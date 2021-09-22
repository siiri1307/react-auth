import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useToken } from "../auth/useToken";
import axios from "axios";

export const SignUpPage = () => {
    const [token, setToken] = useToken();
    const [errorMessage, setErrorMessage] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

    const history = useHistory();

    const onSignUpClicked = async () => {
        const response = await axios.post("/api/signup", {
            email: emailValue,
            password: passwordValue
        });
        const { token } = response.data;
        setToken(token);
        history.push("/");
    }

    return (
        <div className="content-container">
            <h1>Sign Up</h1>
            {errorMessage && <div className="fail">{errorMessage}</div>}
            <input 
                value={emailValue} 
                onChange={e => setEmailValue(e.target.value)} 
                placeholder="Your email address" />
            <input 
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                placeholder="Your password" type="password" />
            <input 
                value={confirmPasswordValue}
                onChange={e => setConfirmPasswordValue(e.target.value)}
                placeholder="Your password" type="password" />
            <hr />
            <button 
                disabled={
                    !emailValue || !passwordValue || passwordValue !== confirmPasswordValue
                }
                onClick={onSignUpClicked}>Sign up</button>
            <button onClick={() => history.push("login")}>Already have an account? Log in.</button>
        </div>
    )
}