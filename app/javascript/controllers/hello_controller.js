import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("Stimulus connected the Hello controller");
    //his.element.textContent = "Hello World!"
  }
}
