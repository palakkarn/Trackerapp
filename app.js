let ExpenseController = (() => {
  let total = 0,
    savings = 0,
    expenses = 0,
    investments = 0;

  return {
    inputEntry(userInput) {
      if (userInput["expenseType"] === "savings") {
        savings += userInput["value"];
        total += userInput["value"];
      }
      if (userInput["expenseType"] === "investment") {
        investments += userInput["value"];
        total -= userInput["value"];
      }
      if (userInput["expenseType"] === "expense") {
        expenses += userInput["value"];
        total -= userInput["value"];
      }
    },

    getSavingsData() {
      return savings;
    },

    getExpensesData() {
      return expenses;
    },

    getInvestmentData() {
      return investments;
    },

    getTotalData() {
      return total;
    },
  };
})();

let UIController = (() => {
  let expenseType = "savings";

  let HTMLStrings = {
    inExpenseDescription: ".input-expense-description",
    inExpenseValue: ".input-expense-value",
    btnSubmitExpense: ".btn-submit-expense",
    expenseList: ".expense-list",
    currentMonth: "#current-month",
    typeExpense: "#type-expense",
    typeSavings: "#type-savings",
    typeInvestment: "#type-investment",
    trackingText: ".tracking-text",
    expenseChart: "#expense-chart",
    monthBudget: "#month-budget",
  };

  let expList = [];

  return {
    numberFormat(number) {
      return Intl.NumberFormat("en-IN").format(number);
    },
    showCurrentMonth() {
      let now, month, year, months;

      now = new Date();
      month = now.getMonth();
      year = now.getFullYear();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      document.querySelector(HTMLStrings.currentMonth).textContent =
        months[month] + " " + year;
    },

    getHTMLStrings() {
      return HTMLStrings;
    },

    setExpenseType(type) {
      console.log("here", type);
      this.expenseType = type;
      let emoji = "💰";
      if (type === "savings") {
        emoji = "💰";
        if (
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.contains("btn-warning")
        ) {
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.remove("btn-warning");
        }
        if (
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.contains("btn-danger")
        ) {
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.remove("btn-danger");
        }
        if (
          !document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.contains("btn-success")
        ) {
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.add("btn-success");
        }
      }

      if (type === "expense") {
        emoji = "🧾";
        if (
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.contains("btn-warning")
        ) {
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.remove("btn-warning");
        }
        if (
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.contains("btn-success")
        ) {
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.remove("btn-success");
        }
        if (
          !document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.contains("btn-danger")
        ) {
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.add("btn-danger");
        }
      }
      if (type === "investment") {
        emoji = "🏠";
        if (
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.contains("btn-danger")
        ) {
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.remove("btn-danger");
        }
        if (
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.contains("btn-success")
        ) {
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.remove("btn-success");
        }
        if (
          !document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.contains("btn-warning")
        ) {
          document
            .querySelector(HTMLStrings.btnSubmitExpense)
            .classList.add("btn-warning");
        }
      }

      document.querySelector(HTMLStrings.trackingText).textContent =
        "Tracking " + type + " " + emoji;
    },

    // API to post data
    postExp(date, desc, val, type) {
      fetch("https://sheetdb.io/api/v1/00wq76tnacv5h", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Date: date,
          Description: desc,
          Value: val,
          Type: type,
        }),
      })
        .then((res) => res.json())
        .then((res) => this.getExp());
    },

    // API to get data
    getExp() {
      fetch("https://sheetdb.io/api/v1/00wq76tnacv5h", {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((resp) => {
          console.log("API Data", resp);
          let formatData = resp.map((res) => ({
            date: res.Date,
            desc: res.Description,
            val: res.Value,
            type: res.Type,
          }));
          this.addListItem(formatData);
        });
    },

    getUserExpenseInput() {
      this.postExp(
        new Date().toLocaleDateString(),
        document.querySelector(HTMLStrings.inExpenseDescription).value,
        parseInt(document.querySelector(HTMLStrings.inExpenseValue).value),
        this.expenseType ? this.expenseType : "savings"
      );
      return {
        description: document.querySelector(HTMLStrings.inExpenseDescription)
          .value,
        value: parseInt(
          document.querySelector(HTMLStrings.inExpenseValue).value
        ),
        date: new Date().toLocaleDateString(),
        expenseType: this.expenseType ? this.expenseType : "savings",
      };
    },

    addListItem(list) {
      let html = "",
        element;
      element = HTMLStrings.expenseList;

      list.map(
        (item) =>
          (html +=
            '<div class="bottom-border"> <div class="row expense-row"><div class="col-2 expense-date fs-15">' +
            item.date +
            ' </div><div class="col-8 expense-text fs-15"> ' +
            item.desc +
            ` </div><div class="col-2 expense-value fs-15 ${
              item.type === "savings"
                ? "expense-saving"
                : item.type === "expense"
                ? "expense-cost"
                : "expense-investment"
            }"> ₹ ` +
            this.numberFormat(item.val) +
            " </div></div>")
      );

      // Add the new element
      // document.querySelector(element).insertAdjacentHTML('beforeend', html);
      document.querySelector(element).innerHTML = html;

      // Clear the input fields after adding element
      document.querySelector(HTMLStrings.inExpenseValue).value = "";
      document.querySelector(HTMLStrings.inExpenseDescription).value = "";
    },

    updateOverallTotal(totalValue) {
      document.querySelector(HTMLStrings.monthBudget).textContent =
        "₹ " + this.numberFormat(totalValue);

      if (totalValue > 0) {
        if (
          document
            .querySelector(HTMLStrings.monthBudget)
            .classList.contains("expense-cost")
        ) {
          document
            .querySelector(HTMLStrings.monthBudget)
            .classList.remove("expense-cost");
        }
        document
          .querySelector(HTMLStrings.monthBudget)
          .classList.add("expense-saving");
      } else {
        if (
          document
            .querySelector(HTMLStrings.monthBudget)
            .classList.contains("expense-saving")
        ) {
          document
            .querySelector(HTMLStrings.monthBudget)
            .classList.remove("expense-saving");
        }
        document
          .querySelector(HTMLStrings.monthBudget)
          .classList.add("expense-cost");
      }
    },

    displayChart(savings = 0, expenses = 0, investments = 0) {
      let ctx = document.querySelector(HTMLStrings.expenseChart);
      let expenseChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Savings", "Expenses", "Investments"],
          datasets: [
            {
              data: [savings, expenses, investments],
              backgroundColor: [
                "rgba(32, 137, 56, 1)",
                "rgba(255, 84, 98, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 0.5,
            },
          ],
        },
        options: {
          legend: {
            labels: {
              fontColor: "white",
            },
          },
        },
      });
    },
  };
})();

((UIController, ExpenseController) => {
  let HTMLStrings = UIController.getHTMLStrings();
  let setupEventListeners = () => {
    document
      .querySelector(HTMLStrings.btnSubmitExpense)
      .addEventListener("click", addExpense);
    document
      .querySelector(HTMLStrings.typeExpense)
      .addEventListener("click", () => {
        setExpenseType("expense");
      });
    document
      .querySelector(HTMLStrings.typeInvestment)
      .addEventListener("click", () => {
        setExpenseType("investment");
      });
    document
      .querySelector(HTMLStrings.typeSavings)
      .addEventListener("click", () => {
        setExpenseType("savings");
      });
  };

  let setExpenseType = (type) => {
    UIController.setExpenseType(type);
  };

  let addExpense = () => {
    let input = UIController.getUserExpenseInput();
    console.log(input);

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      console.log("Adding item");
      //   UIController.addListItem(input);
      ExpenseController.inputEntry(input);
      UIController.updateOverallTotal(ExpenseController.getTotalData());
      UIController.displayChart(
        ExpenseController.getSavingsData(),
        ExpenseController.getExpensesData(),
        ExpenseController.getInvestmentData()
      );
    }
  };

  let init = () => {
    console.log("Initializing...");
    setupEventListeners();
    UIController.showCurrentMonth();
    UIController.getExp();
  };

  init();
})(UIController, ExpenseController);
