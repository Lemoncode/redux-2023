export interface UserProfileState {
  name: string;
}

export const createDefaultUserProfile = (): UserProfileState => ({
  name: "Sin nombre",
});

export const userProfileReducer = (
  state: UserProfileState = createDefaultUserProfile(),
  action: any
) => {
  return state;
};
