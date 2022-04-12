# stackoverflow-assignment
Assignment for Django Project using StackOverFlow  API
## Task:
Build an Application over StackOverflowAPI for searching questions in StackOverflow (ref: https://api.stackexchange.com/docs/advanced-search)

### Requirements:
1) Should be able to search all available fields/parameters. 
2) List the result with pagination with Django template (Using Restful API and angular/react bonus).
3) Page/Data should be cached. (Application should only call StackOverflowAPI if we didn't pull data already for same query param)
4) Add Search limit per min(5) and per day(100) for each session.


### Solution:
Used Django, Django-REST Framework and React JS to complete the task.

1. Option to search all availble fields and parameters in advanced-search API.
2. Used pagination which shows 5 pages to choose from at a time along with next and previous buttons.
3. For caching used Djano Redis Cache.
4. Added search limit of 5/min and 100/day.
