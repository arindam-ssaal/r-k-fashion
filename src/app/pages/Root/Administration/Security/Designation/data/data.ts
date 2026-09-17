export const data: DesignationData[] = [
    {
      id: "1",
      designation: "Administrator",
    },
    {
      id: "2",
      designation: "Editor",
    },
    {
      id: "3",
      designation: "Viewer",
    },
    {
      id: "4",
      designation: "Contributor",
    },
    {
      id: "5",
      designation: "Moderator",
    },
  ];
  
  export type DesignationData = {
    id: string; // Unique identifier
    designation: string; // Role name
  };
  