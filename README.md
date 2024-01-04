# Task List

This full-stack application is a todo list that utilizes all CRUD operations. It allows you to add new tasks with titles, descriptions, due dates, and completion statuses.

This application is built using React for the front-end, AdonisJS for the back-end, and MySQL for the database.
![image](https://github.com/rinnegan72/Full-stack-todo-application/assets/69243366/d631e8f6-65d4-4d5c-a57a-db39a928c30f)


# ADONIS BACK-END SETUP
## 1.	Access the Adonis Backend
After cloning the project, navigate to the Adonis project directory:
```cd adonis-todo```

## 2.	Install NPM Modules
While in the directory, run:
```npm install```

## 3.	Create .env File in adonis-todo Directory
Add the appropriate environment variables:
```
HOST=127.0.0.1
PORT=3333
NODE_ENV=development
APP_URL=http://${HOST}:${PORT}
CACHE_VIEWS=false
APP_KEY=5ZLYQIWmlsp4Wp1wAoxKQwIiSCDtvTxf
DB_CONNECTION=mysql
DB_HOST=127.0.0.1/<insert yours>
DB_PORT=3306/<insert yours>
DB_USER=root
DB_PASSWORD=<insert your root password>
DB_DATABASE=events/<insert yours>
SESSION_DRIVER=cookie
HASH_DRIVER=bcrypt
```

## 4.	Create the events/<insert yours> Database in MySQL
Open another terminal/cmd and run:
```
mysql -u”root” -p”<your password>”
```
## 5.	Run Migration
Adonis has several files that create the required tables in `database/migrations`. Run:
```
adonis migration: run
```

## 6.	Start the Adonis Server
To allow the front-end to retrieve the data, run:
```
adonis serve –dev
```
When you click on the link, you should see a page that says “It works!”

# REACT FRONT END SETUP
## 1.	Navigate to React Front-End
First, go to the React project files:
```cd react-todo```

## 2.	Install NPM Modules
While in the file, run:
```npm install```

## 3.	Start React Front-End
Start the React front-end by running:
```npm start```

# TROUBLESHOOTING
Here are some issues I encountered while making this project and how I resolved them. This might be helpful if you encounter these issues.

## 1.	Mysql Authentication Not Supported
When: Running `adonis migration:run` on the Adonis project.

Why: This issue occurs because the new authentication method uses SHA-255 for the password.

Solution: Alter the root user to accept just a password, allowing the migration to run. Run the query:
```ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<password>';```


## 2.	Mysql Not Found
When: Running `adonis migration: run` on the Adonis project.

Why: This issue occurs because we need the MySQL NPM package before using it to link our Adonis project with the MySQL database.

Solution: Run `npm install mysql`.

## 3.	Access to Fetch Blocked by CORS Policy
When: Fetching the tasks from the tasks table in the React front end using fetch.

Why: Because the data referred from the Adonis backend has a different point of origin than the React front-end.

Solution: Alter the `config/cors` file in Adonis, install axios on the React app files, install cors on Adonis, and restart the Adonis server.

After running `adonis install @adonisjs/cors` on the Adonis file, add this to the `cors.js` file:
```
module.exports = {
  origin: 'http://localhost:3000',
  // other properties..}
```

## 4.	403 Post Forbidden
When: Trying to add or change a table.

Why: Because of the CSRF protection being enabled.

Solution: Go to `config/shield` and set:
```
csrf: {
    enable: false,
```
## 5.	Table Created by Running Migration is Wrong
Solution: Run `adonis make:migration create_tasks_table`. This will create a `<time stamp>_create_tasks_schema.js` under `database/migrations`. Add the details about the table, including the table name:
```
this.create('<table name>', (table) => {
      table.increments()
      table.<data type>('<column name>', 255).<modifiers>()
      ……….
      table.timestamps()
    })
```
## 6.	Column Not Getting Updated on Database
When: Running a PUT request from the React front end.
```javascript
const response = await axios.put(`http://localhost:3333/tasks/${taskId}`, {
    description: updatedDescription,
    title: updatedTitle
});
```

Why: This happens because the controller for the routes doesn’t have a specific column (app/Controllers/TaskController).
```javascript
async store ({ request, response }) {
    const data = request.only(['title', 'description', 'completed', 'due_date'])
}
async update ({ params, request, response }) {
    const task = await Task.find(params.id)
    task.merge(request.only(['title', 'description', 'completed', 'due_date']))
}
```

Solution: Add the specific column to the `update` and `store` functions in the `TaskController.js` file above.
