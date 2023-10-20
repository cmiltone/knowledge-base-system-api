type User = {
    _id?: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    role: 'admin' | 'user' | 'expert';
    password: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
};