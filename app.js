                        //*******************Budget Controller**************
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1
    };
    
    Expense.prototype.calcPercentages = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome)* 100);
        } else {
            this.percentage = -1;
        }  
    };
    

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };
    
    
    var allExpenses = [];
    var allIncome = [];
    var totalExpenses = 0;
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
        
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem, id;
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }  
            if (type === "exp") {
                newItem = new Expense(id, des, val);
            } else if (type === "inc") {
                newItem = new Income(id, des, val);
            }
            
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        
        calculateBudget: function() {
            
            //Calculate total inc and exp
            calculateTotal('inc');
            calculateTotal('exp');
            
            //Calculate the budget = inc - exp
            data.budget = data.totals.inc - data.totals.exp;
            
            
            
            //Calculate the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
            
            //Expense = 100 income 200, spent 50
            
            },
        getBudget: function() {
          return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          }  
        },
        
        deleteItem: function(type, id) {
            var ids;
            var index;
            // id = 3
//            data.allItems[type][id]
            
            ids = data.allItems[type].map(function(current) {
                
                return current.id;
            });
            index = ids.indexOf(id);
            
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculatePercentages: function () {
            data.allItems.exp.forEach(function(current) {      
                current.calcPercentages(data.totals.inc);
            })
            
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
               return cur.getPercentage(); 
            });
            return allPerc;
        },
        
        testing: function() {
            console.log(data);
        },
        
        
    
        
    };
    
})();

//                              *******************UI Controller**************
var UIController = (function() {
    
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
        
    };
    
     var nodeListForEach = function(list, callback) {
                for(var i = 0; i < list.length; i++) {
                    callback(list[i], i)
                }
            };
    
    return {
        getinput: function() {
            return {
            type: document.querySelector(DOMstrings.inputType).value,
            description : document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)};
        },
        
        addListItem: function(obj, type) {
            var html, element, newHtml;
            // Create HTML strings with placeholder text
            if(type === "inc") {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if(type === "exp"){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            
            
            // Replace the placeholder with actual data
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', this.formatNumber(obj.value, type));
            
            // insert the HTML to the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend",newHtml)
            
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            // Since this returns a List not an array, we use slice to trick it into returning a brandnew Array
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
                });
            fieldsArr[0].focus();
        },
        
        getDOMstrings: function() {
        return DOMstrings;
        },
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";
            
            document.querySelector(DOMstrings.budgetLabel).textContent = this.formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = this.formatNumber(obj.totalInc, "inc");
            document.querySelector(DOMstrings.expensesLabel).textContent = this.formatNumber(obj.totalExp, "exp");
            
            if(obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
            } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = "---";
                
            }
        },
        deleteListItem: function (selectorID) {
            
            var el =  document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
        },
        
        displayPercentage: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
           
            
            nodeListForEach(fields, function(current, index) {
            if (percentages[index] > 0) {
                current.textContent = percentages[index] +"%";
            } else {
                current.textContent = "---";
            }
            });
        },
        formatNumber: function(num, type) {
            var numSplit;
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split(".");
            
            int = numSplit[0];
            
            if (int.length > 3) {
                
                int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
                
            }
            
            
            dec = numSplit[1];
            
            return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
            
        },
        
        displayMonth: function() {
            
            var now, year, month;
            now = new Date();
            strMonth = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
            month = now.getMonth()
            year = now.getFullYear();
            
            document.querySelector(DOMstrings.dateLabel).textContent = strMonth[month] + " " + year;
            
        },
        changeType: function() {
            
            var fields;
            
            fields = document.querySelectorAll(
                DOMstrings.inputType + "," +
                DOMstrings.inputDescription + "," +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle("red-focus");
                
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
            
            
            
            
            
        },
    
    //Some code
    
    }})();





                    //*******************Global App Controller**************







var appController = (function(budgetCtrl, UICtrl) { 

    var settupEventListeners = function() {
        
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
        
        document.querySelector(DOM.inputType).addEventListener("change", UICtrl.changeType);
    
        document.addEventListener("keypress", function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }}); document.querySelector(DOM.container).addEventListener("click",ctrlDeleteItem);
    };
    
    
    
    
    var DOM = UICtrl.getDOMstrings();
    
    var updateBudget = function () {
        // Calculate the Budget
        budgetCtrl.calculateBudget();
        
        
        // return the budget
        var budget = budgetCtrl.getBudget();
        
        
        
        
        // Display BUdget on the UI
        UICtrl.displayBudget(budget);
    }
    
    
    var ctrlAddItem = function() {
        var input, newItem;
           // Get input Data
        input = UICtrl.getinput();
//        console.log(input);
        //Add the Item to the budget controller
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //Add the item to the UI
    
            UICtrl.addListItem(newItem, input.type);
        
        // Clear the input field
        
            UICtrl.clearFields();
        
        //Calculate and update the budget
            updateBudget();
        
        
            updatePercentages();
            
        
            
        }
    };
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            
            splitID = itemID.split("-");
            type = splitID[0];
            id = parseInt(splitID[1]);
            
            
            // Delete the Item from the Data
            
            budgetCtrl.deleteItem(type, id);
            
            
            
            // Delete the Item from the UI
            UICtrl.deleteListItem(itemID);
            
            
            // Update and show the new budget
            
            
             updateBudget();
            
             updatePercentages();
            
            
            
            
        }
    };
    var updatePercentages = function () {
        
//        Calculate the percentage
        budgetCtrl.calculatePercentages();
        
//        Read from the budgetCtrl
        var percentages = budgetCtrl.getPercentages();
        
//        Update the UI
        UICtrl.displayPercentage(percentages);
        
    }

    
    

    
    
    return {
        init: function() {
            settupEventListeners();
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
              totalInc: 0,
              totalExp: 0,
              percentage: -1})

        }
    };
    
    
    
    

    
})(budgetController, UIController);


appController.init();