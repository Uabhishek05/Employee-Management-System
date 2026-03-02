import React, { useState } from 'react'

const Login = () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const users = [
    {
      email: "admin@ems.com",
      password: "admin123",
      role: "admin",
    },
    {
      email: "employee@ems.com",
      password: "emp123",
      role: "employee",
    },
  ];

  const submitHandler = (e) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    alert(`Logged in as ${user.role}`);
    localStorage.setItem("role", user.role);

    if (user.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/employee";
    }

    setemail('');
    setpassword('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-emerald-900 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white/5 px-10 py-10 backdrop-blur-xl shadow-2xl hover:shadow-emerald-500/20 transition duration-all duration-500">
        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
            className="w-full px-6 py-3 rounded-full bg-transparent border border-emerald-400/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            className="w-full px-6 py-3 rounded-full bg-transparent border border-emerald-400/60 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          />

          <button
            type="submit"
            className="px-6 py-2 rounded-full shadow-lg shadow-emerald-500/30 bg-emerald-500 text-white font-medium hover:bg-emerald-400 hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm text-gray-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Remember me
          </label>

          <a href="#" className="hover:text-emerald-400">
            Forgot password?
          </a>
        </div>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login
