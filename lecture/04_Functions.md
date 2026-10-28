# Functions

## Introduction

Solidity uses **specifiers** and **keywords** to describe how functions and state variables can be accessed, how functions interact with contract state, and how functions participate in inheritance. Separately, Solidity supports **custom function modifiers**, which wrap reusable checks or behavior around function execution.

---

## 1. General function structure

A Solidity function includes:

- **Name**
- **Parameters**
- **Visibility specifier:** `public`, `private`, `internal`, `external`
- **State mutability specifier (optional):** `pure`, `view`, `payable`
- **Inheritance-related keywords (optional):** `virtual`, `override`
- **Custom function modifiers (optional):** e.g., `onlyOwner`
- **Return types (optional)**
- **Function body**

**Syntax:**

```solidity
function FunctionName([parameters])
    {public | private | internal | external}
    [pure | view | payable]
    [virtual] [override]
    [custom modifiers]
    [returns (return types)]
{
    // Function body
}
```

**Note:** This is a simplified teaching template, not executable Solidity code. Square brackets `[]` indicate optional components; curly braces `{}` around alternatives indicate a required choice; and `|` indicates alternatives. Visibility is required for ordinary named functions. The curly braces around the function body are actual Solidity syntax.

**Example:**

```solidity
function double(uint256 x) public pure returns (uint256) {
    return x * 2;
}
```

---

## 2. Visibility specifiers

Visibility determines **where** a function or state variable can be accessed.

| Specifier | Applies to | Description |
|---|---|---|
| `public` | Functions, state variables | Functions can be called internally and externally. Public state variables have automatically generated getter functions. |
| `external` | Functions | Functions are called through external calls (including `this.f()`); they cannot be called internally simply as `f()`. |
| `internal` | Functions, state variables | Accessible within the contract and its derived contracts. |
| `private` | Functions, state variables | Accessible within the declaring contract, but not directly in derived contracts. |

**Notes:**

- State variables can be `public`, `internal`, or `private`, but **not** `external`.
- If visibility is omitted for a state variable, the default is `internal`. Functions must specify visibility explicitly.
- `private` and `internal` restrict access in Solidity code; they **do not make on-chain data confidential**.

**Example:**

```solidity
contract VisibilityExample {
    uint256 public count;
    uint256 private secretNumber;

    function increment() public {
        count += 1;
    }

    function readSecret() internal view returns (uint256) {
        return secretNumber;
    }
}
```

---

## 3. State mutability specifiers

State mutability describes whether a function may read or modify contract state, or receive Ether.

| Specifier | Applies to | Description |
|---|---|---|
| `view` | Functions | Cannot modify state, but may read state. |
| `pure` | Functions | Cannot read or modify contract state. |
| `payable` | Functions | May receive Ether along with a call. |
| *(none)* | Functions | May read and modify state; does **not** mean the function can receive Ether. |

**Notes:**

- `view`, `pure`, and `payable` are mutually exclusive function state mutability choices.
- A non-`payable` function cannot receive Ether as part of its call (apart from special cases where Ether is transferred without executing the function).
- A `view` function called off-chain typically does not require a transaction or gas payment, but calling it within an on-chain transaction still consumes gas.

**Example:**

```solidity
contract MutabilityExample {
    uint256 public price = 100;

    function getPrice() public view returns (uint256) {
        return price;
    }

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }

    function updatePrice(uint256 newPrice) public {
        price = newPrice;
    }

    function deposit() external payable {
        // Ether sent with this call is received by the contract.
    }
}
```

---

## 4. Inheritance-related keywords

These keywords control whether a function may be overridden in a derived contract and whether a declaration overrides a base declaration.

| Keyword | Applies to | Description |
|---|---|---|
| `virtual` | Functions (and certain other declarations) | Allows a derived contract to override the declaration. |
| `override` | Overriding functions (and certain other declarations) | Marks a declaration that overrides an inherited declaration. |
| `abstract` | Contracts | Declares an abstract contract, which cannot be deployed directly. |

**Notes:**

- A base function generally needs `virtual` before a derived contract can override it.
- An overriding function uses `override`; add `virtual` too if further derived contracts should be able to override it.
- `abstract` is a **contract-level keyword**, not a function specifier. Abstract contracts may contain unimplemented functions, but an abstract contract does not necessarily have to contain one.

**Example:**

```solidity
abstract contract Base {
    function getValue() public pure virtual returns (uint256) {
        return 1;
    }
}

contract Derived is Base {
    function getValue() public pure override returns (uint256) {
        return 2;
    }
}
```

---

## 5. Custom function modifiers

A **function modifier** is a reusable block of code declared with the `modifier` keyword. It can check conditions and execute code before or after a function body runs. Modifiers are commonly used for access control and reentrancy protection.

### 5.1 Basic example: `onlyOwner`

```solidity
contract OwnedVault {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function restrictedAction() public onlyOwner {
        // Only the contract owner can execute this function.
    }
}
```

This example demonstrates access control only; it does not transfer Ether. When `restrictedAction()` is called, Solidity checks the condition in `onlyOwner`. If it is true, execution reaches `_` and the function body runs. If it is false, the call reverts.

### 5.2 What does `_` mean?

The `_;` statement marks the point where the modified function body executes.

```solidity
modifier example() {
    // Runs before the function body.
    _;
    // Runs after the function body, if execution reaches here.
}
```

A modifier can therefore run code **before and after** the function body. If execution reverts, the transaction's state changes are rolled back.

### 5.3 Custom errors: a gas-efficient alternative

Using a custom error often costs less gas than reverting with a string message.

```solidity
error NotOwner();

modifier onlyOwner() {
    if (msg.sender != owner) revert NotOwner();
    _;
}
```

### 5.4 Example: transfer ownership

The following function uses the previously defined `owner` variable and `onlyOwner` modifier.

```solidity
function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0), "Invalid address");
    owner = newOwner;
}
```

**Security note:** Access-control modifiers should be tested carefully. A modifier is not automatically secure just because it is reusable.

---

## 6. Summary

| Category | Common syntax | Purpose |
|---|---|---|
| Visibility specifiers | `public`, `external`, `internal`, `private` | Control accessibility. |
| State mutability specifiers | `view`, `pure`, `payable` | Describe state access or Ether reception. |
| Inheritance-related keywords | `virtual`, `override` | Control overriding in inheritance. |
| Contract-level keyword | `abstract` | Declare an abstract contract. |
| Custom function modifiers | `onlyOwner`, `nonReentrant` | Apply reusable execution checks or behavior. |

**Takeaway:** Specifiers and keywords describe declaration properties and inheritance behavior; custom function modifiers add reusable logic to function execution. Avoid calling all these constructs simply “modifiers.”

## References

- Solidity documentation — [Contracts: Visibility](https://docs.soliditylang.org/en/latest/contracts.html#visibility-and-getters)
- Solidity documentation — [Contracts: State mutability](https://docs.soliditylang.org/en/latest/contracts.html#state-mutability)
- Solidity documentation — [Contracts: Function modifiers](https://docs.soliditylang.org/en/latest/contracts.html#function-modifiers)
- Solidity documentation — [Contracts: Function overriding](https://docs.soliditylang.org/en/latest/contracts.html#function-overriding)
