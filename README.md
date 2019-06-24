# Greg's List

https://greg-list.herokuapp.com/

This is a coders take on Craigslist where users can read and create posts from different categories. These categories include Job Listing, Meet ups, and Job Candidates. To help help connect users you can send emails through the website.

## Technology and Installation

This is a full stack app built using Express, MongoDb and EJS.

### Installation

After forking and cloning this repo simply npm install the dependencies, have a database to connect and and start the server with something similiar to nodemon.

### Dependencies

```
bcryptjs,
dotenv,
ejs,
express,
express-session,
nodemailer
```

## User Stories

### MVP

User can register an account
User can login in
User can logout
User can create a post from a specific category
User fills in details about post they create
User can edit and/or delete created posts
User can view lists of posts divided by categories
User can select a post to see more information
User can see a page for a specific user with their information and listings they have posted
User can delete and/or edit their account

### NTH API - nodemailer

User can send emails to other users through the app
Users can RSVP to meet ups
Users can see the list of who is attending a meet up

### Stretch

User can upload images for a posting
more specific profile input fields like phone number, linkdIn, twitter, etc.
display a googleMap within the posting page if they give a specific location in an address field.
Message feature allows DMs between users while on someone's profile.
expiring feature to delete old posts 

## Routes

### User

| Method | Path | Action|
|--------|------|-------|
| GET | /login | page for loging in |
| GET | /register | page to register a user |
| GET | /logout | page to logout |
| GET | /:id | page for user info |
| GET | /:id/message | page to email user |
| GET | /:id/edit | page to edit user |
| GET | /:id/delete | page to delete user |
| PUT | /:id | updates user |
| POST | /register | creates user, starts sesssion |
| POST | /login | logs user in, starts session |
| POST | /messages | sends email to user |
| DELETE | /:id | deletes user and posts, kills the session |

### Post

| Method | Path | Action|
|--------|------|-------|
| GET | / | lists all posts |
| GET | /new | post creation page |
| GET | /hire | hire category page |
| GET | /job | job category page |
| GET | /meet | meet category page |
| GET | /:id | show page for post |
| GET | /:id/attendance | page for list of attendence to an event |
| GET | /:id/edit | page to edit post |
| PUT | /:id/going | marks going for that user for the event |
| PUT | /:id | updats post |
| POST | / | creates post |
| DELETE | /:id | deletes post |

## Models

### User

```
name,
password,
description,
email,
phone,
linkedin,
posts(ref)
```

### Post

```
title,
description,
location,
email,
category,
date,
time,
attendance(ref)
```
