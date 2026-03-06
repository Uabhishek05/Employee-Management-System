import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const devCredentials = [
  { role: 'Admin', name: 'Abhishek Upadhyay', email: 'abhishek.admin@ems.com', password: 'Admin@123' },
  { role: 'Employee', name: 'Aarav Mehta', email: 'aarav@ems.com', password: 'Aarav@123' },
  { role: 'Employee', name: 'Sana Khan', email: 'sana@ems.com', password: 'Sana@123' },
  { role: 'Employee', name: 'Vikram Rao', email: 'vikram@ems.com', password: 'Vikram@123' },
  { role: 'Employee', name: 'Neha Sharma', email: 'neha@ems.com', password: 'Neha@123' },
  { role: 'Employee', name: 'Rohan Singh', email: 'rohan@ems.com', password: 'Rohan@123' },
]

const Login = () => {
  const { login, authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateForm = () => {
    if (!email || !password) {
      return 'Email and password are required.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.'
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.'
    }

    return ''
  }

  const submitHandler = (event) => {
    event.preventDefault()
    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setLoading(true)

    setTimeout(() => {
      const isSuccess = login(email, password)
      if (!isSuccess) {
        setError('Invalid email or password.')
      }
      setLoading(false)
    }, 1200)
  }

  const fillCredentials = (emailValue, passwordValue) => {
    setEmail(emailValue)
    setPassword(passwordValue)
    setError('')
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(22,185,150,0.22),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(83,130,255,0.17),transparent_35%),linear-gradient(135deg,#020617,#040b1e_48%,#010108)] px-4 py-6 sm:px-6 md:px-10 lg:px-14'>
      <div className='absolute inset-0 pointer-events-none opacity-35 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:3px_3px]' />
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute -left-16 top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl' />
        <div className='absolute right-4 top-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl' />
      </div>

      <div className='relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-3xl border border-white/15 bg-black/20 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-sm lg:grid-cols-2'>
        <section className='hidden flex-col justify-between border-r border-white/10 bg-[linear-gradient(140deg,rgba(6,28,67,0.55),rgba(7,87,76,0.4),rgba(2,15,40,0.5))] p-10 lg:flex'>
          <div>
            <p className='mb-3 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-100'>
              Employee Workspace
            </p>
            <h1 className='text-4xl font-bold leading-tight text-white'>Employee Management System</h1>
            <p className='mt-4 max-w-md text-base text-white/75'>
              Manage tasks, teams, and productivity efficiently.
            </p>
          </div>

          <div className='space-y-4'>
            <p className='flex items-center gap-3 text-2xl font-semibold text-white'>
              <span className='text-rose-400'>✓</span>
              <span>Task Tracking</span>
            </p>
            <p className='flex items-center gap-3 text-2xl font-semibold text-white'>
              <span className='text-sky-400'>✓</span>
              <span>Team Collaboration</span>
            </p>
            <p className='flex items-center gap-3 text-2xl font-semibold text-white'>
              <span className='text-emerald-400'>✓</span>
              <span>Productivity Insights</span>
            </p>
          </div>

          <div className='relative mt-8 overflow-hidden rounded-2xl border border-white/20 bg-black/20 p-5'>
            <div className='absolute -left-10 top-8 h-28 w-40 rotate-12 rounded-full bg-cyan-300/20 blur-2xl' />
            <div className='absolute right-4 -top-8 h-24 w-24 rounded-full bg-emerald-300/20 blur-2xl' />
            <div className='relative rounded-xl border border-white/20 bg-white/85 p-4 shadow-lg'>
              <div className='mb-3 flex gap-2'>
                <span className='h-2.5 w-2.5 rounded-full bg-red-400' />
                <span className='h-2.5 w-2.5 rounded-full bg-amber-400' />
                <span className='h-2.5 w-2.5 rounded-full bg-emerald-400' />
              </div>
              <div className='space-y-2'>
                <div className='h-3 rounded bg-slate-200' />
                <div className='h-3 w-11/12 rounded bg-slate-200' />
                <div className='h-3 w-9/12 rounded bg-slate-200' />
              </div>
              <div className='mt-4 grid grid-cols-3 gap-2'>
                <div className='h-10 rounded bg-sky-200' />
                <div className='h-10 rounded bg-emerald-200' />
                <div className='h-10 rounded bg-orange-200' />
              </div>
            </div>
          </div>
        </section>

        <section className='flex items-center justify-center p-5 sm:p-8 lg:p-12'>
          <div className='w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8'>
            <h2 className='text-3xl font-bold text-white'>Welcome Back 👋</h2>
            <p className='mt-2 text-sm text-white/70'>Sign in to continue to your dashboard.</p>

            <form onSubmit={submitHandler} className='mt-6 space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-white/90'>Email</label>
                <div className='relative'>
                  <input
                    type='email'
                    placeholder='Email your email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className='w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 pl-11 text-white placeholder:text-white/45 outline-none transition-all duration-300 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/40'
                  />
                  <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/70'>✉</span>
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white/90'>Password</label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className='w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 pl-11 pr-24 text-white placeholder:text-white/45 outline-none transition-all duration-300 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/40'
                  />
                  <span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/70'>🔒</span>
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-3 py-1 text-xs text-white transition-all duration-300 hover:bg-white/20'
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center gap-2 text-white/80'>
                  <input
                    type='checkbox'
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className='h-4 w-4 rounded border-white/30 bg-transparent accent-emerald-400'
                  />
                  Remember Me
                </label>
                <a href='#' className='text-emerald-300 transition-colors duration-300 hover:text-emerald-200'>
                  Forgot Password?
                </a>
              </div>

              <div className='min-h-6 text-sm text-red-300'>{error || authError}</div>

              <button
                type='submit'
                disabled={loading}
                className='w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 px-4 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70'
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className='my-5 flex items-center gap-3'>
              <span className='h-px flex-1 bg-white/15' />
              <span className='text-xs text-white/60'>or continue with</span>
              <span className='h-px flex-1 bg-white/15' />
            </div>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <button
                type='button'
                className='flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/25 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/35'
              >
                <svg viewBox='0 0 48 48' className='h-5 w-5' aria-hidden='true'>
                  <path fill='#FFC107' d='M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.242 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z' />
                  <path fill='#FF3D00' d='M6.306 14.691l6.571 4.819C14.655 16.108 19.003 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z' />
                  <path fill='#4CAF50' d='M24 44c5.166 0 9.86-1.977 13.409-5.193l-6.19-5.238C29.147 35.091 26.715 36 24 36c-5.221 0-9.618-3.329-11.283-7.946l-6.522 5.025C9.5 39.556 16.227 44 24 44z' />
                  <path fill='#1976D2' d='M43.611 20.083H42V20H24v8h11.303a12.043 12.043 0 0 1-4.084 5.569l.003-.002 6.19 5.238C36.97 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z' />
                </svg>
                Continue with Google
              </button>
              <button
                type='button'
                className='flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/25 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/35'
              >
                <svg viewBox='0 0 24 24' className='h-5 w-5 fill-white' aria-hidden='true'>
                  <path d='M12 .5C5.649.5.5 5.649.5 12A11.5 11.5 0 0 0 8.36 22.74c.57.104.78-.247.78-.55 0-.272-.011-1.17-.016-2.121-3.181.692-3.853-1.351-3.853-1.351-.52-1.322-1.27-1.674-1.27-1.674-1.038-.71.079-.696.079-.696 1.148.081 1.752 1.179 1.752 1.179 1.02 1.748 2.676 1.243 3.328.95.103-.739.399-1.243.726-1.529-2.54-.289-5.212-1.27-5.212-5.653 0-1.249.447-2.271 1.178-3.071-.118-.29-.51-1.452.112-3.027 0 0 .96-.307 3.146 1.173a10.94 10.94 0 0 1 5.728 0c2.185-1.48 3.143-1.173 3.143-1.173.624 1.575.232 2.737.114 3.027.733.8 1.176 1.822 1.176 3.071 0 4.395-2.677 5.36-5.224 5.643.41.354.775 1.049.775 2.114 0 1.526-.013 2.757-.013 3.131 0 .305.205.659.786.547A11.503 11.503 0 0 0 23.5 12C23.5 5.649 18.351.5 12 .5z' />
                </svg>
                Continue with GitHub
              </button>
            </div>

            <p className='mt-6 text-center text-xs text-white/60'>© 2026 Employee Management System</p>

            <div className='mt-5 rounded-xl border border-white/15 bg-black/25 p-3'>
              <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-200'>Credentials</p>
              <div className='grid grid-cols-1 gap-2'>
                {devCredentials.map((account) => (
                  <button
                    key={account.email}
                    type='button'
                    onClick={() => fillCredentials(account.email, account.password)}
                    className='rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-left text-xs text-white/85 transition-all duration-300 hover:bg-white/10'
                  >
                    <span className='font-semibold text-emerald-200'>{account.role}:</span> {account.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
