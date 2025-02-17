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
    "fmt"
    "log"
    "net/http"

    "github.com/gorilla/mux"
    _ "github.com/go-sql-driver/mysql"
)

type Task struct {
	ID int `json:"id"`
	Title string `json:"title"`
	Completed bool `json:"completed"`
	DueDate string `json:`
}

func main() {
    // Initialize database connection
    var err error
    db, err = sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/go_crud_api")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    // Initialize router
    router := mux.NewRouter()

    // Define API routes
	router.HandleFunc("/tasks", getTasks).Methods("GET")
	router.HandleFunc("/tasks/{id}", updateTasks).Methods("PUT")
	router.HandleFunc("/tasks", createTask).Methods("POST")// router.HandleFunc("/tasks/{id}", updateTasks).Methods("PUT")
	router.HandleFunc("/tasks/{id}", deleteTasks).Methods("DELETE")

    // Start server on port 8000
    log.Fatal(http.ListenAndServe(":8000", router))
}