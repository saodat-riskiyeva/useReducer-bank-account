import "./styles.css";
import { useReducer, useState } from "react";

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

// =openAccount=, =deposit=, =withdraw=, =requestLoan=, =payLoan=, =closeAccount=
function reducer(state, action) {
  if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    case "openAccount":
      return {
        ...state,
        balance: 500,
        isActive: true,
      };
    case "deposit":
      return {
        ...state,
        balance: state.balance + Number(action.payload),
      };
    case "withdraw":
      return {
        ...state,
        balance: state.balance - Number(action.payload),
      };
    case "requesLoan":
      return {
        ...state,
        balance:
          state.loan === 0
            ? state.balance + Number(action.payload)
            : state.balance,
        loan: state.loan === 0 ? Number(action.payload) : state.loan,
      };
    case "payLoan":
      return {
        ...state,
        balance: state.balance - state.loan,
        loan: 0,
      };
    case "closeAccount":
      return {
        ...state,
        isActive: state.balance === 0 && state.loan === 0 ? false : true,
      };
    default:
      throw new Error("Action is unknown");
  }
}

export default function App() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");
  const [loanAmount, setLoanAmount] = useState("");

  function handleDepositAmount(data) {
    setDeposit(data);
  }

  function handleWithdrawAmount(data) {
    setWithdraw(data);
  }

  function handleLoanAmount(data) {
    setLoanAmount(data);
  }

  function handleDeposit() {
    setDeposit("");
    dispatch({ type: "deposit", payload: deposit });
  }

  function handleWithdraw() {
    setWithdraw("");
    dispatch({ type: "withdraw", payload: withdraw });
  }

  function handleLoan() {
    setLoanAmount("");
    dispatch({ type: "requesLoan", payload: loanAmount });
  }

  function handleAccountClose() {
    dispatch({ type: "closeAccount" });
  }

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => dispatch({ type: "openAccount" })}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      <p>
        <span>
          <input
            type="number"
            value={deposit}
            onChange={(e) => handleDepositAmount(e.target.value)}
          />
        </span>
        <button onClick={() => handleDeposit()} disabled={!isActive}>
          Deposit
        </button>
      </p>
      <p>
        <span>
          <input
            type="number"
            value={withdraw}
            onChange={(e) => handleWithdrawAmount(e.target.value)}
          />
        </span>
        <button onClick={() => handleWithdraw()} disabled={!isActive}>
          Withdraw
        </button>
      </p>
      <p>
        <button onClick={() => handleLoan()} disabled={!isActive}>
          Request a loan of
        </button>
        <span>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => handleLoanAmount(e.target.value)}
          />
        </span>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: "payLoan" })}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button onClick={() => handleAccountClose()} disabled={!isActive}>
          Close account
        </button>
      </p>
    </div>
  );
}
