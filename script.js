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
            netBudget: 0
        }
    };

    // Item Constructor
    class Item {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
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

        var newItem = new Item(itemArray.length, description, value);
        itemArray.push(newItem);

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

        return {
            totalIncome: '+ ' + budgetTotals.totalIncome.toFixed(2),
            totalExpense: '- ' + budgetTotals.totalExpenses.toFixed(2),
            budget: '+ ' + budgetTotals.netBudget.toFixed(2)
        }
    }


    // Expose public methods
    return {
        addItem,
        calculateBudget,
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
        addButton: '.add__btn'

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
        var html;
        var budgetSelector = type === 'inc' ? '.income__list' : '.expenses__list';

        html = `
            <div class="item clearfix" id="${type}-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>
            `;
        document.querySelector(budgetSelector).insertAdjacentHTML('beforeend', html);
    }


    // Function to display budget values
    var displayBudget = function (income, expenses, budget) {
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
                </div>
            </div>
    
        `

        document.querySelector(DOMStrings.budgetValue).innerHTML = budget;
        document.querySelector(DOMStrings.budgetIncomeValue).innerHTML = income;
        document.querySelector(DOMStrings.budgetExpensesValue).innerHTML = expenses;
    }


    // Function to reset budget display values
    var resetBudget = function () {

        document.querySelector(DOMStrings.budgetValue).textContent = '+ 00.00'
        document.querySelector(DOMStrings.budgetIncomeValue).textContent = '+ 00.00'
        document.querySelector(DOMStrings.budgetExpensesValue).textContent = '- 00.00 '
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
        resetBudget,
        getDomStrings,
        clearInputField
    };

}());


// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    // Initialization function
    var init = function () {

        // reset Values
        UICtrl.resetBudget();
        console.log('App fully initialized');
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


            // Restore focus to description input field
            document.querySelector(UIConfig.inputType).focus();
        }

        // Event listeners for add button
        document.querySelector(UIConfig.addButton).addEventListener('click', wrapperFunction);

        document.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                wrapperFunction();
            }
        });
    }


    // Main function to handle adding item flow
    var addItemFlow = function () {
        // 1. Get the field input data
        var input = UICtrl.getInput();


        // 2. Add the item to the budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);


        // 3. Add the item to the UI
        UICtrl.displayItem(newItem, input.type);


        // 4. Calculate the budget
        var budget = budgetCtrl.calculateBudget();


        // 5. Display the budget on the UI
        UICtrl.displayBudget(budget.totalIncome, budget.totalExpense, budget.budget)
    };


    // Expose public methods
    return {
        init,
        setUpEventListeners
    }


})(budgetController, UIController);

// Initialize the application
controller.init();