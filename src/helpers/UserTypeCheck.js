export const userTypeAdminCheck = (userProfile) => {
  const isAdmin =
    userProfile?.user_type === 'UT001' || userProfile?.user_type === 'UT002';

  return isAdmin;
};
