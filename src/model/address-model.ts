import { Address } from "@prisma/client";

export type AddressResponse = {
    id: number;
    street: string;
    city: string;
    province: string;
    country: string;
    postal_code: string | null;
};

export type CreateAddressRequest = {
    contact_id: number;
    street: string;
    city: string;
    province: string;
    country: string;
    postal_code?: string | null;
};

export type GetAddressRequest = {
    id: number;
    contact_id: number;
};

export type UpdateAddressRequest = {
    id: number;
    contact_id: number;
    street: string;
    city: string;
    province: string;
    country: string;
    postal_code?: string | null;
};

export type RemoveAddressRequest = GetAddressRequest;

export function toAddressResponse(address: Address): AddressResponse {
    return {
        id: address.id,
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        postal_code: address.postal_code,
    };
}
