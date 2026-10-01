import { useEffect, useState } from 'react'
import Welcome from './Welcome.jsx'
import HostLobby from './host/HostLobby.jsx'
import Preview from './Preview.jsx'

// Returns the current route: '/', '/host', '/play', or '/preview'
function getRoute() {
  const path = location.hash.slice(1).split('?')[0]
  return path || '/'
}

function useRoute() {
  const [route, setRoute] = useState(getRoute)
  useEffect(() => {
    const onChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export default function App() {
  const route = useRoute()

  // Every screen with fake data, for checking the design
  if (route === '/preview') {
    return <Preview />
  }

  if (route === '/host') {
    return (
      <HostLobby
        code="KQZT"
        players={[
          { name: 'Sara', connected: true },
          { name: 'Abdullah', connected: true },
          { name: 'Noura', connected: false },
        ]}
        onStart={() => console.log('start')}
      />
    )
  }

  // '/' and '/play' both show the welcome screen for now
  return (
    <Welcome
      onJoin={({ code, name }) => console.log('join', code, name)}
      onHost={() => (location.hash = '#/host')}
    />
  )
}
