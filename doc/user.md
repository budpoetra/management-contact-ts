# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
    "username" : "budpoetra",
    "password" : "password",
    "name" : "Budi Sahputra"
}
```

Response Body (Success) :

```json
{
    "data" : {
        "username" : "budpoetra",
        "name" : "Budi Sahputra"
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "Username must not blank."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
    "username" : "budpoetra",
    "password" : "password",
}
```

Response Body (Success) :

```json
{
    "data" : {
        "username" : "budpoetra",
        "name" : "Budi Sahputra",
        "token" : "{token}"
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "Username or Password wrong."
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :

- X-API-TOKEN : {token}

Response Body (Success) :

```json
{
    "data" : {
        "username" : "budpoetra",
        "name" : "Budi Sahputra",
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "Unauthorized."
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :

- X-API-TOKEN : {token}

Request Body :

```json
{
    "password" : "password", // Optional
    "name" : "Budi" // Optional
}
```

Response Body (Success) :

```json
{
    "data" : {
        "username" : "budpoetra",
        "name" : "Budi",
    }
}
```

Response Body (Failed) :

```json
{
    "errors" : "Unauthorized."
}
```

## Logout User

Endpoint : DELETE /api/users/current

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
