
import apiService from './apiService';
import { encryptData, decryptData } from '../common/Function';

//Note:-
export function GetAPI(path, type, PData, PCookies) {
    return new Promise(async (resolve, reject) => {
        try {
            //let pAccessKey = decryptData(PCookies.AccessKey);
            //let pUserId = PCookies.UserId;
            //let pAuthToken = decryptData(PCookies.AuthToken);
            //let pSAPApplicable = decryptData(PCookies.SAPApplicable);
            const response = await apiService.get(`${path}${type}`, {
                params: PData,
                headers: {
                    'Content-Type': 'application/json',
                    // 'AccessKey': pAccessKey,
                    // 'UserId': pUserId,
                    // 'AuthToken': pAuthToken,
                    // 'SAPApplicable': pSAPApplicable,
                },
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

//Note:-
export function PostAPI(path, type, PData, PCookies) {
    return new Promise(async (resolve, reject) => {
        try {
            //let pAccessKey = decryptData(PCookies.AccessKey);
            //let pUserId = PCookies.UserId;
            //let pAuthToken = decryptData(PCookies.AuthToken);
            //let pSAPApplicable = decryptData(PCookies.SAPApplicable);
            const response = await apiService.post(`${path}${type}`, PData, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'AccessKey': pAccessKey,
                    // 'UserId': pUserId,
                    // 'AuthToken': pAuthToken,
                    // 'SAPApplicable': pSAPApplicable,
                },
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

//Note:-
export async function LoginData(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const PJsonData = {};
        const PType = `?LoginID=${username}&LoginPassword=${password}`;
        const res = await GetAPI('/api/User/UserLogin', PType, PJsonData, '');
        //console.log("res==>",res.data[0]);

        if (res.data[0].returnCode === 'Y') {
          const PJsonData2 = {};
          const PType2 = `?UserID=${res.data[0].returnDocEntry}`;
          const res2 = await GetAPI('/api/User/GetUserWiseMenu', PType2, PJsonData2, '');
          //console.log("res 2==>",res2.data);

          if (res2.data && res2.data.objMenu) {
            const pAccessKey = encryptData(res.data[0].returnObjType);
            const pUserId = res.data[0].returnDocEntry;
            const pUserName = username;
            const pUserRoleId = res2.data.roleID;
            const pUserRole = (res2.data.roleName === 'Admininstrator') ? 'Admin' : res2.data.roleName;
            const pIsApprovalUser = 'Y';
            const pAuthToken = encryptData(res.data[0].returnDocNum);
            const pSAPApplicable = encryptData('Y');
            const pDefaultStoreId = res2.data.defaultStoreID;
  
            localStorage.removeItem('UserMenuData');
            localStorage.clear();
            const pUserMenuData = JSON.stringify(res2.data.objMenu);
            localStorage.setItem("UserMenuData", pUserMenuData);
  
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

            //console.log("LoginData() Set Cookie=>", document.cookie); 
            
            const response ={
              UserId: pUserId,
              UserName: pUserName,
              UserRoleId: pUserRoleId,
              UserRole: pUserRole,
              UserEmail: ''
            }
            resolve(response);
          } else {
            reject(new Error('No menu assigned to user'));
          }
        } else {
          reject(new Error(res.data[0].returnMsg || 'Invalid credentials'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }  