function makeTestUsers() {
    const dbUsers = [
        {
            "name": "michaelkors19",
            "email": "mike@bags.com",
            "password": "$2a$08$VSrv3xjABpmUUOqgcVSEa.WWZ1KWR8Amh1EfVk9YsUeQZOgQ8qALa",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "user"
        },
        {
            "name": "sillysally24",
            "email": "salgal@yahoo.ca",
            "password": "$2a$08$LmvXJt1WrZDcSR8KZPp.peZ7SLEXLS1njFBQNMAsDIxOpfhMastwm",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "user"
        },
        {
            "name": "davidd",
            "email": "davidd@gmail.com",
            "password": "$2a$08$PLlnk/lr.KTGGV6HBGC9oOvNh0AXxED879WbbhLk.VyeOU.Zs4DTy",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "user"
        },
        {
            "name": "admin",
            "email": "admin@admin.com",
            "password": "$2a$08$P4OTv/zif.sq167vtLRSlOuO34r28U4saJX/A4DoQOcooV90NCDWW",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "admin"
        }        
    ];

    const validLogins = [
        {
            "name": "michaelkors19",
            "email": "mike@bags.com",
            "password": "imakehandbags",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "user"
        },
        {
            "name": "sillysally24",
            "email": "salgal@yahoo.ca",
            "password": "imsilly",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "user"
        },
        {
            "name": "davidd",
            "email": "davidd@gmail.com",
            "password": "imdavid",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "user"
        },
        {
            "name": "admin",
            "email": "admin@admin.com",
            "password": "adminpass",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "admin"
        }        
    ];

    const invalidPasswords = [
        {
            "name": "michaelkors19",
            "email": "mike@bags.com",
            "password": "imakehandbagsdfd",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "user"
        },
        {
            "name": "sillysally24",
            "email": "salgal@yahoo.ca",
            "password": "imsillgfgy",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "user"
        },
        {
            "name": "davidd",
            "email": "davidd@gmail.com",
            "password": "imdavidfgd",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "user"
        },
        {
            "name": "admin",
            "email": "admin@admin.com",
            "password": "adminpasssfg",
            "created_at": "2020-01-22 19:10:25-07",
            "perm_level": "admin"
        }        
    ];

    const invalidUsernames = [
        {
            name: "michealkors19",
            email: "mike@bags.com",
            password: "imakehandbags",
            created_at: "2020-01-22 19:10:25-07",
            perm_level: "user"
        },
        {
            name: "silllysally24",
            email: "salgal@yahoo.ca",
            password: "imsilly",
            created_at: "2020-01-22 19:10:25-07",
            perm_level: "user"
        },
        {
            name: "david",
            email: "davidd@gmail.com",
            password: "imdavid",
            created_at: "2020-01-22 19:10:25-07",
            perm_level: "user"
        },
        {
            name: "admmin",
            email: "admin@admin.com",
            password: "adminpass",
            created_at: "2020-01-22 19:10:25-07",
            perm_level: "admin"
        }        
    ];

    return { dbUsers, validLogins, invalidPasswords, invalidUsernames };
}

module.exports = {
    makeTestUsers
}