import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "../reducers";
import { MemberListComponent } from "./member-list.component";
import { BaseAction, fetchMembersRequest } from "../actions";

const mapStateToProps = (state: AppState) => ({
  members: state.members,
});

// Toma leche con moloko !!
// Esto habría que darle una vuelta para hacerlo más elegante
type DispatchWithThunk = Dispatch<BaseAction> | ((arg: any) => void);

const mapDispatchToProps = (dispatch: DispatchWithThunk) => ({
  loadMembers: () => dispatch(fetchMembersRequest()),
});

export const MemberListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberListComponent);
