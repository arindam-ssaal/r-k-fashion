export const data: User[] = [
    {
      userId: "101",
      username: "John Doe",
      usercode: "JD123",
      userpassword: "password123",
    },
    {
      userId: "102",
      username: "Jane Smith",
      usercode: "JS456",
      userpassword: "mypassword",
    },
    {
      userId: "103",
      username: "Alice Johnson",
      usercode: "AJ789",
      userpassword: "alicepass",
    },
    {
      userId: "104",
      username: "Bob Brown",
      usercode: "BB321",
      userpassword: "bobsecure",
    },
    {
      userId: "105",
      username: "Charlie White",
      usercode: "CW654",
      userpassword: "charliepass",
    },
  ];
  
  export type User = {
    userId: string; // Unique identifier for the user
    username: string; // Name of the user
    usercode: string; // Code for the user
    userpassword: string; // Password for the user
  };
  