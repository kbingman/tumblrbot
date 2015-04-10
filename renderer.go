package main

import (
  "encoding/json"
  "github.com/hoisie/mustache"
)

// Renders a map to JSON
//
type JsonResponse map[string]interface{}

func (r JsonResponse) String() (s string) {
  b, err := json.Marshal(r)
  if err != nil {
    s = ""
    return
  }
  s = string(b)
  return
}

// Takes a template name and context and renders using the layout defined below
//
func renderHTML(template string, context map[string]string) string {
  layoutPath := "templates/layout.mustache"
  templatePath := "templates/" + template + ".mustache"
  return mustache.RenderFileInLayout(templatePath, layoutPath, context)
}
