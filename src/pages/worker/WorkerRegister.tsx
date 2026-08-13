import { ChildRegisterForm } from '../../components/ChildRegisterForm'

export function WorkerRegister() {
  return (
    <ChildRegisterForm
      successPath="/worker/children"
      title="Child registration"
      subtitle="Add a child to the Anganwadi roster — saved on the live server"
    />
  )
}
