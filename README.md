# johnny-code-logger README

johnny-code-logger is a VSCode extension created by Paul Lunn for the Johnny project at the Open University, Milton Keynes, UK.

# set up

This plug in works in tandem with johnny-django-docker which provides a REST API to a database which stores all information.
After the database has been set up, you need to change the const BASE_REST_URL which can be found in extension.ts to the url for the server database.

# How this works

This extension will send the following data to the remote server:

* Copy of any python source file that is saved
* The contents of the clipboard when ever a paste occurs
* A copy of the users firefox browser history
