import { AppRouter } from '@/router/RouterComponent'; 
import { appRoutes } from '@/router/routeRegistry'; 

function App() {
  return <AppRouter routes={appRoutes} />;
}

export default App;