### Notes

-   It appears that we try to exchange the code for a token twice:

    ```none
    400 Bad Request

    {
        "error":"invalid_grant",
        "error_description":"Invalid authorization code"
    }
    ```
