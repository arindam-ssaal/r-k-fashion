  const formattedData = UserMasterFormatter(
    {
      ...data,
      loginID: data.loginId,
      profileID: Number(data.defineProfile),
      roleID: Number(data.defineRole),
      defaultStoreID: 1, // Replace with a valid store ID
      enteredBy: 0, // Replace with the actual enteredBy value
      objStore: [], // Replace with the actual objStore value
      mobile: data.mobileNo,      // Correct mapping
      whatsApp: data.whatsappNo,  // Correct mapping
      employeeID: data.employeeId, // Correct mapping for required field
    },
    String(userMasterData?.[0]?.loginID)
  ) 