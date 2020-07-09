function makeTestComments() {
    const testComments = [
        {
            user_id: "0d567f6f-b5dc-467c-baf4-15cd0bd59749",
            movie_id: "65842",
            replying_to: "",
            comment: "test comment test comment",
            updated_at: "2020-01-22 19:10:25-07"
        },
        {
            user_id: "4c1d405b-fb34-4e8e-bf5a-094b4a076076",
            movie_id: "1233",
            replying_to: "",
            comment: "test comment test comment2",
            updated_at: "2020-01-22 19:10:25-07"
        },
        {
            user_id: "4b7ea338-0278-4b9f-8a69-2e667d9d568b",
            movie_id: "453",
            replying_to: "",
            comment: "test comment test comment3",
            updated_at: "2020-01-22 19:10:25-07"
        },                
        {
            user_id: "3bcd7cfb-95a5-48fa-be2b-e511c9312e06",
            movie_id: "2562",
            replying_to: "",
            comment: "test comment test comment4",
            updated_at: "2020-01-22 19:10:25-07"
        }        
    ];

    return { testComments };
}

module.exports = {
    makeTestComments
}