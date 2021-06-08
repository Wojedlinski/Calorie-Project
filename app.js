//STORAGE CONTROLLER

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
    items: [
      // {
      //   id: 0,
      //   name: 'Steak Dinner',
      //   calories: 1200
      // },
      // {
      //   id: 1,
      //   name: 'Ice Cream',
      //   calories: 400
      // },
      // {
      //   id: 2,
      //   name: 'Eggs',
      //   calories: 250
      // }
    ],
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

const App = (function (ItemCtrl, UICtrl) {

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

    UICtrl.clearEditState();
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

})(ItemCtrl, UICtrl);

//Initialize App

App.init()