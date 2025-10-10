export interface User {
    id: string;
    name: string;
    email: string;
    token: string;
}

export interface AuthSignUp {
    name: string;
    email: string;
    password: string;
}

export interface AuthSignIn {
    email: string;
    password: string;
}