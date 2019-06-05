Alice Lee: I worked on the front-end development of the overall application which includes the home page, 
article page, archive page, and navigation bar. I implemented a masonry layout for the article page 
and creating the map icons on the home page. I prototyped the designs in the beginning and created digital prototypes in Figma. 

Senyan Luo: I came up with the initial idea of the app, and all of us brainstormed upon it. I completed the full-stack skeleton of the app. Throughout the quarter, I led the team and assisted teammates with debugging. 

Huy Le: I assisted with brainstorming ideas for our application, worked on our milestone.md's, as well as contributed to the front end and GUI of our application.

Madeline Ng: I worked on the front end development of the vocabulary builder page in collaboration with Senyan and created rotating flashcards that display the word in the front and the other information on the back. Together, we all brainstormed and explored variations of the News app concept and catering it to an audience that is different from us. Came up with ideas for slogan and app name. I created several digital prototypes using Adobe Xd. Contributed to the README.files. 

Source code files: <br />
index.handlebars: The homepage with navigations and clickable continent PNGs. <br /> 
main.handlebars: The wrapper page for all sub handlebars pages.  <br /> 
archive.handlebars: handlebars page for saved articles.  <br /> 
vocabulary.handlebars: handlebars page for displaying saved vocabularies.  <br /> 
articles.handlebars: handlebars page for displaying all the articles. We used Masonry.js for the layout <br />  
style.css: All the customized css used in the app. <br /> 
app.js: contains all onclick events for buttons, API calls to dictionary and chinese translation as well as ajax calls to save contents are made here. <br /> 
server.js: Backend code for the app. Set handlebars as the default rendering engine, used Express.js for routing, and made api call to the newsapi.org. The data received is sent and rendered on their respective handlebars page on the frontend. <br /> 
database_config.js: Configurations of sqlite3 database. Created both the archive and vocabulary tables here. <br /> 


Google Slides (Presentation) 
https://docs.google.com/presentation/d/1v95xtA0lu9cr7ulALLzWqHT1jtFXXdJIna314WFc1Nw/edit?usp=sharing

Link to demo video: https://youtu.be/budYCa4QPGI

