import RouterComponent from "./router/RouterComponent.tsx";
import {useAuth} from "./features/auth/hooks/useAuth.ts";

const App = () => {
  const {user, loading} = useAuth();

  if (loading) return <p>Loading...</p>

  return (
      <RouterComponent user={user}/>
  )
}

export default App;