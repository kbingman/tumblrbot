package main

import (
  "net/http"
  "fmt"
  "github.com/julienschmidt/httprouter"
)

func renderIndex(w http.ResponseWriter, req *http.Request, _ httprouter.Params) {
  w.Header().Set("Content-Type", "text/html")
  context := map[string]string{"greeting":"hello world"}

  fmt.Fprint(w, renderHTML("hello_world", context))
}
