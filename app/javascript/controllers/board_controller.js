import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
  HEADERS = { 'ACCEPT': 'application/json '}
  connect() {
    console.log(axios.isCancel('something'));
    axios.get('/api/boards/1/lists', { headers: this.HEADERS })
    .then((response) =>{
      console.log('list response: ', response)
    })
    .catch((error) => {
      console.error('Error fetching lists:', error)
    })
    console.log("Heola11 World")
    var kanban = new jKanban({
      element: '#board',
      boards: [
      {
        id: "board-id-1",
        title: "Board Title",
        class: "bg-blue-700, rounded-lg, border, border-blue-300, shadow-lg, p-4, text-white",
        item: [
          {
            id: "item-id-1",
            title: "Item 1",
            class: ["rounded-lg", "border", "border-blue-300", "shadow-lg", "p-4", "bg-white"],  // Asegúrate de que las clases sean un array de strings
          },
          {
            id: "item-id-2",
            title: "Item 2"
          }
        ]
      },
      {
        id: "board-id-2",
        title: "Board Title 2"
      }
    ]
    });
  
    document.querySelector('#board').addEventListener('touchstart', function(event) {
      event.preventDefault(); // This will not trigger the passive error
    }, { passive: false });
  }
}
