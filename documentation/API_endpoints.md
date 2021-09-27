# API documentation

## Description
This markdown file provides documentation regarding the API calls that can be made, in order to access the different **askmeanything2021** servicies.

## Authentication

Most API calls require authentication. In order to pass through the authentication process, you need to fill in the request the following header with your authentication token:
```javascript
HTTP_AUTH_HEADERS: BEARER_TOKEN
```
## API Endpoints

### Create question

* URL: `/create_question/`
* Method: `POST`
* Requires Authentication: **YES**
* Data Params: In the body of the POST request, fill in the following fields of the following json:
```javascript
{
  token: "Your token"
  question_title: 'Your QuestionTitle',
  question_text: 'Your QuestionText',
  newKeywords: [
      'Keyword 1',
      'Keyword 2',
      ...,
      'Keyword N'
  ],
  oldKeywords: [
      'keyword_id 1',
      'keyword_id 2',
      ...,
      'keyword_id M'
  ]
}

```
* Success Response: 
    * Code: `200`
    * Content: `{[{'question_id' : YOUR_QUESTION_ID , 'keyword_id': KEYWORD_1 } , ... , {'question_id' : YOUR_QUESTION_ID , 'keyword_id': KEYWORD_k}}]}`
* Notes: In case of an unathorized user, a 401 UNATHORIZED code is returned.

### Get question and its answers
* URL: `/question_info`
* Method: `POST`
* Requires Authentication: **YES**
* Data Params: In the body of the POST request, fill in the following fields of the following json:
```javascript
{
  token: "Your token"
  question_title: 'QuestionTitle',
}
```
* Success Response: 
    * Code: `200`
    * Content: `{'keywords':[KEYWORDS_RELATED_TO_QUESTION_TITILE] , 'question_text': QUESTION_TEXT , 'answers': [ ANSWERS_TO_QUESTION ] }`
* Notes: In case of an unathorized user, a 401 UNATHORIZED code is returned.

### Get keywords
* URL: `/get_keywords`
* Method: `POST`
* Requires Authentication: **YES**
* Data Params: In the body of the POST request, fill in the following fields of the following json:
```javascript
{
  token: "Your token"
}
```
* Success Response: 
    * Code: `200`
    * Content: `{[ {'keyword_id' : KEYWORD_1 } , ... , { 'keyword' : KEYWORD_N } ] }`
* Notes: In case of an unathorized user, a 401 UNATHORIZED code is returned.

