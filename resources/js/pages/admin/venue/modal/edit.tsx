import { useModal } from '@/hooks/use-modal';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import AppFullScreenModal from '@/components/app-full-screen-modal';
import { compressImage, createImagePreview } from '@/utils/image-handler';
import { ImageDropZone } from '@/components/ui/image-dropzone';

type Court = {
    id?: number;
    name: string;
};

type VenueForm = {
    _method: string;
    name: string;
    image?: File | string | null;
    imagePreview?: string | null;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    courts: Court[];
};

interface EditVenueModalContentProps {
    venue: {
        id: number;
        name: string;
        image?: string;
        address: {
            address_1: string;
            address_2: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
        courts: Court[];
    };
    onClose?: () => void;
}

function EditVenueModalContent({ venue, onClose }: EditVenueModalContentProps) {
    const { data, setData, post, processing, errors } = useForm<Required<VenueForm>>({
        _method: 'PUT',
        name: venue.name,
        image: venue.image || null,
        imagePreview: venue.image || null,
        address_1: venue.address.address_1,
        address_2: venue.address.address_2,
        city: venue.address.city,
        state: venue.address.state,
        zip: venue.address.zip,
        country: venue.address.country,
        courts: venue.courts.length > 0 ? venue.courts : [{ name: '' }],
    });

    const handleImageSelect = async (file: File) => {
        try {
            const compressedImage = await compressImage(file);
            const preview = await createImagePreview(compressedImage);

            setData(data => ({
                ...data,
                image: compressedImage,
                imagePreview: preview
            }));
        } catch (error) {
            console.error('Error handling image:', error);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.venues.update', venue.id), {
            onSuccess: () => onClose?.(),
        });
    };

    return (
        <form id="edit-venue-form" onSubmit={handleSubmit}>
            <AppFullScreenModal
                title="Edit Venue"
                onClose={onClose}
                isSubmitting={processing}
                submitLabel="Save Changes"
                form="edit-venue-form"
            >
                <div className="flex flex-col gap-8 px-4">
                    {/* Row 1: Image */}
                    <div className="w-full">
                        <div className="grid gap-2">
                            <Label htmlFor="image">Venue Image</Label>
                            <ImageDropZone
                                onImageSelect={handleImageSelect}
                                currentImage={data.imagePreview}
                                disabled={processing}
                                error={errors.image}
                            />
                        </div>
                    </div>

                    {/* Row 2: Venue Details & Courts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Venue Details */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-lg font-medium">Venue Details</h3>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Venue Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                        placeholder="Enter venue name"
                                        autoComplete="off"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address_1">Address Line 1</Label>
                                    <Input
                                        id="address_1"
                                        type="text"
                                        required
                                        value={data.address_1}
                                        onChange={(e) => setData('address_1', e.target.value)}
                                        disabled={processing}
                                        placeholder="Enter street address"
                                        autoComplete="address-line1"
                                    />
                                    <InputError message={errors.address_1} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address_2">Address Line 2</Label>
                                    <Input
                                        id="address_2"
                                        type="text"
                                        value={data.address_2}
                                        onChange={(e) => setData('address_2', e.target.value)}
                                        disabled={processing}
                                        placeholder="Apartment, suite, unit, etc. (optional)"
                                        autoComplete="address-line2"
                                    />
                                    <InputError message={errors.address_2} />
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            required
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter city"
                                            autoComplete="address-level2"
                                        />
                                        <InputError message={errors.city} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="state">State/Province</Label>
                                        <Input
                                            id="state"
                                            type="text"
                                            required
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter state/province"
                                            autoComplete="address-level1"
                                        />
                                        <InputError message={errors.state} />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="zip">Postal Code</Label>
                                        <Input
                                            id="zip"
                                            type="text"
                                            required
                                            value={data.zip}
                                            onChange={(e) => setData('zip', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter postal code"
                                            autoComplete="postal-code"
                                        />
                                        <InputError message={errors.zip} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            type="text"
                                            required
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter country"
                                            autoComplete="country-name"
                                        />
                                        <InputError message={errors.country} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Venue Courts */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Venue Courts</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setData('courts', [...data.courts, { name: '' }])}
                                >
                                    Add Court
                                </Button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {data.courts.map((court, index) => (
                                    <div key={court.id || index} className="flex items-end gap-4">
                                        <div className="flex-1 grid gap-2">
                                            <Label htmlFor={`court-${index}`}>Court Name</Label>
                                            <Input
                                                id={`court-${index}`}
                                                type="text"
                                                required
                                                value={court.name}
                                                onChange={(e) => {
                                                    const updatedCourts = [...data.courts];
                                                    updatedCourts[index].name = e.target.value;
                                                    setData('courts', updatedCourts);
                                                }}
                                                disabled={processing}
                                                placeholder="Enter court name"
                                                autoComplete="off"
                                            />
                                            <InputError message={errors[`courts.${index}.name`]} />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => {
                                                const updatedCourts = data.courts.filter((_, i) => i !== index);
                                                setData('courts', updatedCourts);
                                            }}
                                            disabled={data.courts.length === 1}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AppFullScreenModal>
        </form>
    );
}

interface EditVenueModalProps {
    venue: {
        id: number;
        name: string;
        image?: string;
        address: {
            address_1: string;
            address_2: string;
            city: string;
            state: string;
            zip: string;
            country: string;
        };
        courts: Court[];
    };
}

export function EditVenueModal({ venue }: EditVenueModalProps) {
    const { showModal } = useModal();

    const handleClick = () => {
        showModal(<EditVenueModalContent venue={venue} />, {
            size: 'full'
        });
    };

    return (
        <Button variant="outline" onClick={handleClick} size="sm">
            Edit
        </Button>
    );
}
