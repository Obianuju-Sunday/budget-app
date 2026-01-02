// BUDGET CONTROLLER

console.log('Obianuju is a very big name!')

var budgetController = (function () {

    // Data Structure to hold all items and totals
    var dataStore = {
        allItems: {
            incomeItems: [],
            expenseItems: []
        },
        totals: {
            totalIncome: 0,
            totalExpenses: 0,
            netBudget: 0,
            totalExpensePercentage: 0
        }
    };

    // Item Constructor
    class Item {
        constructor(id, description, value, percentage) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = percentage;
        }
    }


    // Function to add item to data structure
    var addItem = function (type, description, value) {

        var itemArray;

        if (type === 'inc') {
            itemArray = dataStore.allItems.incomeItems;
        } else {
            itemArray = dataStore.allItems.expenseItems;
        }

        var ID = itemArray.length > 0
            ? itemArray[itemArray.length - 1].id + 1
            : 0;



        var newItem = new Item(ID, description, value);
        itemArray.push(newItem);

        console.log(dataStore.allItems) // For testing purposes

        return newItem;
    };

    // Function to calculate budget
    var calculateBudget = function () {


        var budgetTotals = dataStore.totals;
        var expenses = dataStore.allItems.expenseItems;
        var incomes = dataStore.allItems.incomeItems;

        budgetTotals.totalIncome = 0
        budgetTotals.totalExpenses = 0

        for (var i = 0; i < incomes.length; i++) {
            budgetTotals.totalIncome += incomes[i].value;
        }

        for (var i = 0; i < expenses.length; i++) {
            budgetTotals.totalExpenses += expenses[i].value;
        }

        budgetTotals.netBudget = budgetTotals.totalIncome - budgetTotals.totalExpenses;
        budgetTotals.totalExpensePercentage = (budgetTotals.totalExpenses / budgetTotals.totalIncome) * 100;

        return {
            totalIncome: '+ ' + budgetTotals.totalIncome.toFixed(2),
            totalExpense: '- ' + budgetTotals.totalExpenses.toFixed(2),
            budget: '+ ' + budgetTotals.netBudget.toFixed(2),
            totalExpensePercentage: budgetTotals.totalExpensePercentage.toFixed(2)
        }

    }

    var getDataStore = function () {
        return dataStore;
    }

        var calculatePercentages = function () {

        var totalIncome = dataStore.totals.totalIncome;
        var expenses = dataStore.allItems.expenseItems;
        if (totalIncome === 0) {

            expenses.forEach(function (item) {
                item.percentage = 0;
            })
        } else {
            expenses.forEach(function (item) {
                item.percentage = (item.value / totalIncome) * 100;
            })
        }
    }

    var getPercentages = function () {
        var expenses = dataStore.allItems.expenseItems;
        var allPercentages = expenses.map(function (item) {
            return item.percentage;
        });
        return allPercentages;
    }


    var saveData = function () {

        // 1. Convert the dataStore object to a JSON string before storing/saving to localStorage:
        localStorage.setItem('userData', JSON.stringify(dataStore));

    }

    var loadData = function () {
        // 2. Retrieve the stored/saved string from localStorage, convert it back to an object and put it back to dataStore. userData is the key we used to store the data.
        var savedDataString = localStorage.getItem('userData');


        // Check if data exists before parsing to avoid errors
        if (savedDataString) {
            var storedUserData = JSON.parse(savedDataString);
            console.log(storedUserData);
        } else {
            console.log('No saved data found in local storage.');
            return;
        }

        // RESTORE DATA INTO LIVE STATE
        dataStore.allItems.incomeItems = storedUserData.allItems.incomeItems;
        dataStore.allItems.expenseItems = storedUserData.allItems.expenseItems;
        dataStore.totals.totalIncome = storedUserData.totals.totalIncome;
        dataStore.totals.totalExpenses = storedUserData.totals.totalExpenses;
        dataStore.totals.netBudget = storedUserData.totals.netBudget;
        dataStore.totals.totalExpensePercentage = storedUserData.totals.totalExpensePercentage;

        console.log('Data restored into dataStore:', dataStore);
    }

    var deleteItem = function (type, itemID) {
        var itemArray;

        if (type === 'inc') {
            itemArray = dataStore.allItems.incomeItems;
        } else {
            itemArray = dataStore.allItems.expenseItems;
        }

        // Find index of item to be deleted
        var index = itemArray.findIndex(function (item) {
            return item.id === itemID;
        });

        // Remove item from array if found
        if (index !== -1) {
            itemArray.splice(index, 1);
        }



        // Save updated data to local storage
        saveData();
    }

    // var clearData = function () {
    //     localStorage.clear();
    // }


    // Expose public methods
    return {
        addItem,
        calculateBudget,
        getDataStore,
        saveData,
        loadData,
        deleteItem,
        calculatePercentages,
        getPercentages,
    };
}());
















// UI CONTROLLER

var UIController = (function () {

    // Object to hold DOM Strings
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpensesValue: '.budget__expenses--value',
        addButton: '.add__btn',
        resetButton: '.reset--btn',
        deleteButton: '.item__delete--btn',
        allItemsContainer: '.container',
        budgetExpensesPercentage: '.budget__expenses--percentage'
    };

    // Function to get DOM Strings
    var getDomStrings = function () {
        return DOMStrings;
    }


    // Function to get input values
    function getInput() {
        var type = document.querySelector(DOMStrings.inputType).value;
        var description = document.querySelector(DOMStrings.inputDescription).value;
        var value = Number(document.querySelector(DOMStrings.inputValue).value);

        return {
            type,
            description,
            value
        };
    }

    // Function to display item in the UI
    function displayItem(obj, type) {
        var budgetSelector = type === 'inc' ? '.income__list' : '.expenses__list';

        html = `
        <div class="item clearfix" id="${type}-${obj.id}">
            <div class="item__description">${obj.description}</div>
            <div class="right clearfix">
                <div class="item__value">${obj.value}</div>
        `;

        // ONLY expenses get percentage
        if (type === 'exp') {
            html += `<div class="item__percentage">--</div>`;
        }
        console.log(obj.percentage) // For testing purposes

        html += `
                <div class="item__delete">
                    <button class="item__delete--btn">
                        <i class="ion-ios-close-outline"></i>
                    </button>
                </div>
            </div>
        </div>
        `;

        document.querySelector(budgetSelector).insertAdjacentHTML('beforeend', html);
    }


    // Function to display budget values
    var displayBudget = function (income, expenses, budget, percentages) {
        var html = `
            <div class="budget__value">${budget}</div>

            <div class="budget__income clearfix">
                <div class="budget__income--text">Income</div>
                <div class="right">
                    <div class="budget__income--value">${income}</div>
                </div>
            </div>

            <div class="budget__expenses clearfix">
                <div class="budget__expenses--text">Expenses</div>
                <div class="right clearfix">
                    <div class="budget__expenses--value">${expenses}</div>
                    <div class="budget__expenses--percentage">${percentages}</div>
                </div>
            </div>

        `
        console.log(percentages)

        document.querySelector(DOMStrings.budgetValue).innerHTML = budget;
        document.querySelector(DOMStrings.budgetIncomeValue).innerHTML = income;
        document.querySelector(DOMStrings.budgetExpensesValue).innerHTML = expenses;
        document.querySelector(DOMStrings.budgetExpensesPercentage).innerHTML = Math.round(percentages) + '%';
    }

    var deleteItem = function (itemID) {

        var itemElement = document.getElementById(itemID);

        if (itemElement) (
            itemElement.parentNode.removeChild(itemElement)
        )
    }

    // var displayPercentages = function (percentages) {
    //     var percentageElement = document.querySelectorAll('.item__percentage .expenses__list .item__percentage');

    //     percentageElement.forEach(function (item, index) {
    //         if (percentages[index] > 0) {
    //             item.textContent = percentages[index] + '%';
    //         } else {
    //             item.textContent = '0%';
    //         }
    //     });
    // }

var displayPercentages = function () {
    var expenses = budgetController.getDataStore().allItems.expenseItems;

    expenses.forEach(function(item) {
        // Grab the parent by ID
        var elParent = document.getElementById('exp-' + item.id);
        if (elParent) {
            var el = elParent.querySelector('.item__percentage');
            if (el) {
                el.textContent = item.percentage > 0 ? Math.round(item.percentage) + '%' : '0%';
            }
        }
    });
};







    // Function to reset budget display values
    var resetBudget = function () {

        document.querySelector(DOMStrings.budgetValue).textContent = '+ 0.00'
        document.querySelector(DOMStrings.budgetIncomeValue).textContent = '+ 0.00'
        document.querySelector(DOMStrings.budgetExpensesValue).textContent = '- 0.00 '
    }


    // Function to clear input fields after adding an item
    var clearInputField = function () {
        document.querySelector(DOMStrings.inputType).value = '';
        document.querySelector(DOMStrings.inputDescription).value = '';
        document.querySelector(DOMStrings.inputValue).value = '';
    }


    // Expose public methods
    return {
        getInput,
        displayItem,
        displayBudget,
        deleteItem,
        resetBudget,
        getDomStrings,
        clearInputField,
        displayPercentages,
        // displayTotalExpensePercentage
    };

}());
















// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    // Initialization function
    var init = function () {

        // 1. Load saved data
        budgetCtrl.loadData();

        // 2. Render saved income and expense items to UI
        var items = budgetCtrl.getDataStore().allItems;
        items.incomeItems.forEach(function (item) {
            UICtrl.displayItem(item, 'inc');
            console.log(item); // For testing purposes
        });

        items.expenseItems.forEach(function (item) {
            UICtrl.displayItem(item, 'exp');
        });

        // 3. Recalculate budget/totals
        var budget = budgetCtrl.calculateBudget();

        // Display budget/totals
        UICtrl.displayBudget(
            budget.totalIncome,
            budget.totalExpense,
            budget.budget,
            budget.totalExpensePercentage
        );

        // Calculate percentages
        budgetCtrl.calculatePercentages();
        var allPercentages = budgetCtrl.getPercentages();

        // Display percentages
        UICtrl.displayPercentages(allPercentages);

        // 4. Set listeners
        setUpEventListeners();
    }

    // Function to set up event listeners
    var setUpEventListeners = function () {

        // DOM Strings
        var UIConfig = UICtrl.getDomStrings();

        // A single function that calls both callbacks
        var wrapperFunction = function () {
            // 1. Add item flow
            addItemFlow();

            // 2. Clear input fields
            UICtrl.clearInputField();

            // 3. Restore focus to type input field
            document.querySelector(UIConfig.inputType).focus();
        }

        // Event listeners for add button
        document.querySelector(UIConfig.addButton).addEventListener('click', wrapperFunction);

        document.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                wrapperFunction();
            }
        });

        // event listener for delete button using event delegation

        document.querySelector(UIConfig.allItemsContainer).addEventListener('click', function (event) {

            if (event.target && event.target.classList.contains('ion-ios-close-outline')) {

                var itemID, type, ID, splitID;
                itemID = event.target.closest('.item').id;
                splitID = itemID.split('-');
                type = splitID[0];
                ID = Number(splitID[1]);
                console.log(type, ID);
                budgetCtrl.deleteItem(type, ID);

                UICtrl.deleteItem(itemID);

                var budget = budgetCtrl.calculateBudget();
                UICtrl.displayBudget(budget.totalIncome, budget.totalExpense, budget.budget, budget.totalExpensePercentage);
                budgetCtrl.calculatePercentages();
                var allPercentages = budgetCtrl.getPercentages();
                UICtrl.displayPercentages(allPercentages);

                budgetCtrl.saveData();
            }
        })

        document.querySelector('.reset--btn').addEventListener('click', function () {
            // Clear local storage
            localStorage.clear();

            // Reset data store
            budgetCtrl.getDataStore().allItems.incomeItems = [];
            budgetCtrl.getDataStore().allItems.expenseItems = [];
            budgetCtrl.getDataStore().totals.totalIncome = 0;
            budgetCtrl.getDataStore().totals.totalExpenses = 0;
            budgetCtrl.getDataStore().totals.netBudget = 0;

            // Reset UI
            UICtrl.resetBudget();
            UICtrl.clearInputField();

            document.querySelector(UIConfig.inputType).focus();
        });


    }


    // Main function to handle adding item flow
var addItemFlow = function () {
    // 1. Get input
    var input = UICtrl.getInput();
    if (!input.description || input.value <= 0) return;

    // 2. Add item to budgetController
    var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Calculate the budget immediately
    var budget = budgetCtrl.calculateBudget();

    // 4. Calculate percentages immediately after budget
    budgetCtrl.calculatePercentages();

    // 5. Add the item to the UI
    UICtrl.displayItem(newItem, input.type);

    // 6. Update budget display
    UICtrl.displayBudget(
        budget.totalIncome,
        budget.totalExpense,
        budget.budget,
        budget.totalExpensePercentage
    );

    // 7. Display percentages safely
    UICtrl.displayPercentages();

    // 8. Clear input
    UICtrl.clearInputField();
    document.querySelector(UICtrl.getDomStrings().inputType).focus();

    // 9. Save data
    budgetCtrl.saveData();
};



    // Expose public methods
    return {
        init,
        setUpEventListeners
    }


})(budgetController, UIController);

// Initialize the application
controller.init();





// document.getElementById('changeBtn').addEventListener('click', function () {
//     // document.body.style.backgroundColor = getRandomColor();
//     document.body.style.backgroundColor = 'darkblue';

// });


// Mini project: Chat input with clear button to understand local storage

// var textInput = document.getElementById('textInput');

// function saveData() {
//     localStorage.setItem('chatInput', textInput.value);
//     console.log('Data saved:', textInput.value);
// }

// function loadData() {
//     var savedText = localStorage.getItem('chatInput');
//     if (savedText) {
//         textInput.value = savedText;
//         console.log('Data loaded:', savedText);

//     } else {
//         textInput.value = '';
//         console.log('No saved data found.');
//     }
// }
// loadData();
// // document.addEventListener('DOMContentLoaded', loadData);

// textInput.addEventListener('input', saveData);
// document.getElementById('clearBtn').addEventListener('click', function () {
//     localStorage.clear();
//     textInput.value = '';
//     console.log('Data cleared.');
// });