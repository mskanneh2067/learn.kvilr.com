export const filterUserProfile = (userProfile, ...fieldsToUpdate) => {
  const updatedProfile = {};
  Object.keys(userProfile).forEach((e) => {
    if (fieldsToUpdate.includes(e)) updatedProfile[e] = userProfile[e];
  });
  return updatedProfile;
};
