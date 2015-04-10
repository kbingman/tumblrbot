package main

import (
  "net/http"
  "fmt"
  "encoding/json"
  "io/ioutil"
  "github.com/julienschmidt/httprouter"
)

func findByBlog(w http.ResponseWriter, req *http.Request, params httprouter.Params) {

  url := "http://api.tumblr.com/v2"
  blog := req.FormValue("blog")
  tags := req.FormValue("tags")
  before := req.FormValue("before")
  offset := req.FormValue("offset")

  data := map[string]interface{}{}

  apikey := "7SWYhNO0IuuMAp7rpSGyDrd5r5wSBJko2CGZQrhK8ConEK1c66"

  if blog == "" {
    url += "/tagged?api_key=" + apikey + "&before=" + before + "&tag=" + tags
  } else {
    url += "/blog/" + blog + "/posts/photo?api_key=" + apikey + "&tag=" + tags + "&offset=" + offset
  }

  fmt.Printf("%s\n", string(blog))
  fmt.Printf("%s\n", string(url))
  response, err := http.Get(url)
  if err != nil {
      fmt.Fprint(w, err)
  }
  defer response.Body.Close()
  content, err := ioutil.ReadAll(response.Body)
  if err != nil {
      fmt.Printf("%s", err)
  }
  // var blog Blog
  err = json.Unmarshal(content, &data)

  b, err := json.Marshal(data["response"])

  w.Header().Set("Content-Type", "application/json")
  fmt.Fprint(w, string(b))
}

func renderArticle(w http.ResponseWriter, req *http.Request, params httprouter.Params) {
  id := params.ByName("id")
  fmt.Fprintf(w, "This is article " + id)
}
