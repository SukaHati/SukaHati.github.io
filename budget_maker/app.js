document.addEventListener('DOMContentLoaded', () => {
    const xValues = ["Income", "Expense"];
    let yValues = [0, 0];
    const barColors = ["#00ff00", "#ff0000"];
    const bigData = [];
    let currentRowCount = 2;
    
    //Setting the date
    const daysValueMultiplier = 24 * 60 * 60 * 1000;
    const thisday = new Date();
    const thismonth = thisday.getMonth() + 1;
    const thisyear = thisday.getYear() + 1900;
    const thisnewyear = new Date(thisyear, 0, 1);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById("input_date1").valueAsDate = thisday;
    const chart_title_text = months[thisday.getMonth()] + " Monthly Budget";
    
    const chart_array = ["Day", "Week", "Month", "Year", "Lifetime"];
    let chart_mode = document.getElementById("chart_mode").value;
    let time_value = thisday.getMonth();
    
    let thechart = new Chart("chart_1", {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: chart_title_text
            }
        }
    });
    
    chart_month_mode();
    
    document.getElementById("chart_mode").addEventListener("change", () => {
        chart_mode = document.getElementById("chart_mode").value;
            document.getElementById("table_config_cell_option_desc_1").innerHTML = "";
            document.getElementById("table_config_cell_option_1").innerHTML = "";
            document.getElementById("table_config_cell_option_desc_2").innerHTML = "";
            document.getElementById("table_config_cell_option_2").innerHTML = "";
        if(chart_mode == "day") {
            let var_input = '<input id="chart_date1" type="date">';
            document.getElementById("table_config_cell_option_desc_1").innerHTML = "Select Date:";
            document.getElementById("table_config_cell_option_1").innerHTML = var_input;
            document.getElementById("chart_date1").valueAsDate = thisday;
            document.getElementById("chart_date1").addEventListener("change", () => {
                edit_thechart();
            })
            edit_thechart();
        }
        else if(chart_mode == "week") {
            let var_week_input = '<td><input id="chart_week" type="week"></td>';
            document.getElementById("table_config_cell_option_desc_1").innerHTML = "Select Week:";
            document.getElementById("table_config_cell_option_1").innerHTML = var_week_input;
            const chart_week = document.getElementById("chart_week");
            chart_week.valueAsDate = thisday;
            chart_week.addEventListener("change", () => {
                getDateinWeek(chart_week.value);
                edit_thechart();
            })
            edit_thechart();
        }
        else if(chart_mode == "month") {
            chart_month_mode();
        }
        else if(chart_mode == "year") {
            let var_year_input = '<td><input id="chart_year" type="number" min="0"></td>';
            document.getElementById("table_config_cell_option_desc_1").innerHTML = "Select Year:";
            document.getElementById("table_config_cell_option_1").innerHTML = var_year_input;
            document.getElementById("chart_year").value = thisyear;
            document.getElementById("chart_year").addEventListener("change", () => {
                if(document.getElementById("chart_year").value < 0) {
                    alert("The value cannot be in negative!");
                    document.getElementById("chart_year").value = thisyear;
                }
                edit_thechart();
            });
            edit_thechart();
        }
        else {
            document.getElementById("table_config_cell_option_desc_1").innerHTML = "";
            document.getElementById("table_config_cell_option_1").innerHTML = "";
        }
        console.log(chart_mode);
    })
    
    document.getElementById("input_name1").addEventListener("change", () => {
        add_item_list_to_database("table_row1");
        add_input_row("table_row1");
    });
    document.getElementById("input_amount1").addEventListener("change", () => {
        if(document.getElementById("input_amount1").value < 0) {
            alert("The value cannot be in negative!");
            document.getElementById("input_amount1").value = 0
        }
        else {
            combo_input("table_row1");
        }
    });
    document.getElementById("input_type1").addEventListener("change", () => {
        add_item_list_to_database("table_row1");
        add_input_row("table_row1");
    });
    document.getElementById("input_date1").addEventListener("change", () => {
        add_item_list_to_database("table_row1");
        add_input_row("table_row1");
    });
    
    //For showing differences between the income and expenses
    document.getElementById("sum_income").innerHTML = yValues[0];
    document.getElementById("sum_expenses").innerHTML = -1 * yValues[1];
    document.getElementById("sum_total").innerHTML = yValues[0] - yValues[1];
    if(document.getElementById("sum_total").innerHTML < 0) {
        document.getElementById("sum_total").style.color = "red";
    }
    else if(document.getElementById("sum_total").innerHTML > 0) {
        document.getElementById("sum_total").style.color = "green";
    }
    
    function add_input_row(row_id) {
        let therow = document.getElementById(row_id);
        let therowIndex = therow.rowIndex;
        let thetable = document.getElementById("table_input")
        
        //check if an array with same id is exist
        let new_row_id = "table_row" + currentRowCount;
        if(document.getElementById(new_row_id)) {
            return;
        }
        
        //check the row is actually at the table bottom
        if(therowIndex < thetable.rows.length - 1) {
            return;
        }
        
        //generating the new row
        let new_row = thetable.insertRow(-1);
        new_row.id = new_row_id;
        let cell = new_row.insertCell(0);
        let new_input_name = "input_name" + currentRowCount;
        cell.innerHTML = '<td><input id="' + new_input_name + '" type="text"></td>';
        cell = new_row.insertCell(1);
        let new_input_amount = "input_amount" + currentRowCount;
        cell.innerHTML = '<td><input id="' + new_input_amount + '" type="number"></td>';
        cell = new_row.insertCell(2);
        let new_input_type = "input_type" + currentRowCount;
        cell.innerHTML = '<td><select id="' + new_input_type + '" name="income_or_expenses"><option value="income">Income</option><option value="expenses">Expenses</option></select></td>';
        cell = new_row.insertCell(3);
        let new_input_date = "input_date" + currentRowCount;
        cell.innerHTML = '<td><input id="' + new_input_date + '" type="date"></td>';
        document.getElementById(new_input_date).valueAsDate = new Date();
        cell = new_row.insertCell(4);
        cell.id = "input_remove" + currentRowCount;
        
        //add event listener to the new elements in the row
        let new_number = currentRowCount + 1;
        document.getElementById(new_input_name).addEventListener("change", () => {
            combo_input(new_row_id);
        });
        document.getElementById(new_input_amount).addEventListener("change", () => {
            if(document.getElementById(new_input_amount).value < 0) {
                alert("The value cannot be in negative!");
                document.getElementById(new_input_amount).value = 0
            }
            combo_input(new_row_id);
        });
        document.getElementById(new_input_type).addEventListener("change", () => {
            combo_input(new_row_id);
        });
        document.getElementById(new_input_date).addEventListener("change", () => {
            combo_input(new_row_id);
        });
        
        
        //adding remove button to the input table row
        add_remove_button_in_the_input_table();
        
        currentRowCount += 1;
    }
    
    function add_item_list_to_database(therow_id) {
        let theRowSplitter = therow_id.split("table_row");
        let theRowNumber = theRowSplitter[1];
        let keyname = "item_" + theRowNumber;
        if(!document.getElementById("input_amount" + theRowNumber).value)
            document.getElementById("input_amount" + theRowNumber).value = 0;
        const theItem = {
            name: document.getElementById("input_name" + theRowNumber).value,
            amount: document.getElementById("input_amount" + theRowNumber).value,
            type: document.getElementById("input_type" + theRowNumber).value,
            date: document.getElementById("input_date" + theRowNumber).value
        };
        bigData[keyname] = theItem;
        //console.log(bigData);
        sum_item_dataset(bigData);
        const theItemList = {};
    }
    
    function sum_item_dataset(theArray) {
        let thesum = [0, 0];
        for(var keyName in theArray) {
            if(theArray[keyName].type == "income") {
                thesum[0] += parseInt(theArray[keyName].amount);
            }
            else {
                thesum[1] += parseInt(theArray[keyName].amount);
            }
        }
        //console.log(thesum);
        edit_thechart();
    }
    
    function dede() {
        let thesum = [0, 0];
        for(var keyName in theArray) {
            let item_date = theArray[keyName].date;
            if(chart_mode == chart_array[1]) {
                item_date = item_date.getMonth();
            }
            if(theArray[keyName].date.getMonth() == thecharttime) {
                if(theArray[keyName].type == "income") {
                    thesum[0] += parseInt(theArray[keyName].amount);
                }
                else {
                    thesum[1] += parseInt(theArray[keyName].amount);
                }
            }
        }
    }
    
    function add_remove_button_in_the_input_table() {
        let thetable = document.getElementById("table_input");
        
        //loop
        let table_max_minus_one = thetable.rows.length - 1;
        for(i=1;i<table_max_minus_one;i++) {
            let thisrow = thetable.rows[i];
            let thiscell = thisrow.cells[4];
            thiscell.innerHTML = "remove";
            thiscell.classList.add("table_input_row_remove_btn");
            thiscell.addEventListener("click", function() {
                let x = thisrow.id;
                remove_item_bigData(x);
                document.getElementById(x).remove();
            });
        }
    }
    
    function edit_thechart() {
        let theArray = [0, 0];
        if(chart_mode == "day") {
            for(var keyName in bigData) {
                if(bigData[keyName].date == document.getElementById("chart_date1").value) {
                    if(bigData[keyName].type == "income") {
                        theArray[0] += parseInt(bigData[keyName].amount);
                    }
                    else if(bigData[keyName].type == "expenses") {
                        theArray[1] += parseInt(bigData[keyName].amount);
                    }
                }
            }
        }
        else if(chart_mode == "week") {
            
        }
        else if(chart_mode == "month") {
            for(var keyName in bigData) {
                let keydate = bigData[keyName].date.split("-");
                let select_chart_month = parseInt(document.getElementById("chart_month").value);
                let select_chart_year = parseInt(document.getElementById("chart_year").value);
                if(select_chart_month == parseInt(keydate[1]) && select_chart_year == parseInt(keydate[0])) {
                    if(bigData[keyName].type == "income") {
                        theArray[0] += parseInt(bigData[keyName].amount);
                    }
                    else if(bigData[keyName].type == "expenses") {
                        theArray[1] += parseInt(bigData[keyName].amount);
                    }
                }
            }
        }
        else if(chart_mode == "year") {
            for(var keyName in bigData) {
                let theobject = bigData[keyName];
                let keydate = theobject.date.split("-");
                //grab the year from keydate
                keydate = keydate[0];
                if(keydate == document.getElementById("chart_year").value) {
                    if(bigData[keyName].type == "income") {
                        theArray[0] += parseInt(bigData[keyName].amount);
                    }
                    else if(bigData[keyName].type == "expenses") {
                        theArray[1] += parseInt(bigData[keyName].amount);
                    }
                }
            }
        }
        else if(chart_mode == "lifetime") {
            for(var keyName in bigData) {
                if(bigData[keyName].type == "income") {
                    theArray[0] += parseInt(bigData[keyName].amount);
                }
                else if(bigData[keyName].type == "expenses") {
                    theArray[1] += parseInt(bigData[keyName].amount);
                }
            }
        }
        //thechart.type = changetype;
        thechart.data.datasets[0].data = theArray;
        thechart.update();
    }
    
    function combo_input(row_id) {
        add_item_list_to_database(row_id);
        add_input_row(row_id);
    }
    
    function remove_item_bigData(therow_id) {
        let theRowSplitter = therow_id.split("table_row");
        let theRowNumber = theRowSplitter[1];
        let keyname = "item_" + theRowNumber;
        delete bigData[keyname];
        edit_thechart();
    }
    
    function remove_input_row(x) {
        let rowNumber = x.rowIndex;
        alert(rowNumber);
        document.getElementById("table_input").deleteRow(2);
    }
    
    function wrap_string_with(thestring, string2) {
        return string2 + thestring + string2;
    }
    
    function create_time_selection(timespan) {
        let option_string = "";
        if(timespan == "month") {
            for(i=1;i<13;i++) {
                if(i == thismonth) {
                    option_string += '<option value="' + i + '" selected>' + i + '</option>';
                }
                else {
                    option_string += '<option value="' + i + '">' + i + '</option>';
                }
            }
            let combine_string = '<td><select id="chart_month">' + option_string + '</select></td>';
            return combine_string;
        }
        else if(timespan == "year") {
            for(i=0;i<=9999;i++) {
                if(i == thisyear) {
                    option_string += '<option value="' + i + '" selected>' + i + '</option>';
                }
                else {
                    option_string += '<option value="' + i + '">' + i + '</option>';
                }
            }
            let combine_string = '<td><select id="chart_year">' + option_string + '</select></td>';
            return combine_string;
        }
    }
    
    function chart_month_mode() {
            console.log("active!");
            let var_month_input = create_time_selection("month");
            let var_year_input = '<td><input id="chart_year" type="number" min="0"></td>';
            document.getElementById("table_config_cell_option_desc_1").innerHTML = "Select Month:";
            document.getElementById("table_config_cell_option_1").innerHTML = var_month_input;
            document.getElementById("chart_month").addEventListener("change", () => {
                edit_thechart();
            });
        
            //years input section
            document.getElementById("table_config_cell_option_desc_2").innerHTML = "Select Year:";
            document.getElementById("table_config_cell_option_2").innerHTML = var_year_input;
            document.getElementById("chart_year").value = thisyear;
            document.getElementById("chart_year").addEventListener("change", () => {
                if(document.getElementById("chart_year").value < 0) {
                    alert("The value cannot be in negative!");
                    document.getElementById("chart_year").value = thisyear;
                }
                edit_thechart();
            });
            edit_thechart();
    }
    
    function getDateinWeek(weekValue) {
        let x = [0, 0];
        let selectedWeek = weekValue.split("-W");
        let weekAmount = selectedWeek[1] - 1;
        let selectedYear = selectedWeek[0];
        let weekAmountTimeStamp = weekAmount * 7 * daysValueMultiplier;
        //Find new year and then find the day of the week for the year
        let selectednewyear = new Date(selectedYear, 0, 1);
        let selectednewyeartimestamp = selectednewyear.getTime();
        let getWeeksAfter = 0;
        if(selectednewyear.getDay() != 1) {
            let selectYearMondayTimeStamp = 0;
            if(selectednewyear.getDay() == 0) {
                selectYearMondayTimeStamp = selectednewyeartimestamp + daysValueMultiplier;
            }
            else {
                selectYearMondayTimeStamp = selectednewyeartimestamp + (8 - selectednewyear.getDay()) * daysValueMultiplier;
            }
            getWeeksAfter = selectYearMondayTimeStamp + weekAmountTimeStamp;
        }
        else {
            getWeeksAfter = selectednewyeartimestamp + weekAmountTimeStamp;
        }
        //find Monday end
        let newDate = new Date(getWeeksAfter);
        //determine if this new day is Monday
        let whatnewDate = newDate.getDay();
        let mondayoftheweekstimestamp = 0;
        if(whatnewDate > 1) {
            mondayoftheweekstimestamp = getWeeksAfter - ((whatnewDate - 1) * daysValueMultiplier);
        }
        else if(whatnewDate < 1) {
            mondayoftheweekstimestamp = getWeeksAfter - 6 * daysValueMultiplier;
        }
        else {
            mondayoftheweekstimestamp = getWeeksAfter;
        }
        let sundayoftheweekstimestamp = mondayoftheweekstimestamp + 6 * daysValueMultiplier;
        const mondayoftheweeks = new Date(mondayoftheweekstimestamp);
        const sundayoftheweeks = new Date(sundayoftheweekstimestamp);
        //return [mondayoftheweeks, sundayoftheweeks];
    }
    
})