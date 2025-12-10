// BUDGET CONTROLLER

var budgetController = (function() {


}());

// UI CONTROLLER

var UIController = (function() {
    function getInput(){
        var type = document.querySelector('.add__type').value;
        var description = document.querySelector('.add__description').value;
        var value = Number(document.querySelector('.add__value').value);

        return {
            type,
            description,
            value
        };
    }

    return {
        getInput
    };

}());


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var addItemFlow = function() {
        // 1. Get the field input data
    
        var input = UICtrl.getInput();
        console.log(input);
        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI

        console.log('Add item flow triggered');
    };

    document.querySelector('.add__btn').addEventListener('click', addItemFlow);


    document.addEventListener('keypress', function(event) {
        // console.log(event);
        if (event.key === 'Enter') {
            addItemFlow();
        }
    });


})(budgetController, UIController);