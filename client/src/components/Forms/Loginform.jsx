import { useState } from 'react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label" // Fixed typo in import
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function LoginForm({onLogin}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (email  && password.length === 16) {
      localStorage.setItem('credinitals', JSON.stringify({email, password}));
    
      onLogin()
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-screen ">
      {/* Left Panel */}
      <div className="hidden lg:flex bg-[#2A2E33] items-center justify-center p-8">
        <div className="w-[400px]">
          <img
            src="./email-automation/logo.png"
            alt="Kalolwala Logo"
            className="w-full"
          />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] space-y-6 bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-center">Kalolwala Mandate Maker</h1>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-[18px] w-[18px]" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-[18px] w-[18px]" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-yellow-600 hover:text-yellow-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}