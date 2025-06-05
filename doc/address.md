# Address API Spec

## Create Address

Endpoint : POST /api/contacts/:id_contact/addresses

Request Header :

- X-API-TOKEN : {token}

Request Body :

```json
{
    "street" : "Jl. Murai",
    "city" : "Medan",
    "province" : "Sumatera Utara",
    "country" : "Indonesia",
    "postal_code" : "12345"
}
```

Response Body (Success) :

```json
{
    "data" : {
        "id" : 1,
        "street" : "Jl. Murai",
        "city" : "Medan",
        "province" : "Sumatera Utara",
        "country" : "Indonesia",
        "postal_code" : "12345"
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "city must not blank."
}
```

## Get Address

Endpoint : GET /api/contacts/:id_contact/addresses/:id_address

Request Header :

- X-API-TOKEN : {token}

Response Body (Success) :

```json
{
    "data" : {
        "id" : 1,
        "street" : "Jl. Murai",
        "city" : "Medan",
        "province" : "Sumatera Utara",
        "country" : "Indonesia",
        "postal_code" : "12345"
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "Address not found."
}
```

## Update Address

Endpoint : PUT /api/contacts/:id_contact/addresses/:id_address

Request Header :

- X-API-TOKEN : {token}

Request Body :

```json
{
        "street" : "Jl. Murai",
        "city" : "Medan",
        "province" : "Sumatera Utara",
        "country" : "Indonesia",
        "postal_code" : "12345"
}
```

Response Body (Success) :

```json
{
    "data" : {
        "id" : 1,
        "street" : "Jl. Murai",
        "city" : "Medan",
        "province" : "Sumatera Utara",
        "country" : "Indonesia",
        "postal_code" : "12345"
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "Unauthorized."
}
```

## Delete Address

Endpoint : DELETE /api/contacts/:id_contact/addresses/:id_address

Request Header :

- X-API-TOKEN : {token}

Response Body (Success) :

```json
{
    "data" : "Success"
}
```

Response Body (Failed) :

```json
{
    "errors" : "Unauthorized."
}
```

## List Address

Endpoint : GET /api/:id_contact/addresses

Request Header :

- X-API-TOKEN : {token}

Response Body (Success) :

```json
{
    "data" : [
        {
            "id" : 1,
            "street" : "Jl. Murai",
            "city" : "Medan",
            "province" : "Sumatera Utara",
            "country" : "Indonesia",
            "postal_code" : "12345"
        }, {
            "id" : 2,
            "street" : "Jl. Murai",
            "city" : "Medan",
            "province" : "Sumatera Utara",
            "country" : "Indonesia",
            "postal_code" : "12345"
        }
    ],
}
```

Response Body (Failed) :

```json
{
    "errors" : "Unauthorized."
}
```
