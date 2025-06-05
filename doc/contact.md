# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts

Request Header :

- X-API-TOKEN : {token}

Request Body :

```json
{
    "first_name" : "Budi",
    "last_name" : "Sahputra",
    "email" : "budpoetra@gmail.com",
    "phone" : "08130812803"
}
```

Response Body (Success) :

```json
{
    "data" : {
        "id" : 1,
        "first_name" : "Budi",
        "last_name" : "Sahputra",
        "email" : "budpoetra@gmail.com",
        "phone" : "08130812803"
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "first_name must not blank."
}
```

## Get Contact

Endpoint : GET /api/contacts/:id

Request Header :

- X-API-TOKEN : {token}

Response Body (Success) :

```json
{
    "data" : {
        "id" : 1,
        "first_name" : "Budi",
        "last_name" : "Sahputra",
        "email" : "budpoetra@gmail.com",
        "phone" : "08130812803"
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "Contact not found."
}
```

## Update Contact

Endpoint : PUT /api/contacts/:id

Request Header :

- X-API-TOKEN : {token}

Request Body :

```json
{
        "first_name" : "Budi",
        "last_name" : "Sahputra",
        "email" : "budpoetra@gmail.com",
        "phone" : "08130812803"
}
```

Response Body (Success) :

```json
{
    "data" : {
        "first_name" : "Budi",
        "last_name" : "Sahputra",
        "email" : "budpoetra@gmail.com",
        "phone" : "08130812803"
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "Unauthorized."
}
```

## Delete Contact

Endpoint : DELETE /api/contacts/:id

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

## Search Contact

Endpoint : GET /api/contacts

Request Header :

- X-API-TOKEN : {token}

Query Parameter

- name : string, contact first name or last name, optional
- phone : string, contact phone, optional
- email : string, contact email, optional
- page : number, default 1
- size : number, default 10

Response Body (Success) :

```json
{
    "data" : [
        {
            "id" : 1,
            "first_name" : "Budi",
            "last_name" : "Sahputra",
            "email" : "budpoetra@gmail.com",
            "phone" : "08130812803"
        }, {
            "id" : 2,
            "first_name" : "Budi",
            "last_name" : "Sahputra",
            "email" : "budpoetra@gmail.com",
            "phone" : "08130812803"
        }
    ],
    "paging" : {
        "current_page" : 1,
        "total_page" : 10,
        "size" : 10
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "Unauthorized."
}
```
