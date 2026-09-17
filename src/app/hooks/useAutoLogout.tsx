import { useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import { useCookies } from 'react-cookie';

import { GetAPI } from '../../services/apiCall';
import { useLogout } from './useLogout';

const useAutoLogout = () => { console.log("useAutoLogout")
  //const logout = useAuth((state) => state.logout);
  const logout = useLogout();
  const [cookies, removeCookie] = useCookies(['AccessKey', 'UserId', 'UserName', 'UserRoleId', 'UserRole', 'IsApprovalUser', 'AuthToken', 'SAPApplicable', 'DefaultStoreId']);

  useEffect(() => {
    /*
    const logUserLogout = async () => {
      try {
        const PJsonData = {};
        const PType = '?UserID=' + cookies.UserId;
        const Pcookies = '';
        const res = await GetAPI('/api/User/UserLogOut', PType, PJsonData, Pcookies);
        console.log("res==>", res.data[0]);
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    };
    logUserLogout();
    */
   
    // ✅ Logout only on Tab Close (Ignore Reload)
    const handleTabClose = (event: BeforeUnloadEvent) => {
      // Check if the user is closing the tab (not reloading)
      if (!event.currentTarget?.performance?.navigation) return;

      const navigationType = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type;

      if (navigationType === "navigate") {
        logout();  // ✅ Logout only on tab close
      }
    };

    window.addEventListener('beforeunload', handleTabClose);

    // ✅ Auto Logout on Inactivity (1 min / 15 min)
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        logout();
      }, 15 * 60 * 10000); // 1 minute / 15 minute
    };

    // 🖱️ User Activity Events
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);

    // Start timer on load
    resetInactivityTimer();

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      window.removeEventListener('scroll', resetInactivityTimer);
      window.removeEventListener('click', resetInactivityTimer);
      clearTimeout(inactivityTimer);

      /*
      document.cookie = "AccessKey=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
      document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
      document.cookie = "UserName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
      document.cookie = "UserRoleId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
      document.cookie = "UserRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
      document.cookie = "IsApprovalUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
      document.cookie = "AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
      document.cookie = "SAPApplicable=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
      document.cookie = "DefaultStoreId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;";
      */
      //document.cookie = `UserMenuData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Max-Age=0;`;

      /*
      removeCookie('AccessKey');
      removeCookie('UserId');
      removeCookie('UserName');
      removeCookie('UserRoleId');
      removeCookie('UserRole');
      removeCookie('IsApprovalUser');
      removeCookie('AuthToken');
      removeCookie('SAPApplicable');
      removeCookie('DefaultStoreId');
      removeCookie('UserMenuData');
      */

      //localStorage.removeItem('UserMenuData');
      //localStorage.clear();
    };
  }, [logout]);
};

export default useAutoLogout;
