package main

import (
  "github.com/codegangsta/negroni"
  "github.com/julienschmidt/httprouter"
)

func main() {
  router := httprouter.New()

  router.GET("/", renderIndex)
  router.GET("/search/", findByBlog)
  router.GET("/articles/:id", renderArticle)

  n := negroni.Classic()
  n.UseHandler(router)
  n.Run(":3000")
}
