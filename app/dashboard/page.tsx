import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
const DashboarPage = () => {
  const { getUser } = getKindeServerSession()
  const user = getUser()

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

  return (
    <pre>
      <code>{JSON.stringify(user, null, 2)} </code>
    </pre>
  )
}

export default DashboarPage
