import { UserButton, auth, currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function Navbar() {
  const { userId } = auth();
    const user = await currentUser();

  return (
    <div className='bg-gray-800 text-white flex justify-between items-center h-20 px-6'>
      <div className='text-2xl font-bold'>TODO</div>
      <div className='flex space-x-8'>
        <Link href={"/"} className='pt-2'>Home</Link>
        <div className='pt-2'><DropdownMenu>
  <DropdownMenuTrigger>DashBoard</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>DashBoard</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem><Link href={"/task"}>Tasks</Link></DropdownMenuItem>
    <DropdownMenuItem><Link href={"/backlog"}>Backlog</Link></DropdownMenuItem>
   
  </DropdownMenuContent>
</DropdownMenu>
</div><div> {userId ? (
                            <div className='flex w-36 justify-end text-sm pr-5 gap-2 items-center'>
                                {user ? `${user.firstName} ${user.lastName}` : "User"} 
                                <UserButton afterSignOutUrl='/signin' />
                            </div>
                        ) : (
                            <div className='flex gap-4 items-center'>
                                <Button><Link href='/signup'>Sign up</Link></Button>
                                <Button><Link href='/signin'>Sign In</Link></Button>
                            </div>
                        )}</div></div></div>
  )
}
