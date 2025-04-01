import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from '../config/apiConfig';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mfaToken, setMfaToken] = useState("");
    const [step, setStep] = useState(1); // 1: Login, 2: MFA
    const [tempToken, setTempToken] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(getApiUrl ('/login'), {
                email,
                password
            });
            setTempToken(res.data.tempToken);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Error al iniciar sesión");
        }
    };

    const handleVerifyMFA = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(getApiUrl('/verify-mfa'), {
                email,
                token: mfaToken,
                tempToken
            });
            localStorage.setItem("token", res.data.token);
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || "Código MFA inválido");
        }
    };

    return (
        <div className="auth-container">
            {step === 1 ? (
                <form onSubmit={handleLogin}>
                    <h2>Iniciar Sesión</h2>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Ingresar</button>
                    {error && <p className="error">{error}</p>}
                </form>
            ) : (
                <form onSubmit={handleVerifyMFA}>
                    <h2>Verificación en 2 Pasos</h2>
                    <input
                        type="text"
                        placeholder="Código MFA"
                        value={mfaToken}
                        onChange={(e) => setMfaToken(e.target.value)}
                        required
                    />
                    <button type="submit">Verificar</button>
                    {error && <p className="error">{error}</p>}
                </form>
            )}
        </div>
    );
};

export default Login;