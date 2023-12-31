import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://www.pre-onboarding-selection-task.shop";

const SignUp = () => {
  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (email.includes("@") && password.length >= 8) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await axios.post(`${BASE_URL}/auth/signup`, {
      email,
      password,
    });
    if (response.status === 201) {
      navigate("/signin");
    }
  };

  return (
    <div id="singUpContainer">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="text"
          placeholder="이메일을 입력해주세요"
          value={email}
          data-testid="email-input"
          onChange={handleEmailChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          data-testid="password-input"
          onChange={handlePasswordChange}
        />
        <button type="submit" disabled={disabled} data-testid="signup-button">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUp;
