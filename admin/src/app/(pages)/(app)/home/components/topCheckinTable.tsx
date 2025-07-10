'use client'

import Image from 'next/image'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'

type PlaceRanking = {
   placeId: number
   name: string
   checkInCount: number
   ranking: number
}

type UserRanking = {
   userId: number
   firstName: string
   lastName: string
   avatarUrl: string
   point: number
   checkInCount: number
   ranking: number
}

type Props = {
   data: PlaceRanking[] | UserRanking[]
   type: 'places' | 'users'
}

export function TopCheckInTable({ data, type }: Props) {
   const isPlaceRanking = type === 'places'

   return (
      <Card className='flex flex-col w-full h-full p-4 bg-white rounded-lg shadow-md'>
         <h2 className='text-lg font-semibold text-blue2 mb-4'>
            {isPlaceRanking ? 'Top địa điểm check-in' : 'Top người dùng check-in'}
         </h2>
         <div className='border-2 border-blue2 rounded-lg'>
            <Table className='overflow-hidden'>
               <TableHeader className='border-b-[1px] border-blue2'>
                  <TableRow>
                     <TableHead className='text-blue2'>Hạng</TableHead>
                     {isPlaceRanking ? (
                        <>
                           <TableHead className='text-blue2'>Tên địa điểm</TableHead>
                           <TableHead className="text-right text-blue2">Số lượt Check-in</TableHead>
                        </>
                     ) : (
                        <>
                           <TableHead className='text-blue2'>Người dùng</TableHead>
                           <TableHead className="text-right text-blue2">Điểm</TableHead>
                           <TableHead className="text-right text-blue2">Check-in</TableHead>
                        </>
                     )}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {isPlaceRanking
                     ? (data as PlaceRanking[]).map((item) => (
                        <TableRow key={item.placeId}>
                           <TableCell>{item.ranking}</TableCell>
                           <TableCell>{item.name}</TableCell>
                           <TableCell className="text-right pr-8">{item.checkInCount}</TableCell>
                        </TableRow>
                     ))
                     : (data as UserRanking[]).map((item) => (
                        <TableRow key={item.userId}>
                           <TableCell>{item.ranking}</TableCell>
                           <TableCell className="flex items-center gap-2">
                              <Image
                                 src={item.avatarUrl || "/avatar-placeholder.jpg"}
                                 alt="avatar"
                                 width={24}
                                 height={24}
                                 className="rounded-full"
                              />
                              {item.firstName} {item.lastName}
                           </TableCell>
                           <TableCell className="text-right">{item.point}</TableCell>
                           <TableCell className="text-right pr-8">{item.checkInCount}</TableCell>
                        </TableRow>
                     ))
                  }
               </TableBody>
            </Table>
         </div>
      </Card>
   )
}
