import { auth } from '@clerk/nextjs'

const adminId = ['user_2f7cjnaNEMhnomhgRuOMicVs6gu']

export const isAdmin = () => {
  const { userId } = auth()

  if (!userId) {
    return false
  }

  return adminId.indexOf(userId) !== -1
}
