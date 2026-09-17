import ApiClient from "./apiClient";

interface User {
  id: number;
  username: string;
  email: string;
}

class UserClient extends ApiClient {
  constructor() {
    super("http://abc.com",{withAuth:true,enableRefreshToken:true});
  }

  // ✅ Fetch All Users
  public async getAllUsers(): Promise<User[]> {
    try {
      const response = await this.get<User[]>('/users');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch users:', error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }
}

export default new UserClient();
