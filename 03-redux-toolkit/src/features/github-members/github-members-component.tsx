import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembersAsync, selectMembers } from "./github-members.slice";
import styles from "./github-members.component.module.css";
import { AppDispatch } from "../../app-store/store";

export const GithubMembersComponent = () => {
  const members = useSelector(selectMembers);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchMembersAsync());
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Github Members</h2>
      <div className={styles.container}>
        <div className={styles.header}>Avatar</div>
        <div className={styles.header}>Id</div>
        <div className={styles.header}>Login</div>
        {members.map((member) => (
          <React.Fragment key={member.id}>
            <img src={member.avatar_url} alt="avatar" />
            <div>{member.id}</div>
            <div>{member.login}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
