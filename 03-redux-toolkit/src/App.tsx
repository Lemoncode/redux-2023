import "./App.css";
import { UserProfileComponent } from "./features/user-profile/user-profile.component";
import { GithubMembersComponent } from "./features/github-members/github-members-component";

function App() {
  return (
    <>
      <header>Redux 2023 - Boilerplate</header>
      <main>
        <UserProfileComponent />
        <GithubMembersComponent />
      </main>
    </>
  );
}

export default App;
