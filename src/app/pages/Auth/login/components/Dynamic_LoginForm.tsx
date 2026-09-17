import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { useState } from 'react'
import { Cookies, useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { GetAPI } from '../../../../../services/apiCall';

import { encryptData, decryptData } from '@/common/Function';
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
    //Note: User Login API
    let PJsonData = {};
    let PType = '?LoginID=' + values.username + '&LoginPassword=' + values.password;
    let cookies = '';
    let res = await GetAPI('/api/User/UserLogin', PType, PJsonData, cookies);
    console.log("res==>",res.data[0]);

    if (res.data[0].returnCode === 'Y') {
      //Note: User wsie Menu
      let PJsonData2 = {};
      let PType2 = '?UserID=' + res.data[0].returnDocEntry;
      let cookies2 = '';
      let res2 = await GetAPI('/api/User/GetUserWiseMenu', PType2, PJsonData2, cookies2);
      console.log("res 2==>",res2.data);
      if (res2.data && res2.data.objMenu) {
        let pAccessKey = encryptData(res.data[0].returnObjType);
        let pUserId =  res.data[0].returnDocEntry; //res2.data.userId;
        let pUserName = values.username;
        let pUserRoleId = res2.data.roleID; 
        let pUserRole = res2.data.roleName; //'admin'; //'Admininstrator'; //(responseJson.Table[0].IsApprovalUser === 'Y') ? 'Admin' : 'User'; //Note: Temp used, need to remove asap
        let pIsApprovalUser = 'Y'; //res.data[0].returnSeries
        let pAuthToken = encryptData(res.data[0].returnDocNum);
        let pSAPApplicable = encryptData('Y');
        let pDefaultStoreId = res2.data.defaultStoreID;
  
        localStorage.removeItem('UserMenuData');
        localStorage.clear();
        let pUserMenuData = JSON.stringify(res2.data.objMenu);
        localStorage.setItem("UserMenuData", pUserMenuData);

        localStorage.removeItem('UserId');
        localStorage.removeItem('DefaultStoreId');
        localStorage.removeItem('UserRole');
        localStorage.clear();
        localStorage.setItem('UserId', pUserId);
        localStorage.setItem('DefaultStoreId', pDefaultStoreId)
        localStorage.setItem('UserRole', pUserRole)
  
        document.cookie = `AccessKey=${pAccessKey}; path=/; Max-Age=86400;`;
        document.cookie = `UserId=${pUserId}; path=/; Max-Age=86400;`;
        document.cookie = `UserName=${pUserName}; path=/; Max-Age=86400;`;
        document.cookie = `UserRoleId=${pUserRoleId}; path=/; Max-Age=86400;`;
        document.cookie = `UserRole=${pUserRole}; path=/; Max-Age=86400;`;
        document.cookie = `IsApprovalUser=${pIsApprovalUser}; path=/; Max-Age=86400;`;
        document.cookie = `AuthToken=${pAuthToken}; path=/; Max-Age=86400;`;
        document.cookie = `SAPApplicable=${pSAPApplicable}; path=/; Max-Age=86400;`;
        document.cookie = `DefaultStoreId=${pDefaultStoreId}; path=/; Max-Age=86400;`;
        document.cookie = `UserMenuData=${pUserMenuData}; path=/; Max-Age=86400;`;
        console.log("LoginForm Set Cookie=>", document.cookie); 

        toast.success(res.data[0].returnMsg, { //`Login Successfully`
          style: {
            backgroundColor: '#e3ffea',
            color: '#3ed665',
          },
        });

        navigate('/dashboard');
      } else{
        toast.error(`Invalid user: no menu assigned`, {
          style: {
            backgroundColor: '#f7edeb',
            color: '#ff6242',
          },
        });        
      }      
    } else {
      toast.error(res.data[0].returnMsg, {   //`Invalid username or password`
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      });
    }


    /*
    if (typeof res === 'string') {
      toast.error(`Invalid username or password`, {
        style: {
          backgroundColor: '#f7edeb',
          color: '#ff6242',
        },
      })
    } else {
      let pAccessKey = encryptData('564B323D61345748363A5C303247325A31315C4E30633F323662314A5531614D344F42323D3930333632'); //encryptData(responseJson.Table[0].AccessKey);
      let pUserId =  1; //responseJson.Table[0].UserId;
      let pUserName = 'rickzi3'; //responseJson.Table[0].UserName;
      let pUserRoleId = 1; 
      let pUserRole = 'admin'; //'Admininstrator'; //(responseJson.Table[0].IsApprovalUser === 'Y') ? 'Admin' : 'User'; //Note: Temp used, need to remove asap
      let pIsApprovalUser = 'Y'; //responseJson.Table[0].IsApprovalUser;
      let pAuthToken = encryptData('574C333D61345546343C5E323247325A3131635537623E31383133495430314E354F42323D3930333632'); //encryptData(responseJson.Table[0].AuthToken);
      let pSAPApplicable = encryptData('Y'); //encryptData(responseJson.Table[0].SAPApplicable);
      let pDefaultStoreId = 1;

      // localStorage.removeItem('UserMenuData');
      // localStorage.clear();
      // let pUserMenuData = JSON.stringify(responseJson.Table1);
      // localStorage.setItem("UserMenuData", pUserMenuData);

      document.cookie = `AccessKey=${pAccessKey}; path=/; Max-Age=86400;`;
      document.cookie = `UserId=${pUserId}; path=/; Max-Age=86400;`;
      document.cookie = `UserName=${pUserName}; path=/; Max-Age=86400;`;
      document.cookie = `UserRoleId=${pUserRoleId}; path=/; Max-Age=86400;`;
      document.cookie = `UserRole=${pUserRole}; path=/; Max-Age=86400;`;
      document.cookie = `IsApprovalUser=${pIsApprovalUser}; path=/; Max-Age=86400;`;
      document.cookie = `AuthToken=${pAuthToken}; path=/; Max-Age=86400;`;
      document.cookie = `SAPApplicable=${pSAPApplicable}; path=/; Max-Age=86400;`;
      document.cookie = `DefaultStoreId=${pDefaultStoreId}; path=/; Max-Age=86400;`;
      //document.cookie = `UserMenuData=${pUserMenuData}; path=/; Max-Age=86400;`;
      //console.log("LoginForm Set Cookie"=>,document.cookie);    

      toast.success(`Login Successfully`, {
        style: {
          backgroundColor: '#e3ffea',
          color: '#3ed665',
        },
      })
      navigate('/dashboard')
      // setTimeout(() => {
      //   navigate('/dashboard')
      // }, 500);
    }
    */
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* {username} */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Username</FormLabel>
              <FormControl>
                {/* <Input className='border-none' placeholder="Username" autoComplete="username" {...field} /> */}
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <User size={16} />
                  </span>
                  <Input
                    className="pl-9 border-none"
                    placeholder="Username"
                    autoComplete="username"
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  {/* Password Icon */}
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <Input
                    type={isShow ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Password"
                    className="pl-9 border-none"
                    {...field}
                  />
                  {/* Show/Hide Password Toggle */}
                  <span
                    onClick={() => setShow((prev) => !prev)}
                    className="absolute right-3 top-2.5 cursor-pointer text-gray-400"
                  >
                    {isShow ? <Eye size={16} /> : <EyeOff size={16} />}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-end ">
          <Button type="submit" className="mt-2">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
