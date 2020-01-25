Backend Flask Api and Frontend React/Typescript chart component displaying data

Video Demo ( https://streamable.com/s08jm )

This solution may be run on both OS X and Windows machines, make sure that you're on the latest Nodejs version, make sure that ports (:5000, :3000) are available and UN-USED by other applications/processes.


As an aid to the user / UX I have provided a dropdown list for selectable device UUID's present in the data set, as well  as provided suggestion buttons for end_time timestamps to display relevant data.


This project is grouped into folders for the backend api as well as the frontend react/typescript application:

/api (backend Flask API server)

/frontend (React/Typescript frontend application)


Instructions for running the project:

First you can run the backend API server by running the following commands:

`cd api`

`pip install -r requirements.txt`

`python api.py` (making sure to start the API server)

You can then proceed to running the frontend application by switching to the frontend folder, (FROM PROJECT ROOT):

`cd frontend`

`yarn install`

`yarn start` (starts the frontend UI app)


This is a frontend React/Typescript application that provides tight typing for the form the user may fill out to submit a network(Axios) API request. Form Values and Api Parameters are provided with typings in the codebase that aids readability for any developer wishing to dive into the project.

This solution utilizes a functional React component/Chart.js with hooks (useEffect) and createRef to manipulate the DOM to render a chart.
Cleanup is performed on the previously rendered chart to avoid UX bugs.

This is a very good solution to the requested task of creating a Flask Api that aggregates bandwidth data by the requested parameters:

device_uuid (where this parameter is always required)
end_time (the final cutoff of time to display, all data points will occur before or occur on the end time)
window_time (the time span of each set of grouped data points)
num_windows (the amount of time windows / groups of data to display)

The Flask api will return an error message if the device_uuid parameter is not provided.
All parameters may be provided in URL query parameter format and changeable via address bar:

http://localhost:5000/?device_uuid=cf4844bc-a107-4e0a-84e1-fa04d76d388c&num_windows=5&end_time=1524835943&window_time=5





