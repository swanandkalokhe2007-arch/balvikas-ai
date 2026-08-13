import { ChildRegisterForm } from '../../components/ChildRegisterForm'

export function ParentRegister() {
  return (
    <ChildRegisterForm
      successPath="/parent"
      title="Register my child"
      subtitle="Add your child to BalVikas — height, weight, and village details are saved to your account"
      lockParentName
    />
  )
}
