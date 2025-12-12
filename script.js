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
        if (type === 'inc') {
            var newItem = new Item(incomeItems.length, description, value);
            incomeItems.push(newItem);
            return newItem;
        } else {
            var newItem = new Item(expenseItems.length, description, value);
            expenseItems.push(newItem);
            return newItem;
        }
    };

    return {
        addItem
    };
}());

// UI CONTROLLER

var UIController = (function () {
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

    return {
        getInput,
        displayItem
    };

}());


// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var addItemFlow = function () {
        // 1. Get the field input data

        var input = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller

        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        console.log(newItem);

        // 3. Add the item to the UI
        UICtrl.displayItem(newItem, input.type);
        // 4. Calculate the budget

        // 5. Display the budget on the UI

        console.log('Add item flow triggered');
    };

    document.querySelector('.add__btn').addEventListener('click', addItemFlow);


    document.addEventListener('keypress', function (event) {
        // console.log(event);
        if (event.key === 'Enter') {
            addItemFlow();
        }
    });


})(budgetController, UIController);