// create a go http rest api that serves
// the tasks table from the events db
// router.HandleFunc("/tasks", getTasks).Methods("GET")
// router.HandleFunc("/tasks/{id}", updateTasks).Methods("PUT")
// router.HandleFunc("/tasks", createTask).Methods("POST")// router.HandleFunc("/tasks/{id}", updateTasks).Methods("PUT")
// router.HandleFunc("/tasks/{id}", deleteTasks).Methods("DELETE")
package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Task struct {
	ID int `json:"id"`
	Title string `json:"title"`
	Completed bool `json:"completed"`
	DueDate string `json:"due_date"`
    CreatedAt string `json:"created_at"`
    UpdatedAt string `json:"updated_at"`
}

var db *sql.DB

func getTasks(w http.ResponseWriter, r *http.Request) {
    // var tasks is a struct of type Task
    var tasks []Task
    // query the database for all tasks
    rows, err := db.Query("SELECT id, title, completed, due_date, created_at, updated_at FROM tasks")
    //  if there is an error then return error
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    // close the rows
    defer rows.Close()
    // loop through the rows
    for rows.Next() {
        var task Task
        if err := rows.Scan(&task.ID, &task.Title, &task.Completed, &task.DueDate, &task.CreatedAt, &task.UpdatedAt); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        tasks = append(tasks, task)
    }
    // encode the tasks to json
    json.NewEncoder(w).Encode(tasks)
}
func main() {
    // Initialize database connection
    var err error
    db, err = sql.Open("mysql", "$MYSQL_USER:$MYSQL_PASSWORD@tcp($MYSQL_HOST:$MYSQL_PORT)/$MYSQL_DB")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Initialize router
    router := mux.NewRouter()

    // Define API routes
	router.HandleFunc("/tasks", getTasks).Methods("GET")
	// router.HandleFunc("/tasks/{id}", updateTasks).Methods("PUT")
	// router.HandleFunc("/tasks", createTask).Methods("POST")// router.HandleFunc("/tasks/{id}", updateTasks).Methods("PUT")
	// router.HandleFunc("/tasks/{id}", deleteTasks).Methods("DELETE")

    // Start server on port 8000
    log.Fatal(http.ListenAndServe(":" + os.Getenv("PORT"), router))
}