import { usersData } from './data'

export function loginUser({ username, password }: { username: string; password: string }) {
  if (!username || !password) {
    return 'Please Give valid username and password'
  }
  const user = usersData.find((item) => item.username === username)

  if (!user) return 'There is no user with this username'

  return user
}
