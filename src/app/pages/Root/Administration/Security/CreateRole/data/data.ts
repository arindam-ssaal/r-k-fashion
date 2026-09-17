export interface CreateRoleData {
  roleID: number;
  roleName: string;
  isActive?: string;
  remarks?: string;
  enteredBy?: number;
  usedFor?: any;
  objRoleWiseMenu?: any[];
}
