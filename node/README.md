## server side application to handle booking slots
## This app usees CVT components described as below.

- Define data models.
- Define data methods using those models that will be used to do DB operations such as insert, update, delete.

## There are three major methods while creating a CVT component.

* `check` - Tthis method checks the incoming `params` in request body and returns a true status if satisfies the checks otherwise false.
* `validate` - Tthis method validates the incoming request. It interacts with the DB and checks for things like already existing record, auth etc, returbs a true status if satisfies the checks otherwise false.
* `transact` - Tthis methods performs the final operation. It calls the data methods previously defined and inserts, updates or deletes document.

### Note: Instead of defining multiple routes onlay a single route is defined and opeartions are done based on op codes such as create, update, delete.

component contains slot componet - to handle cvt
data methods contains slot data methods - to handle data transaction between mongo and component
schema contains - slot schema

deploayed app to heroku - https://uprisebooking.herokuapp.com/api