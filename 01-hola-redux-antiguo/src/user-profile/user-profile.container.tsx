import { connect } from "react-redux";
import { UserProfileComponent } from "./user-profile.component";
import { AppState } from "../reducers";

const mapStateToProps = (state: AppState) => ({
  name: state.userProfile.name,
});

export const UserProfileContainer =
  connect(mapStateToProps)(UserProfileComponent);
