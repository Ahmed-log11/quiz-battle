import { useEffect, useState } from 'react'
import HostFlow from './host/HostFlow.jsx'
import PlayerFlow from './play/PlayerFlow.jsx'
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

  // Projector screen for the instructor
  if (route === '/host') {
    return <HostFlow />
  }

  // '/' and '/play' are the student screens
  return <PlayerFlow onHost={() => (location.hash = '#/host')} />
}
