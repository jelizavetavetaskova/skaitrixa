import RouterComponent from "./router/RouterComponent.tsx";
import {useAuth} from "./features/auth/hooks/useAuth.ts";
import Navbar from "./shared/components/Navbar.tsx";

const App = () => {
  const {user, loading} = useAuth();

  if (loading) return <p>Loading...</p>

  return (
        <RouterComponent user={user} loading={loading}/>
  )
}

export default App;