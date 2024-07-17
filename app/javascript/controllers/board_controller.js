import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
  HEADERS = { 'ACCEPT': 'application/json ' }
  kanban = null
  // buildClassList(classList) {
  //   if (classList !== null && classList !== undefined && typeof classList === 'string' && classList.trim() !== '') {
  //     return classList.split(' ').join(', ')
  //   }
  //   return ''
  // }

  // buildClassListItem(classList) {
  //   if (classList !== null && classList !== undefined && typeof classList === 'string' && classList.trim() !== '') {
  //     return classList.split(' ')
  //   }
  //   return ''
  // }

  buildItemList(items) {
    return items.map((item) => {
      return {
        'id': item['id'],
        'title': item['attributes']['title'],
        'class': ["rounded-lg", "border", "border-blue-300", "shadow-lg", "p-4", "bg-white"],
        'list-id': item['attributes']['list_id'],
        'modal-target': "default-modal",
        'modal-toggle': "default-modal",
        'modal-title': item['attributes']['title'],
        'modal-description': item['attributes']['description'],
      }
    });
  }

  buildBoards(boardsData) {
    return boardsData['data'].map((board) => {
      // console.log('board: ', board);
      // console.log(JSON.parse(board['attributes']['items']).data)
      return {
        'id': board['id'],
        'title': board['attributes']['title'],
        'class': "bg-blue-700, rounded-lg, border, border-blue-300, shadow-lg, p-4, text-white",
        'item': this.buildItemList(JSON.parse(board['attributes']['items']).data)
      }
    });
  }

  updateListPositioning(el) {
    console.log('dragend.el: ', el)
    axios.put(`${this.element.dataset.listPositionsApiUrl}/${el.dataset.id}`,
      {
        position: el.dataset.order - 1,
        id: el.dataset.id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf
        },
      }).then((response) => {
        console.log('response: ', response)
      })
  }


  updateItemsPositioning(target) {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    const targetItems = Array.from(target.getElementsByClassName('kanban-item'));
    targetItems.forEach((item, index) => {
      item.dataset.position = index;
      item.dataset.listId = target.closest('.kanban-board').dataset.id
    });

    const targetItemsData = targetItems.map((item) => {
      return {
        id: item.dataset.eid,
        position: item.dataset.position,
        list_id: item.dataset.listId
      }
    })

    axios.put(this.element.dataset.itemPositionsUrl,
      {
        items: targetItemsData
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf
        },
      }).then((response) => {
        console.log('response: ', response)
      })
  }

  buildKanban(boards) {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    this.kanban = new jKanban({
      element: `#${this.element.id}`,
      boards: boards,
      itemAddOptions: {
        enabled: true,
        content: '+',
      },
      buttonClick: (el, boardId) => {
        Turbo.visit(`/lists/${boardId}/items/new`)
        // console.log("hola")
      },
      dragendBoard: (el) => {
        this.updateListPositioning(el)
      },
      dropEl: (el, target, source, sibling) => {
        // const targetItems = Array.from(target.getElementsByClassName('kanban-item'));
        // const sourcetItems = Array.from(source.getElementsByClassName('kanban-item'));

        // sourcetItems.forEach((item, index) => {
        //   item.dataset.position = index;
        //   item.dataset.listId = source.closest('.kanban-board').dataset.id
        // });

        this.updateItemsPositioning(target)



        // const sourceItemsData = sourcetItems.map((item) => {
        //   return {
        //     id: item.dataset.eid,
        //     position: item.dataset.position,
        //     list_id: item.dataset.listId
        //   }
        // })

        // axios.put(this.element.dataset.itemPositionsUrl,
        //   {
        //     items: sourceItemsData
        //   },
        //   {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'X-CSRF-Token': csrf
        //     },
        //   }).then((response) => {
        //     console.log('response: ', response)
        //   })
      }
    })
  };

  getHeaderTitles() {
    return Array.from(document.querySelectorAll('.kanban-title-board'));
  }

  getHeaders() {
    return Array.from(document.querySelectorAll('.kanban-board-header'));
  }

  getBoard() {
    return Array.from(document.querySelectorAll('.kanban-board'));
  }

  getItem() {
    return Array.from(document.querySelectorAll('.kanban-item'));
  }

  decoratedHeaderTitle() {
    this.getHeaderTitles().forEach(element => {
      element.classList.add('cursor-pointer');
    });
  }

  marginBoard() {
    this.getBoard().forEach(element => {
      element.classList.add('mt-2');
    });
  }

  addLinkToHeaderTitles(boards) {
    this.getHeaderTitles().forEach((element, index) => {
      element.dataset.linkUrl = `${this.element.dataset.boardListsUrl}/${boards[index].id}`
      element.addEventListener('click', () => {
        Turbo.visit(`${this.element.dataset.boardListsUrl}/${boards[index].id}/edit`)
      });
    })
  };

  addHeaderDeleteButton(boards) {
    this.getHeaders().forEach((element, index) => {
      const button = document.createElement('button');
      button.className = 'kanban-title-button btn btn-default btn-xs mr-2';
      button.textContent = 'x';
      element.appendChild(button);

      // const buttons = Array.from(document.querySelectorAll('.kanban-title-button.btn.btn-default.btn-xs'));
      // let buttonX = null;
      // buttons.forEach(button => {
      //   if (button.textContent.trim() === 'x') { }
      //   buttonX = button
      // })

      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("button clicked:", boards[index].id)
        // this.kanban.removeBoard(boards[index].id)
        if (confirm('Are you sure you want to delete this board?')) {
          // Hacer la solicitud DELETE al servidor
          axios.delete(`${this.element.dataset.boardListsUrl}/${boards[index].id}`)
            .then(response => {
              console.log('Board deleted:', response.data);
              // Si la solicitud DELETE es exitosa, eliminar el tablero de la interfaz de usuario
              this.kanban.removeBoard(boards[index].id);
            })
            .catch(error => {
              console.error('Error deleting board:', error);
            });
        }
      });
    })
  }

  static targets = ['title', 'description']

  toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    const opacity = document.getElementById('modal-backdrop')
    if (modal) {
      modal.classList.toggle('hidden');
      opacity.classList.toggle('hidden');
    }
  };

  showModal(item) {
    document.querySelectorAll('[data-modal-toggle]').forEach(element => {
      element.addEventListener('click', () => {
        const modalId = element.getAttribute('data-modal-toggle');
        console.log(element)

        const title = element.getAttribute('data-modal-title');
        const description = element.getAttribute('data-modal-description');




        this.titleTarget.textContent = title;
        this.descriptionTarget.textContent = description;
        this.toggleModal(modalId);

        const editButton = document.getElementById('edit-button');
        const editLink = document.getElementById('item-edit-link');
        const assignLink = document.getElementById('item-assign-member-link');
        const deleteButton = document.getElementById('delete-button');

        const itemId = element.getAttribute('data-eid');
        const listId = element.getAttribute('data-list-id');
        console.log(document.getElementById('item-edit-link').href)
        editLink.href = `/lists/${listId}/items/${itemId}/edit`
        assignLink.href = `/items/${itemId}/item_members`
        
        editButton.addEventListener('click', () => {
          window.location.href = editLink.href;
        });



        const itemUrl = `${window.location.origin}/api/items/${itemId}`;
        axios.get(itemUrl)
        .then(response => {
          const members = JSON.parse(response['data']['data']['attributes']['members']).data
          // console.log('item deleted:', members);
          const modalMemberDiv = document.getElementById('modal-member');
          modalMemberDiv.innerHTML = '';

          members.forEach(member => {
            const memberEmail = member.attributes.email; // Suponiendo que `attributes.email` contiene el email
            const memberDiv = document.createElement('div');
            memberDiv.className = 'inline-flex max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:bg-gray-800 dark:text-gray-400 m-2';
      
            memberDiv.innerHTML = `
              <div class="inline-flex">
                <div class="flex-shrink-0 bg-gray-800 rounded-full">
                  <img class="w-8 h-8 rounded-full" src="" alt="">
                </div>
                <div class="ms-3 text-sm font-normal">
                  <span class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">${memberEmail}</span>
                </div>
              </div>
            `;
      
            modalMemberDiv.appendChild(memberDiv);
          });
        })

        deleteButton.addEventListener('click', (e) => {
          e.preventDefault();

          if (confirm('Are you sure you want to delete this board?')) {
            // Hacer la solicitud DELETE al servidor
            axios.delete(`/lists/${listId}/items/${itemId}`)
              .then(response => {
                console.log('item deleted:', response.data);
                // Si la solicitud DELETE es exitosa, eliminar el item de la interfaz de usuario
                const itemElement = document.querySelector(`[data-eid="${itemId}"]`);
                if (itemElement) {
                  itemElement.remove();
                }
              })
              .catch(error => {
                console.error('Error deleting item:', error);
              });
          }
        });


      });
    });

    document.querySelectorAll('[data-modal-hide]').forEach(element => {
      element.addEventListener('click', () => {
        const modalId = element.getAttribute('data-modal-hide');
        this.toggleModal(modalId);
      });
    });
  }

  connect() {

    console.log(axios.isCancel('something'));
    axios.get(this.element.dataset.apiUrl, { headers: this.HEADERS })
      .then((response) => {

        console.log("response: ", response['data'])
        if (document.querySelector('#board')) {
          this.buildKanban(this.buildBoards(response['data']))
          this.decoratedHeaderTitle()
          this.marginBoard()
          this.addLinkToHeaderTitles(this.buildBoards(response['data']))
          this.addHeaderDeleteButton(this.buildBoards(response['data']))
          console.log("headers", this.getHeaders())


          this.showModal(response['data'])


          // Add click event listener only to elements with data-modal-toggle attribute
          // document.querySelectorAll('[data-modal-toggle]').forEach(element => {
          //   element.addEventListener('click', () => {
          //     const modalId = element.getAttribute('data-modal-toggle');
          //     console.log(element)
          //     const title = element.getAttribute('data-modal-title');
          //     const description = element.getAttribute('data-modal-description');


          //     this.titleTarget.textContent = title;
          //     this.descriptionTarget.textContent = description;
          //     this.toggleModal(modalId);
          //   });
          // });

          // document.querySelectorAll('[data-modal-hide]').forEach(element => {
          //   element.addEventListener('click', () => {
          //     const modalId = element.getAttribute('data-modal-hide');
          //     this.toggleModal(modalId);
          //   });
          // });
        }
      })
      .catch((error) => {
        console.error('Error fetching lists:', error)
      })
    // console.log("Heola11 World")
    // var kanban2 = new jKanban({
    //   element: '#board',
    //   boards: [
    //     {
    //       id: "board-id-1",
    //       title: "Board Title",
    //       class: "bg-blue-700, rounded-lg, border, border-blue-300, shadow-lg, p-4, text-white",
    //       item: [
    //         {
    //           id: "item-id-1",
    //           title: "Item 1",
    //           class: ["rounded-lg", "border", "border-blue-300", "shadow-lg", "p-4", "bg-white"],  // Asegúrate de que las clases sean un array de strings
    //         },
    //         {
    //           id: "item-id-2",
    //           title: "Item 2"
    //         }
    //       ]
    //     },
    //     {
    //       id: "board-id-2",
    //       title: "Board Title 2"
    //     }
    //   ]
    // });

    // document.querySelector('#board').addEventListener('touchstart', function (event) {
    //   event.preventDefault(); // This will not trigger the passive error
    // }, { passive: false });
  }
}
