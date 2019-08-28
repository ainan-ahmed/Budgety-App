var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1 ;
    }
    Expense.prototype.calcPercentage  =  function(income){
        if(income >0) 
        this.percentage =  Math.round((this.value / income)*100) ;
        else
        this.percentage = -1;
 

    }
    Expense.prototype.getPercentage  =  function(){
        return this.percentage ;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var calcTotal = function(type){
        var sum = 0; 
            data.items[type].forEach(function(curr){
            sum +=curr.value;
        })
        data.totals[type]=sum;
    }
    var data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        tot:0,percentage:0
    }
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            if (data.items[type].length  > 0)
                ID = data.items[type][data.items[type].length - 1].id + 1;
            else
                ID = 1;
            if (type === 'inc') {
                newItem = new Income(ID, des, val)
                //document.querySelector('.budget-income-value').innerHTML = data.totals[type];
            } else {
                newItem = new Expense(ID, des, val)
                
                //document.querySelector('.budget-expenses-value').innerHTML = data.totals[type];
            }
            data.items[type].push(newItem);

            //document.querySelector('.budget__value').innerHTML = data.totals.inc - data.totals.exp;
            return newItem;
        },
        calcBudget: function(){
            calcTotal('inc');
            calcTotal('exp');
            data.tot=data.totals.inc-data.totals.exp;
            if(data.totals.inc > 0 ){
                data.percentage = (data.totals.exp*100)/data.totals.inc;
                data.percentage=Math.round(data.percentage);
            }
            else data.percentage =-1;

           
            
        },
        calculatePercentage: function(){
            var Income = data.totals.inc;    
            data.items.exp.forEach(function(curr){
                curr.calcPercentage(Income);
            });
        },
        getPercentages: function(){
            var tmp  = data.items.exp.map(function(curr){
                return curr.getPercentage();
            });
            return tmp;
        },
        getBudgetData:function(){
            return{
                budget:data.tot,totInc:data.totals.inc,totExp:data.totals.exp,perc:data.percentage
            }
        },
        deleteItem: function(type,iD){
            iD = parseInt(iD);
             var ids = data.items[type].map(function(curr){
                    return curr.id;
             });
              
              index =ids.indexOf(iD);
              
              if(index !== -1)
              {
                  data.items[type].splice(index,1);
              }
        },
        
    }

})();


var uiController = (function () {

    function formatNumber(num,type){
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int  = numSplit[0];
        dec = numSplit[1];
        if(int.length >3)
        {
            int =  int.substr(0,int.length-3)+ ',' + int.substr(int.length - 3 , 3);
        }
        return (type === 'exp'?'-':'+') + ' ' + int +'.' + dec ; 
    }
    var nodeListForEach = function(list,callback)
            {
                for(var i = 0;i<list.length;i++)
                {
                        callback(list[i],i);
                }
            }
    return {
        getInput: function () {
            return {
                type: document.querySelector('.add__type').value,
                descrip: document.querySelector('.add__description').value,
                val: parseFloat(document.querySelector('.add__value').value),
            }
        },

        addListItems: function (obj, type) {
            var html, element;
            if (type === 'inc') {
                element = '.income__list'
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = '.expenses__list'
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

        },
        clearFields: function () {
            var fields = document.querySelectorAll('.add__description' + ',' + '.add__value');
            fields = Array.prototype.slice.call(fields);
            fields.forEach(function (curr) {
                curr.value = '';
            })
            fields[0].focus();
        },
        updateUI:function(obj){
            document.querySelector('.budget-income-value').innerHTML = formatNumber(obj.totInc,'inc');
            document.querySelector('.budget-expenses-value').innerHTML = formatNumber(obj.totExp,'exp');
            document.querySelector('.budget__value').innerHTML = formatNumber(obj.budget,(obj.budget >=0)?'inc':'exp');
            if(obj.perc > 0)
                document.querySelector('.budget__expenses--percentage').innerHTML = obj.perc + '%';
            else
                document.querySelector('.budget__expenses--percentage').innerHTML = '----';
        },
        displayPercentages: function(percentagesList){
            var fields = document.querySelectorAll('.item__percentage');
            
            
            nodeListForEach(fields,function(curr,idx){
                if(percentagesList[idx] > 0 )
                    curr.textContent = percentagesList[idx] + '%';
                else
                    curr.textContent = '---';
            });
        },
        updateYear()
        {
            var now= new Date();
            var year = now.getFullYear();
            var month = now.getMonth();
            var ara = ['January','February','March','April','May','June','July','August','September','October','November','December'];    
            document.querySelector('.budget__title--month').innerHTML =' ' + ara[month] + ', ' + year;
        },
        ChangedType: function(){
            var fields = document.querySelectorAll('.add__type' + ',' + '.add__description' + ',' + '.add__value');
            nodeListForEach(fields,function(curr){
                console.log(curr);
                curr.classList.toggle('red-focus');
            });
            document.querySelector('.add__btn').classList.toggle('red');
        },
        deleteItemInList : function(id)
        {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
        }
    };

})();




var controller = (function (bdCtrl, uiCtrl) {


    function ctrlAddItem() {
        //console.log('It works')
        //Getting the input from ui controller
        var inp = uiCtrl.getInput();
        if (inp.descrip !== "" && !isNaN(inp.val) && inp.val > 0) {
            //adding the item to budget controller
            var addedItem = bdCtrl.addItem(inp.type, inp.descrip, inp.val);
            //adding the item to the ui controller
            uiCtrl.addListItems(addedItem, inp.type);
            //clearing input fields 
            uiCtrl.clearFields();
            calculate_update();
        }



    }
    function ctrlDeleteItem(event){
        var itemID,type,id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        if(itemID)
        {
            var tmp= itemID.split('-');
            type = tmp[0];
            id = tmp[1];
            //deleting the item from DS
            bdCtrl.deleteItem(type,id); 
            //deleting from UI
            uiCtrl.deleteItemInList(itemID);
            
            calculate_update();
            

        }
    };
    function updatePercentage(){
        //calculating percentages
        bdCtrl.calculatePercentage();
        //percentage data
        var perc =  bdCtrl.getPercentages();    
        //updating in ui
        uiCtrl.displayPercentages(perc);
    }
    function calculate_update()
    {
        //calculating the budget
        bdCtrl.calcBudget();
        //getting all the budget data in a variable
        var allData = bdCtrl.getBudgetData();
        
        //updating budget data in ui
            uiCtrl.updateUI(allData);
        //updating percentages
        updatePercentage();    
    }
    function setupEventListeners() {
        document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }

        });
        document.querySelector('.add__type').addEventListener('change',uiCtrl.ChangedType);
        document.querySelector('.container').addEventListener('click',ctrlDeleteItem)
        
    }

    return {
        init: function () {
            console.log('Application has Started');
            uiCtrl.updateYear();
            setupEventListeners();
        }
    }

})(budgetController, uiController);

controller.init();