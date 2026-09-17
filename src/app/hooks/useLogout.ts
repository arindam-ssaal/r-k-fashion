import { useAuth } from '@/store/useAuth';
import { useCookies } from 'react-cookie';
import { GetAPI } from '../../services/apiCall';

export const useLogout = () => {
  const logout = useAuth((state) => state.logout);
  const [cookies, removeCookie] = useCookies(['AccessKey', 'UserId', 'UserName', 'UserRoleId', 'UserRole', 'IsApprovalUser', 'AuthToken', 'SAPApplicable', 'DefaultStoreId']);

  const logUserLogout = async () => {
    try {
      const PJsonData = {};
      const PType = '?UserID=' + cookies.UserId;
      const Pcookies = '';
      const res = await GetAPI('/api/User/UserLogOut', PType, PJsonData, Pcookies);
      console.log("useLogout logUserLogout==>", res);
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  };

  const performLogout = async () => {
    await logUserLogout();
    logout();

    // Clear cookies after logout
    const cookieNames = [
      'AccessKey', 'UserId', 'UserName', 'UserRoleId',
      'UserRole', 'IsApprovalUser', 'AuthToken',
      'SAPApplicable', 'DefaultStoreId'
    ];
    cookieNames.forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;`;
    });
    
    document.cookie = "AccessKey=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
    document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
    document.cookie = "UserName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
    document.cookie = "UserRoleId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
    document.cookie = "UserRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
    document.cookie = "IsApprovalUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
    document.cookie = "AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
    document.cookie = "SAPApplicable=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
    document.cookie = "DefaultStoreId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";

    localStorage.removeItem('UserId');
    localStorage.removeItem('DefaultStoreId');
    localStorage.removeItem('UserRole');
    sessionStorage.clear();
    localStorage.clear();
  };

  return performLogout;
};