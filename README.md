
  

# Introduction #

  

The purpose of this tool to be built is to make appointment booking system.  

Use your react and node experience to build a simple booking engine.


**You should contact us to ask questions or clarification.**

  
mark.santoso@uprise.co

  
### Project Overview ###

Purpose of this task is to assume you are building a calendar appointment system where users can see available free slots in the booking system and can book for whatever time periods that are available.

1. You need to fork this repo and create the backend project with node.js/express.js with either firestore/firebase/Mongo DB integration for data storage. 

You will need to pre-create one collection of `events` which will hold all the available 30min slots.


Create these static slots for the app in firebase/firestore/mongo:

  
1. Start Hours - The start times of each available slot

4. Timezone - Sydney/Australia


Example Output

startHours: [

'2019-11-14T10:00:00',

'2019-11-14T10:30:00',

'2019-11-14T11:00:00',

'2019-11-14T11:30:00',

....

'2019-11-14T16:30:00',

],
timezone: "Sydney/Australia

  

In case I have an event already at 2019-11-14T10:00:00, that slot should be excluded.

### Endpoints ###

**1.**  **Free Slots:**
  

Params:

- Date

- Timezone

 
  
Return all the free slots available for a given date converted to whatever timezone we pass.

  
Example:


By default the free slots will be like 10AM, 10:30AM, 11:00 AM.. so on, but that is as per the Sydney/Australia (or whatever you will set in config/const)

  

So it simply suggests the coach in the booking system is available from 10AM-5PM as per Sydney/Australia timezone. Now if someone from India wants to book with the coach they will like to see the coaches timing as per IST (GMT+5:30) on the Frontend

  

So in this API you will pass Date and timezone in which you want to see the coaches availability, which will be like these in IST (GMT+5:30). You can use this in order to help you test the timings : [​https://www.thetimezoneconverter.com](https://www.thetimezoneconverter.com/)

  
 

**2.**  **Create event:**

Params:

- Date/Time (You can decide the format, timestamp or date format up to you)

- timezone

 
Whatever data you will pass it will create the event and store that into the fire store document, if the event already exists for that time you need to return status code 422.


**3.**  **Get**​ **Events:**

Params:

- StartDate

- EndDate


Return all the booked time slots display the start and end time of each slot


## UI

  

Create an application UI, build your UI **exactly** to the designs attached below, the sketch file is also in this repo.

  

1. Book Event

- Add datepicker (to choose date) use "react-dates" npm package

- Dropdown to pick timezone (can keep 4-5 limited option)

- Get FreeSlots Button

  

On that button click, fetch the free slots and show them as buttons or labels on UI and on click of one of them create an event with that time.

  

Feel free to ask any further details or if require any further details on this demo task.

  

All the very best!

If you finished the above task and are able to create the example UI for the same in react.js

  

## Uprise packages to use:

  

Note: Documentation is not complete. Use your development skills to work out how these components work under the hood. And please ask questions from the team for clarification.

  

Please use import {DayPickerSingleDateController} from "react-dates" for the calendar picker

  

- @uprise/button

- @uprise/card

- @uprise/grid

- @uprise/text

- @uprise/colors

- @uprise/image

- @uprise/spacing

- @uprise/typography

  

e.g. https://www.npmjs.com/package/@uprise/colors

  

5. When complete please create a PR into this repo

  

**Please use any relevant technologies in the Uprise stack to demonstrate your expertise. E.g. react, react functional components, redux, styled components**

**Please ignore "Duration" drop down, the duration will always be 30min**

![enter image description here](https://uprise-tech-support.s3-ap-southeast-2.amazonaws.com/1+%282%29.png)

![enter image description here](https://uprise-tech-support.s3-ap-southeast-2.amazonaws.com/2+%282%29.png)

![enter image description here](https://uprise-tech-support.s3-ap-southeast-2.amazonaws.com/3+%282%29.png)

![enter image description here](https://uprise-tech-support.s3-ap-southeast-2.amazonaws.com/4+%281%29.png)

  

![enter image description here](https://uprise-tech-support.s3-ap-southeast-2.amazonaws.com/5+%281%29.png)


**A successful test submission will have**

 1. Completed both tasks (Backend and UI)
 2. Followed all instructions give above
 3. Used Uprise packages as instructed
 4. Created a PR into the repo
