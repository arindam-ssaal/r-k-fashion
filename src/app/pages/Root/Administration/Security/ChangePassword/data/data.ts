export const data: ChangePasswordData[] = [
    {
      userId: "101",
      userName: "John Doe",
      modifiedOn: "09-09-2024 15:09:09",
      
    },
    {
      userId: "102",
      userName: "Jane Smith",
      modifiedOn: "09-09-2024 15:09:09",
     
    },
    {
      userId: "103",
      userName: "Alice Johnson",
      modifiedOn: "09-09-2024 15:09:49",
    },
    {
      userId: "104",
      userName: "Bob Brown",
      modifiedOn: "09-09-2024 15:09:19",
    },
    {
      userId: "105",
      userName: "Charlie White",
      modifiedOn: "09-09-2024 15:09:09",
    },
  ];
  
  export type ChangePasswordData = {
    userId: string; // Unique identifier for the user
    userName: string; // Name of the user
    modifiedOn: string;
  };
  