import * as React from "react";
import { GithubMemberEntity } from "../model";
import classes from "./member-list.component.module.css";

interface Props {
  members: GithubMemberEntity[];
  loadMembers: () => void;
}

export const MemberListComponent = (props: Props) => {
  React.useEffect(() => {
    props.loadMembers();
  }, []);

  return (
    <>
      <h2>Members Page</h2>
      <div className={classes.container}>
        <span className={classes.header}>Avatar</span>
        <span className={classes.header}>Id</span>
        <span className={classes.header}>Name</span>
        {props.members.map((member) => (
          <React.Fragment key={member.id}>
            <img src={member.avatar_url} />
            <span>{member.id}</span>
            <span>{member.login}</span>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
