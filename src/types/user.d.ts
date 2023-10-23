type User = {
    _id?: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: 'admin' | 'user' | 'creator';
    password: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
};