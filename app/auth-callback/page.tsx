import { useRouter, useSearchParams } from 'next/navigation'

import { trpc } from '../_trpc/client'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')
  const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.replace(origin ? `/${origin}` : '/')
      }
    }
  })

  return <div>Page</div>
}

export default Page
