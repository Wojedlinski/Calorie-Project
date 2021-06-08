//STORAGE CONTROLLER

const StorageCtrl = (function () {

  //Public methods
  return {
    storeItem: function (item) {
      let items;

      //check if there is something in LS

      if (localStorage.getItem('items') === null) {
        items = [];
        items.push(item)

        //set LS
        localStorage.setItem('items', JSON.stringify(items))
      } else {
        //get what is in LS
        items = JSON.parse(localStorage.getItem('items'))

        //push new item
        items.push(item)

        //reset LS
        localStorage.setItem('items', JSON.stringify(items))
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {

        items = [];

      } else {
        items = JSON.parse(localStorage.getItem('items'))
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'))

      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem)
        }
      })

      //reset LS
      localStorage.setItem('items', JSON.stringify(items))
    },
    deleteItemFromStorage: function (id) {

      let items = JSON.parse(localStorage.getItem('items'))

      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1)
        }
      })

      //reset LS
      localStorage.setItem('items', JSON.stringify(items))

    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items')
    }
  }
})();

//ITEM CONTROLLER

const ItemCtrl = (function () {

  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  // Data Structure / State

  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function () {
      return data.items
    },
    addItem: function (name, calories) {

      //generate ID for item
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories)

      //create new item with constructor (line 8 of app.js)
      newItem = new Item(ID, name, calories)

      //push newItem to data structore
      data.items.push(newItem)

      return newItem;

    },
    getItemById: function (id) {
      let found = null;
      // Loop through items

      data.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      })

      return found;
    },
    updateItem: function (name, calories) {
      // Calories to number
      calories = parseInt(calories)

      let found = null

      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item
        }
      })
      return found;
    },
    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item
    },
    getCurrentItem: function () {
      return data.currentItem
    },
    getTotalCalories: function () {
      let total = 0;

      data.items.forEach(item => {
        total += item.calories
      })

      //set total cal in data structure
      data.totalCalories = total

      //return total
      return data.totalCalories;

    },
    logData: function () {
      return data
    }
  }

})();

//UI CONTROLLER

const UICtrl = (function () {

  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',

  }


  // Public Methods
  return {
    populateItemList: function (items) {

      let html = '';

      items.forEach(item => {

        html += `
          <li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a>
      </li>
        `;
      });
      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html
    },

    //method allowing to get UI selectors outside UICtrl
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function (item) {
      //show the list
      document.querySelector(UISelectors.itemList).style.display = 'block'

      // create li element
      const li = document.createElement('li');
      li.classList = 'collection-item';
      li.id = `item-${item.id}`
      li.innerHTML = `
      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a>
      `;
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)

    },
    updateListItem: function (item) {
      let listitems = document.querySelectorAll(UISelectors.listItems)

      // converting node list into array
      listItems = Array.from(listitems)

      listitems.forEach(listItem => {
        const itemID = listItem.getAttribute('id')

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-pencil-alt"></i>
        </a>
      `;
        }
      })

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // show total calories in UI
      UICtrl.showTotalCalories(totalCalories);

      // clear edit state
      UICtrl.clearEditState();


    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`
      const item = document.querySelector(itemID)
      item.remove()
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems)

      // turn node list into array
      listItems = Array.from(listItems)

      listItems.forEach(item => {
        item.remove()
      })

    },
    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none'
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.backBtn).style.display = 'none'
      document.querySelector(UISelectors.addBtn).style.display = 'inline'
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline'
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
      document.querySelector(UISelectors.backBtn).style.display = 'inline'
      document.querySelector(UISelectors.addBtn).style.display = 'none'
    },
    getSelectors: function () {
      return UISelectors;
    }

  }
})();


//APP CONTROLLER

const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

  // Load event listeners

  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClicked)

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

    //Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.code === 'Enter' || e.key === 'Enter') {
        e.preventDefault();
        return false
      }
    })


    //Update item submit
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit)

    //Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState)

    //Delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', ItemDeleteSubmit)

    //Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)

  }

  // Add item submit
  const itemAddSubmit = function (e) {
    e.preventDefault()

    //Get form input from UICtrl
    const input = UICtrl.getItemInput();

    //check if input is not empty
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories)

      // Add item to UI list
      UICtrl.addListItem(newItem)

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // show total calories in UI
      UICtrl.showTotalCalories(totalCalories);

      // store in LS
      StorageCtrl.storeItem(newItem)

      // clear inputs
      UICtrl.clearInput();
    }
  }

  const itemEditClicked = function (e) {
    e.preventDefault()
    if (e.target.classList.contains('edit-item')) {
      //get list item id
      const listId = e.target.parentNode.parentNode.id;

      //break into an array
      const listIdArr = listId.split('-')

      //get actual ID
      const id = parseInt(listIdArr[1])

      //get Item
      const itemToEdit = ItemCtrl.getItemById(id)

      //set current item
      ItemCtrl.setCurrentItem(itemToEdit)

      //add item to form
      UICtrl.addItemToForm();
    }
  }

  const itemUpdateSubmit = function (e) {
    e.preventDefault();
    //Get item input
    const input = UICtrl.getItemInput()

    //Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

    //Update UI
    UICtrl.updateListItem(updatedItem)

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();
  }

  const ItemDeleteSubmit = function (e) {
    e.preventDefault();
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id)

    // delete from UI
    UICtrl.deleteListItem(currentItem.id)

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
  }

  const clearAllItemsClick = function (e) {
    e.preventDefault();
    // Delete all items from data structure
    ItemCtrl.clearAllItems()

    // Remove from UI
    UICtrl.removeItems();

    //Clear from LS
    StorageCtrl.clearItemsFromStorage();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Hide UL
    UICtrl.hideList();
  }

  //Public methods
  return {
    init: function () {

      // Clear edit state / set initial set
      UICtrl.clearEditState();

      //fetch items from data structure
      const items = ItemCtrl.getItems();

      // check if list is empty or not

      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // populate list with items
        UICtrl.populateItemList(items)
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // show total calories in UI
      UICtrl.showTotalCalories(totalCalories);

      // load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize App

App.init()