export type Customer = {
  id: string
  phoneNo: number
  status: 'active' | 'inactive'
  email: string
  fullName: string
  city: string
  state: string
  pin: string
  address: string
  dateOfBirth: string
  createdOn: string
}

export const data: Customer[] = [
  {
    id: 'm5gr84i9',
    phoneNo: 8946872327,
    status: 'active',
    email: 'ken99@yahoo.com',
    fullName: 'Kenneth Johnson',
    city: 'New York',
    state: 'NY',
    pin: '10001',
    address: '123 Broadway Ave',
    dateOfBirth: '1985-06-15',
    createdOn: '2023-01-10',
  },
  {
    id: '3u1reuv4',
    phoneNo: 9123456780,
    status: 'inactive',
    email: 'Abe45@gmail.com',
    fullName: 'Abigail Turner',
    city: 'Los Angeles',
    state: 'CA',
    pin: '90001',
    address: '456 Sunset Blvd',
    dateOfBirth: '1990-09-25',
    createdOn: '2023-03-22',
  },
  {
    id: 'derv1ws0',
    phoneNo: 9988776655,
    status: 'active',
    email: 'Monserrat44@gmail.com',
    fullName: 'Monserrat Garcia',
    city: 'Chicago',
    state: 'IL',
    pin: '60601',
    address: '789 Lake Shore Dr',
    dateOfBirth: '1988-12-05',
    createdOn: '2023-05-18',
  },
  {
    id: '5kma53ae',
    phoneNo: 8877665544,
    status: 'active',
    email: 'Silas22@gmail.com',
    fullName: 'Silas Brown',
    city: 'Houston',
    state: 'TX',
    pin: '77001',
    address: '321 Main St',
    dateOfBirth: '1975-03-30',
    createdOn: '2023-07-14',
  },
  {
    id: 'bhqecj4p',
    phoneNo: 7766554433,
    status: 'inactive',
    email: 'carmella@hotmail.com',
    fullName: 'Carmella Smith',
    city: 'Phoenix',
    state: 'AZ',
    pin: '85001',
    address: '654 Desert Rd',
    dateOfBirth: '1992-11-20',
    createdOn: '2023-09-05',
  },
  {
    id: 'bhq4p',
    phoneNo: 8932792232,
    status: 'inactive',
    email: 'uman@hotmail.com',
    fullName: 'uman Smith',
    city: 'fixes',
    state: 'RJ',
    pin: '85001',
    address: '654 Desert Rd',
    dateOfBirth: '1992-11-20',
    createdOn: '2023-09-05',
  },
]
