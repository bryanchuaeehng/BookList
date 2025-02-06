## Overview

Booklist is a web application using Sqlite and Django on the back-end, and JavaScript on the front-end. It is also fully mobile-responsive. Booklist enables users to organise, consolidate and keep track of all books they are reading, in one web app. It also recommends books for the user to read. Users can also create and edit playlists to consolidate similar books. Booklist also provides statistics on users' reading habits, and allows users to add friends with other users and view their reading habits and statistics.


## On the index page,
There is a sliding carousel for recommended books that the user might be interested in - one for books that the user is currently in the midst of reading, one for books the user has yet to read, and one for the user's favorite books. The preview for these recommended books displays the book cover, their genre(s), ratings, and the user's review or description of the book.

All books are neatly organised into sections. There are horizontal scroll sections for users' books they are currently reading, books they have read before, and their favorite books (ones they give a 5/5 rating for). The books in these horizontal scroll sections come with a cover image, their title, and a bar below the image indicating the user's current progress in reading the book. The length of the bar depends on the user's current progress in the book, with an empty bar indicating the book being unread and a full bar indicating completion of the book. There is also a vertical section for books that are yet to be read. A larger image and title are provided for these books, along with the books' genres. In order to not overly stretch the page vertically, a maximum of 10 books are displayed initially, and there are "show more" and "show all" buttons that load the next 10 books and all the books respectively. The horizontal scroll section at the bottom of the page shows the user's playlists, including their title and playlist cover image, and there is a button that triggers a popup for users to create a new playlist.

Clicking on any of the books' images will redirect users to the book's page, where they can see more details about the book, make edits, and save them to playlists.

There are navigation buttons at the top left corner of the page to navigate users to the "friends" page, "profile" page, and the playlists section. On the top right corner of the page is a search bar where users can look for books. Searches are done asynchronously upon every key entered and results are shown without a need for the user to submit the search form. A pop up section appears over the rest of the page to show the search results and these search results also act to redirect users to the book's page when clicked on. There is also a button for users to log out.

Just above the vertical section for books that are yet to be read, there is a button labelled "Add Book". Clicking on this button triggers a popup interface where users can add a book. In this popup, the image reflected asynchronously updates upon every key pressed, reflecting the image that the book's cover will have. In this popup, genres can be added to a book via badge buttons, where badge buttons light up when clicked, visually showing users the genres that will apply to this book. There is also appropriate logic and error checking done on the server and client side for the form, with an error message presented to the user if an error occurs.


## On the playlist page,
The cover image of the playlist and its name is presented at the top of the page. Below it is a list of all the books in that playlist. The books' details are organised into sections, showing the book cover image, title, genres in the form of badges, rating in the form of stars, and a truncated description/review of the book. Clicking on the "read more" for each description will show the full description of the book. Clicking on the image or title of a book redirects users to that book's page.

Hovering over rows will also highlight them for a comfortable user experience. Initially, the cover image and name of the playlist takes up a big portion of the screen, but upon scrolling down, this cover section shrinks but continues to stay on the page, so users can focus more on the books while still being able to see the playlist they are viewing. Scrolling back up to the top of the page reverts the cover section to its original big size.

There are buttons at the top of the screen. One for users to return to the previous page they were on, and one for users to edit the playlist. Clicking on the edit button makes deletion buttons appear, and users can click on them to remove books from the playlist. An animation also plays when a book is removed.


## On the book page,
all details of the book is displayed, including:

* The image
* The title
* The current page the user is at, total pages of the book, and the user's progress that is also visually supported by a progress bar
* The rating, supported by a stars display
* The genre(s)
* The description/review

The image, title and "read" button all redirect users to read the book. There is also a button at the top left of the screen to return users to the previous page they were on.

There are edit icons for the current page and the description, clicking on which replaces the current page and description sections respectively with a form for users to make edits and a button to submit the form. Clicking on the stars displayed for the book's rating also sends a request to the backend, and makes a change to the book's rating. Updates are done on both the front and back end for all edits.

Additionally, there is a "Add to playlist" button at the foot of the page that, when clicked, shows a popup form with a selection list of all the user's playlists. Making selections on the form outlines the selection to inform users of their selections, and the submit button lights up. As adding to playlists can be a lengthy process, a loading animation is used in the meantime.


## On the friends page,
users can see the people they are friends with and visit friends' profile pages. On the other section of the friends page, users can search for other users and send friend requests to them.

Queries are made asynchronously upon every key pressed and matching results are shown. For each search result, users can click on a button to send a friend request to that user. If two users send friend requests to each other, they will be registered as friends.


## On the profile page,
users are able to see the profile of a user. The target user's profile will only be shown if that target user is the requesting logged in user, or a friend of the requesting logged in user. An error page will be shown otherwise.

The profile page comprises two vertical scroll sections - the left one for the user's profile picture, username, and a list of the user's friends, and the right one for the user's statistics and reading habits.

If a user views their own profile, there is an option for the user to trigger a popup for them to change their profile picture. The new profile picture is also presented to the user upon every key pressed such that the user is able to see a preview of their new profile picture before actually changing it. Friends of the target user are also displayed in the same vertical scroll section, and clicking on any username will bring users to that target user's profile page.

On the right scroll section of the page is a chart that shows users their reading statistics, comparing the number of books they have read, are in the midst of reading, and have yet to read. This chart is displayed within a carousel, such that users can toggle the chart between a bar graph and a pie chart. Below this, the user's top 3 favorite genres are shown. Further below this, some of the target user's favorite books and recently added books are displayed in separate horizontal scroll sections.


## Other pages
Other pages in this web application include a registration page, login page, and an error page that displays an error message and code when an error occurs.
