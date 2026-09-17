import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { useState } from 'react'
import { Cookies, useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { LoginData } from '../../../../../services/apiCall';

import { encryptData } from '@/common/Function';
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginSchema } from '@/schema/auth.schema'
import { useAuth } from '@/store/useAuth'

// @ts-ignore

function LoginForm() {
  const [isShow, setShow] = useState(false)
  const [cookies] = useCookies(['UserId', 'UserName', 'UserRoleId', 'UserRole', 'DefaultStoreId']);
  /* //Note: Call-> getCookieValue("DefaultStoreId");
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };
  */ 
  const login = useAuth((state) => state.login)
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    //const res = login({ username: values.username, password: values.password })

    try {
      const res = await LoginData(values.username, values.password);
      //console.log(res)
      //console.log("LoginData() Set Cookie=>", cookies);

      const userDetails = {
        id: res.UserId,
        username: res.UserName,
        email: res.UserEmail,
        role: res.UserRole,
      };  
      const dummyAccessToken = btoa(`access-${userDetails.id}-${Date.now()}`);
      const dummyRefreshToken = btoa(`refresh-${userDetails.id}-${Date.now()}`);
      useAuth.getState().setAuth(userDetails, dummyAccessToken, dummyRefreshToken);

      toast.success('Login Successful', {
        style: {
          backgroundColor: '#e3ffea',
          color: '#3ed665',
        },
      });
      
      navigate('/dashboard');    
    } catch (error) {
      //console.error("Login Failed:", error.message);
      toast.error(error.message, {
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      });
    }

    /*
    if (typeof result === 'string') {
      toast.error(`Invalid username or password`, {
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      });
    } else {
      toast.success(`Login Successfully`, {
        style: {
          backgroundColor: '#e3ffea',
          color: '#3ed665',
        },
      });
      navigate('/dashboard');
    }
    */
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* {username} */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#B8D9F0] flex items-center gap-1.5">👤 Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#B8D9F0] opacity-50 pointer-events-none">
                    <User size={16} />
                  </span>
                  <Input
                    className="pl-10 h-11 border border-[rgba(184,217,240,0.15)] bg-[rgba(255,255,255,0.06)] text-[#E8F4FD] placeholder:text-[rgba(184,217,240,0.3)] focus-visible:ring-[rgba(0,180,216,0.12)] focus-visible:ring-offset-0 focus-visible:border-[#00B4D8] focus-visible:bg-[rgba(0,180,216,0.06)] rounded-[10px] text-sm transition-all duration-200"
                    placeholder="Enter your username"
                    autoComplete="username"
                    autoFocus
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* {password} */}
        <FormField 
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] font-bold uppercase tracking-[1.2px] text-[#B8D9F0] flex items-center gap-1.5">🔑 Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#B8D9F0] opacity-50 pointer-events-none">
                    <Lock size={16} />
                  </span>
                  <Input
                    type={isShow ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="pl-10 h-11 border border-[rgba(184,217,240,0.15)] bg-[rgba(255,255,255,0.06)] text-[#E8F4FD] placeholder:text-[rgba(184,217,240,0.3)] focus-visible:ring-[rgba(0,180,216,0.12)] focus-visible:ring-offset-0 focus-visible:border-[#00B4D8] focus-visible:bg-[rgba(0,180,216,0.06)] rounded-[10px] text-sm transition-all duration-200"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((prev) => !prev)}
                    className="absolute right-3 top-3 cursor-pointer text-[#B8D9F0] opacity-50 hover:opacity-100 transition-opacity"
                    title="Show/Hide Password (Alt+P)"
                  >
                    {isShow ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between text-[12px]">
          <label className="flex items-center gap-2 cursor-pointer text-[#B8D9F0]" title="Stay logged in for 8 hours">
            <input type="checkbox" className="w-4 h-4 rounded accent-[#00B4D8]" />
            Remember me
          </label>
          <span className="text-[#00B4D8] cursor-pointer hover:underline text-[12px]" title="Reset your password">Forgot password?</span>
        </div>

        <div>
          <button type="submit" className="login-sign-in-btn mt-2" title="Login to Sapphire POS (Enter)">
            <span>🔐 Sign In</span>
            <span className="text-[11px] opacity-60 px-1.5 py-0.5 rounded" style={{ fontFamily: "'JetBrains Mono', monospace", background: 'rgba(0,0,0,0.2)' }}>Enter ↵</span>
          </button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
