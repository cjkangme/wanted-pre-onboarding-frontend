import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://www.pre-onboarding-selection-task.shop";

const SignIn = () => {
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
    const response = await axios.post(`${BASE_URL}/auth/signin`, {
      email,
      password,
    });

    if (response.status === 200) {
      const token = response.data.access_token as string;

      localStorage.setItem("token", token);

      navigate("/todo");
    }
  };

  return (
    <div id="signInContainer">
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
          data-testid="signin-button"
          onChange={handlePasswordChange}
        />
        <button type="submit" disabled={disabled} data-testid="signup-button">
          로그인
        </button>
      </form>
    </div>
  );
};

export default SignIn;
