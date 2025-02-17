import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_notes/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_notes/create/"!</div>
}
