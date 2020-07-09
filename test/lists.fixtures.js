function makeTestLists() {
    const testLists = [
        {
            user_id: "0d567f6f-b5dc-467c-baf4-15cd0bd59749",
            date_added: "2020-01-22 19:10:25-07",
            list_name: "test list 42"
        },
        {
            user_id: "4c1d405b-fb34-4e8e-bf5a-094b4a076076",
            date_added: "2020-01-22 19:10:25-07",
            list_name: "test list 45"
        },
        {
            user_id: "4b7ea338-0278-4b9f-8a69-2e667d9d568b",
            date_added: "2020-01-22 19:10:25-07",
            list_name: "test list 47"
        },                
        {
            user_id: "3bcd7cfb-95a5-48fa-be2b-e511c9312e06",
            date_added: "2020-01-22 19:10:25-07",
            list_name: "test list 56"
        }        
    ];

    const testItems = [
        {
            title: "0d567f6f-b5dc-467c-baf4-15cd0bd59749",
            date_added: "2020-01-22 19:10:25-07"
        },
        {
            title: "4c1d405b-fb34-4e8e-bf5a-094b4a076076",
            date_added: "2020-01-22 19:10:25-07"
        },
        {
            title: "4b7ea338-0278-4b9f-8a69-2e667d9d568b",
            date_added: "2020-01-22 19:10:25-07"
        },                
        {
            title: "3bcd7cfb-95a5-48fa-be2b-e511c9312e06",
            date_added: "2020-01-22 19:10:25-07"
        }     
    ];

    return { testLists, testItems };
}

module.exports = {
    makeTestLists
}