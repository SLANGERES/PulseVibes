package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"github.com/gorilla/mux"
)
func HandleGetEmotion(w http.ResponseWriter, r *http.Request){
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("Hello From MicroServiceS")

}
func main(){
	fmt.Printf("main.go")
	r:=mux.NewRouter()
	r.HandleFunc("/getEmotion",HandleGetEmotion).Methods("GET")
	err:=http.ListenAndServe(":9001",r)

	if err!=nil{
		log.Fatal("Error occur Unable to find Server")
	}else{
		fmt.Printf("Connection Establish")
	}
	
}