import { Address } from '@/lib/types/type';
import React, { useState } from 'react'
import { useAddOrUpdateAddressMutation, useGetAddressesQuery } from '../store/api';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import BookLoader from '@/lib/BookLoader';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTrigger, Dialog, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
interface addressResponse {
    success: boolean;
    message: string;
    data: {
        addresses: Address[]
    }
}


interface CheakoutAddressProps {
    onAddressSelect: (address: Address) => void;
    selectedAddress: string | null | undefined;
}

export const CheakoutAddress: React.FC<CheakoutAddressProps> = ({ onAddressSelect, selectedAddress }) => {
    const { data: addressData, isLoading, refetch } = useGetAddressesQuery() as {
        isLoading: boolean;
        data: addressResponse | undefined;
        refetch: () => void;
    };

    const [addOrUpdateAddress] = useAddOrUpdateAddressMutation();
    const [showAddressFrom, setShowAddressFrom] = useState(false);
    const [editAddress, setEditAddress] = useState<Address | null>(null);
    const address = addressData?.data?.addresses || [];


    const addressFromSchema = zod.object({

        phoneNumber: zod.string().min(10, 'Phone number is required'),
        pincode: zod.string().min(6, 'Pincode is required'),
        state: zod.string().min(3, 'State is required'),
        city: zod.string().min(3, 'City is required'),
        addressLine1: zod.string().min(5, 'Address is required'),
        addressLine2: zod.string().min(5, 'Address is required'),
    })
    type AddressFromValues = zod.infer<typeof addressFromSchema>;
    const form = useForm<AddressFromValues>({
        resolver: zodResolver(addressFromSchema),
        defaultValues: {
            phoneNumber: '',
            pincode: '',
            state: '',
            city: '',
            addressLine1: '',
            addressLine2: '',
        }
    })

    const handleEditAddress = (address: Address) => {
        setEditAddress(address);
        setShowAddressFrom(true);
        form.reset(address);

    }

    const onSubmit = async (data: AddressFromValues) => {

        try {

            if (editAddress) {
                const updateAddress = { ...editAddress, ...data, addressId: editAddress._id };
                await addOrUpdateAddress(updateAddress).unwrap();
                refetch();

            } else {
                await addOrUpdateAddress(data).unwrap();
                refetch();

            }

            form.reset();
            setShowAddressFrom(false);
            setEditAddress(null);

        } catch (err) {
            console.log(err);
        }
    }

    if (isLoading) {
        return <BookLoader />;
    }
    return (

        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>

                {address.map((item) => (
                    <Card key={item._id} className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${selectedAddress === item._id ? "border-blue-500 shadow-md" : "border-blue-200 shadow-md hover:shadow-lg"}`}>
                        <CardContent className='p-1 space-y-2 text-sm'>
                            <Checkbox checked={selectedAddress === item._id} onCheckedChange={() => onAddressSelect(item)} className='w-4 h-4' />



                            <div className='flex items-center justify-between'>
                                <Button size='icon' variant='ghost' onClick={() => handleEditAddress(item)}><PencilIcon className='w-4 h-4 text-gray-500 hover:text-blue-500' /></Button>



                                <div className='flex flex-col gap-2'>
                                    <div className=''>

                                        <span>{item.state}</span>

                                    </div>
                                    <div className=''>

                                        <span>{item.phoneNumber}</span>
                                    </div>
                                    <div className=''>

                                        <span>{item.addressLine1}</span>
                                        <span>{item.addressLine2}</span>

                                    </div>
                                    <div className='flex justify-start'>


                                        <span className='mr-1'>{item.city}</span>
                                        <span>({item.pincode})</span>

                                    </div>
                                </div>
                            </div>
                            <div className='hidden'>

                                <button onClick={() => onAddressSelect(item)}>Select</button>
                            </div>
                        </CardContent>
                    </Card>

                ))}

            </div>

            <Dialog open={showAddressFrom} onOpenChange={setShowAddressFrom}>

                <DialogTrigger asChild>
                    <Button className='w-full' variant='outline'>
                        <PlusIcon className='w-4 h-4' />
                        {editAddress ? 'Update Address' : 'Add Address'}

                    </Button>

                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editAddress ? 'Update Address' : 'Add Address'}
                        </DialogTitle>

                    </DialogHeader>
                    <DialogContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name='phoneNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Phone Number' {...field} />

                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='pincode'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pincode</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Pincode' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='state'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input placeholder='State' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='city'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder='City' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='addressLine1'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address Line 1</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Address Line 1' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='addressLine2'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address Line 2</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Address Line 2' {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type='submit'>
                                    {editAddress ? 'Update Address' : 'Add Address'}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </DialogContent>
            </Dialog>
        </div>
    )
}
