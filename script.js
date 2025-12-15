// BUDGET CONTROLLER

console.log('Obianuju is a very big name!')

var budgetController = (function () {

    var incomeItems = [];
    var expenseItems = [];

    class Item {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    var addItem = function (type, description, value) {
        // var budgetSelector = type === 'inc' ? '.income__list' : '.expenses__list';
        if (type === 'inc') {
            var newItem = new Item(incomeItems.length, description, value);
            incomeItems.push(newItem);
            // console.log(newItem); // Shit added for debugging and it works

            return newItem;
        } else {
            var newItem = new Item(expenseItems.length, description, value);
            expenseItems.push(newItem);
            return newItem;
        }
    };

    var calculateBudget = function () {
        var totalIncome = 0;
        var totalExpense = 0;
        var netBudget = 0;

        for (var i = 0; i < incomeItems.length; i++) {
            totalIncome += incomeItems[i].value;
        }

        for (var i = 0; i < expenseItems.length; i++) {
            totalExpense += expenseItems[i].value;
        }

        netBudget = totalIncome - totalExpense;

        return {
            totalIncome: totalIncome,
            totalExpense: totalExpense,
            budget: netBudget
        }
    }

    return {
        addItem,
        calculateBudget,
    };
}());



// UI CONTROLLER

var UIController = (function () {
    document.querySelector('.budget__income--value').textContent = '00.00'

    function getInput() {
        var type = document.querySelector('.add__type').value;
        var description = document.querySelector('.add__description').value;
        var value = Number(document.querySelector('.add__value').value);

        return {
            type,
            description,
            value
        };
    }

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

    var displayBudget = function (income, expenses, budget) {
        var html;

        html = `
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

        document.querySelector('.budget__value').innerHTML = budget;
        document.querySelector('.budget__income--value').innerHTML = income;
        document.querySelector('.budget__expenses--value').innerHTML = expenses;

    }

    return {
        getInput,
        displayItem,
        displayBudget
    };

}());


// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

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


        console.log('Add item flow triggered');
    };


    document.querySelector('.add__btn').addEventListener('click', addItemFlow);

    document.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addItemFlow();
        }
    });


})(budgetController, UIController);