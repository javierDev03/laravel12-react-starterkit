import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    clinic_name: string;
    clinic_address: string;
    clinic_phone: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        clinic_name: '',
        clinic_address: '',
        clinic_phone: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* Usuario */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Clínica */}
                    <div className="grid gap-2">
                        <Label htmlFor="clinic_name">Clinic Name</Label>
                        <Input
                            id="clinic_name"
                            type="text"
                            required
                            value={data.clinic_name}
                            onChange={(e) => setData('clinic_name', e.target.value)}
                            disabled={processing}
                            placeholder="Clinic name"
                        />
                        <InputError message={errors.clinic_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="clinic_address">Clinic Address</Label>
                        <Input
                            id="clinic_address"
                            type="text"
                            required
                            value={data.clinic_address}
                            onChange={(e) => setData('clinic_address', e.target.value)}
                            disabled={processing}
                            placeholder="Clinic address"
                        />
                        <InputError message={errors.clinic_address} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="clinic_phone">Clinic Phone</Label>
                        <Input
                            id="clinic_phone"
                            type="text"
                            required
                            value={data.clinic_phone}
                            onChange={(e) => setData('clinic_phone', e.target.value)}
                            disabled={processing}
                            placeholder="Clinic phone"
                        />
                        <InputError message={errors.clinic_phone} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')}>Log in</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
