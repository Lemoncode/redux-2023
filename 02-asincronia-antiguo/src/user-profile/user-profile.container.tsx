import { connect } from "react-redux";
import { UserProfileComponent } from "./user-profile.component";
import { AppState } from "../reducers";
import { BaseAction, createUpdateUserNameAction } from "../actions";
import { Dispatch } from "redux";

const mapStateToProps = (state: AppState) => ({
  name: state.userProfile.name,
});

const mapDispatchToProps = (dispatch: Dispatch<BaseAction>) => ({
  onUpdateUserName: (name: string) =>
    dispatch(createUpdateUserNameAction(name)),
});

export const UserProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfileComponent);
