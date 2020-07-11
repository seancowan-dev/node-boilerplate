# Findthatmovie (Node) [API]
Access the site here: https://findthatmovie-client.now.sh/

This is the API to see the source for the Client go here: https://github.com/seancowan-dev/findthatmovie-client

Screenshot: https://pasteboard.co/Jfz65U0.png

This application allows users to search for movie trailers and to leave comments about the movies they have watched.  In addition they can create lists to store movies they have watched, or want to watch.  This is enabled with one-click adding on the individual pages for each movie.  It uses the TMDB.org API as the source for the movie data, and YouTube as the source of the trailers. 

I developed this at Thinkful as version 2 of my earlier app of the same name: https://github.com/seancowan-dev/findthatmovie

The purpose of rebuilding this app in React is to show my ability to use a variety of technologies, and my ability to learn React in a short time frame (6 months).  The feature set of this app has been adjusted so that users can actually leave comments themselves.  The addition of the list feature, and the removal of text reviews from TMDB.org create a more streamlined user experience.

## Why This App Was Made

We've all gone through the same process when trying to find a new movie to either go see at a theatre, or stream at home.  You know the one; where you go to IMDB or some similar site, looks for new titles, then you go to youtube and watch some trailers, then you try to find reviews of the movie on Reddit.  Finally after all that you decide that particular movie isn't for you and you go back to the list and start the whole process over again.

To solve that I made Findthatmovie.  Now you can keep a list of movies you've watched, or want to watch, and find trailers all in one place.  Future versions will also provide links directly to 3rd party streaming services to further expedite the time it takes from wanting to watch to actually watching.

## API

The API is running here: https://secure-inlet-58346.herokuapp.com/

## Summary of API Endpoints

Every endpoint is authenticated by a client API key.  Some endpoints require user-level authentication.

### /api/users/ 
This endpoint is concerned with managing user accounts and performing CRUD operations for those accounts.

| Sub-path | Description |
| ----------- | ----------- |
| /add | Non-authenticated endpoint so that new users can add new accounts to the site. |
| /getAllUsers | Restricted access endpoint for admin users only.  This is for getting a list of all users to moderate user accounts. |
| /info/:id | Authenticated endpoint, users can access info about thier own accounts.  Admins may also access info about any account. |
| /delete/:id | Restricted access endpoint for admin users only.  This *deletes* a user account by id. |
| /update/:id | Authenticated endpoint, users can update their own accounts.  Admins may also access info about any account. |
| /login | Authenticated endpoint, this endpoint logs users in against their account credentials.  Must have valid credentials. |
| /refresh | Token Endpoint, this refreshes the JSON Web Token for the currently logged in user. |

### /api/comments/
This endpoint is concerned with managing user comments that have been posted about movies.

| Sub-path | Description |
| ----------- | ----------- |
| /add | Authenticated endpoint, only registered users may post comments under their own account name. |
| /get/user/:id | Authenticated endpoint, gets all of a users comments for use in the client. |
| /get/movie/:id | Non-authenticated endpoint, used by the client to get all the comments made on a particular movie. |
| /get/:id | Non-authenticated endpoint, used by the client to get a single comment. |
| /get/reply/:id | Non-authenticated endpoint, used by the client to get a single movie comment reply. (Reply to another comment) |

### /api/lists/
This endpoint is concerned with managing custom lists which the users have made to store movie titles in.

| Sub-path | Description |
| ----------- | ----------- |
| /add | Authenticated endpoint, adds a blank list with a user-specified name to the user's account. |
| /addItem | Authenticated endpoint, adds a specified movie title to the specified list attached to the user's account. |
| /get | Restricted access endpoint for admin users only. Gets all of the lists which have been added by all users. |
| /getList/:id | Authenticated endpoint, gets a specified user list by id. Users may only view lists that they own.  Admins have full access. |
| /deleteList | Authenticated endpoint, deletes a specificed list from a user's account.  Users may only delete lists that they own.  Admins have full access. |
| /deleteListItem | Authenticated endpoint, deleted a specified list item from a specified list from a user's account.  Users may only delete list items in lists that they own.  Admins have full access. |
| /updateList/:id | Authenticated endpoint, updates a specified list from a user's account.  Users may only update lists that they own.  Admins have full access. |
| /updateItem/:id | Authenticated endpoint, updates a specified list item from a specified list from a user's account.  Users may only updates lists that they own. Admins have full access. |



## Technology Used

The application is built on HTML, CSS, JavaScript, React + MobX, and Node with Express and PGSQL
