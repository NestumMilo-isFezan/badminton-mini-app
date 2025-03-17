import axios from 'axios';
import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler, useEffect, useState } from 'react';
import AppFullScreenModal from '@/components/app-full-screen-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type UserForm = {
    _method?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    roles: string;
    phone: string;
    gender: string;
    avatar?: File | null;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
};

interface UserModalContentProps {
    user?: {
        id: number;
        [key: string]: any;
    };
    onClose?: () => void;
}

function UserModalContent({ user, onClose }: UserModalContentProps) {
    const isEditing = !!user;
    const [isLoading, setIsLoading] = useState(isEditing);

    const { data, setData, post, processing, errors } = useForm<UserForm>({
        _method: isEditing ? 'PUT' : '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        roles: 'player',
        phone: '',
        gender: 'male',
        avatar: null,
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (isEditing && user.id) {
                try {
                    setIsLoading(true);
                    const response = await axios.get(route('admin.users.edit', user.id));
                    const userData = response.data;

                    setData({
                        _method: 'PUT',
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        email: userData.email,
                        password: '',
                        roles: userData.roles,
                        phone: userData.profile?.phone || '',
                        gender: userData.profile?.gender || 'male',
                        avatar: null,
                        address_1: userData.profile?.address?.address_1 || '',
                        address_2: userData.profile?.address?.address_2 || '',
                        city: userData.profile?.address?.city || '',
                        state: userData.profile?.address?.state || '',
                        zip: userData.profile?.address?.zip || '',
                        country: userData.profile?.address?.country || '',
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user?.id]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            post(route('admin.users.update', user.id), {
                onSuccess: () => onClose?.(),
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => onClose?.(),
            });
        }
    };

    if (isLoading) {
        return (
            <AppFullScreenModal
                title={isEditing ? 'Edit User' : 'Create User'}
                onClose={onClose}
                isSubmitting={processing}
                submitLabel={isEditing ? 'Save Changes' : 'Create User'}
                form="user-form"
            >
                <div className="flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AppFullScreenModal>
        );
    }

    return (
        <form id="user-form" onSubmit={handleSubmit}>
            <AppFullScreenModal
                title={isEditing ? 'Edit User' : 'Create User'}
                onClose={onClose}
                isSubmitting={processing}
                submitLabel={isEditing ? 'Save Changes' : 'Create User'}
                form="user-form"
            >
                <div className="space-y-6 p-6">
                    {/* Account Information Card */}
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={e => setData('first_name', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={e => setData('last_name', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder={isEditing ? 'Leave blank to keep current password' : 'Enter password'}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="roles">Role</Label>
                                <Select
                                    value={data.roles}
                                    onValueChange={(value) => setData('roles', value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="player">Player</SelectItem>
                                        <SelectItem value="umpire">Umpire</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.roles} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Information Card */}
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select
                                    value={data.gender}
                                    onValueChange={(value) => setData('gender', value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.gender} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information Card */}
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle>Address Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="address_1">Address Line 1</Label>
                                <Input
                                    id="address_1"
                                    value={data.address_1}
                                    onChange={e => setData('address_1', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.address_1} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address_2">Address Line 2</Label>
                                <Input
                                    id="address_2"
                                    value={data.address_2}
                                    onChange={e => setData('address_2', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.address_2} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.city} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        value={data.state}
                                        onChange={e => setData('state', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.state} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="zip">ZIP Code</Label>
                                    <Input
                                        id="zip"
                                        value={data.zip}
                                        onChange={e => setData('zip', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.zip} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={e => setData('country', e.target.value)}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.country} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppFullScreenModal>
        </form>
    );
}

interface CreateEditUserModalProps {
    user?: {
        id: number;
        [key: string]: any;
    };
}

export function CreateEditUserModal({ user }: CreateEditUserModalProps) {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal(<UserModalContent user={user} />, {
            size: 'full'
        });
    };

    // If user prop exists, it's an edit button
    if (user) {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                className="border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
                Edit
            </Button>
        );
    }

    // Otherwise, it's a create button
    return (
        <Button onClick={handleClick}>
            Create User
        </Button>
    );
}
