import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cart"!</div>
}
