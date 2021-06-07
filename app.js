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
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
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

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit)

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

  const itemUpdateSubmit = function (e) {
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

      console.log(itemToEdit);
    }
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