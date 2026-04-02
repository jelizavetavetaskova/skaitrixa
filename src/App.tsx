import RouterComponent from "./router/RouterComponent.tsx";
import {useAuth} from "./features/auth/useAuth.ts";

const App = () => {
  const {user, loading} = useAuth();

  if (loading) return <p>Loading...</p>

  return (
    <RouterComponent user={user} loading={loading}/>
  )
}

export default App;