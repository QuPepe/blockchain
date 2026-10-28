# Solidity Basics

## 1. Overview

This section introduces the core components of Solidity programming:

- Solidity vs. EVM
- Data types
- Functions
- Constructors
- Visibility specifiers
- Mutability specifiers
- Events

---

## 2. Solidity and EVM

Solidity is a **high-level language**.

It is compiled into:

→ **Ethereum virtual machine (EVM) bytecode**

Flow:

Solidity code → Compiler → EVM bytecode → Execution on blockchain

Key idea:

> Smart contracts are programs executed by the EVM.

---

## 3. Data Types

Solidity is:

- **Statically typed**
- Similar to **Java / C / C++ / Rust**
- Unlike **Python / JavaScript**

### Basic Types

- `uint` → unsigned 256-bit integer
- `int` → signed 256-bit integer

---

## 4. Function Structure

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

**Note:** Square brackets `[]` indicate optional components; curly braces `{}` around alternatives indicate a required choice; and `|` indicates alternatives.

**Example:**

```solidity
function double(uint256 x) public pure returns (uint256) {
    return x * 2;
}
```

---

## 5. Constructor

A constructor is:

> Executed only once when the contract is deployed

> Used to initialize the contract’s state (state variables)

Example:

```solidity
constructor(address initialOwner) {
    owner = initialOwner;
}
```

---

## 6. Visibility Specifiers

### For Functions

- `public` → Callable from anywhere (internally and externally).
- `private` → Callable only within the defining contract.
- `internal` → Callable within the defining contract and derived contracts.
- `external` → Callable from outside the contract.

### For State Variables

- `public` → Accessible internally and externally (via an auto-generated getter).
- `private` → Accessible only within the defining contract.
- `internal` → Accessible within the defining contract and derived contracts.

### Important Notes

1. Functions support all four visibility specifiers.
2. State variables support only `public`, `private`, and `internal`.
3. The default visibility for state variables is `internal`.
4. Visibility restrictions do not make blockchain data confidential. Even `private` state variables can be inspected through blockchain data.

---

## 7. Mutability Specifiers

Mutability describes whether a function may access or change state, or whether a state variable can be reassigned.

### For Functions

- **No mutability specifier (nonpayable)** → May read and modify state, but cannot receive ETH with the call.
- `view` → May read state but cannot modify it.
- `pure` → Cannot read or modify contract state; also cannot access most execution-context information (e.g., `msg.sender` or `block.timestamp`).
- `payable` → May receive ETH with the call and may read and modify state.

**Note:** `public` is a *visibility* specifier, not a mutability specifier. A function without `pure`, `view`, or `payable` is nonpayable by default.

**Example:**

```solidity
uint256 public balance;

function setBalance(uint256 x) public {
    balance = x;
}

function getBalance() public view returns (uint256) {
    return balance;
}

function double(uint256 x) public pure returns (uint256) {
    return x * 2;
}

function deposit() public payable {
    balance += msg.value;
}
```

### For State Variables

- `constant` → Must be initialized at declaration; its value cannot change.
- `immutable` → Can be assigned at declaration or during construction; cannot change afterward.
- **Neither** → Mutable; can be reassigned after deployment.

**Example:**

```solidity
uint256 public constant MAX_SUPPLY = 1000;
address public immutable owner;
uint256 public balance;

constructor() {
    owner = msg.sender;
}
```

**Important notes:**

1. `constant` and `immutable` are not visibility specifiers.
2. `constant` values must be compile-time constants; `immutable` values may be determined during deployment.
3. `constant` and `immutable` apply to state variables, not local variables.
4. A `private` or `internal` state variable is not confidential: its on-chain data may still be inspected.

---

## 8. Mapping

Mapping is:

> A key-value storage (like a hash table)

Example:

```solidity
mapping(address => uint256) balances;
```

Key properties:

- Every key in a mapping always returns a value. If a key has never been assigned, it automatically returns the default value of its type (e.g., 0 for uint256, false for bool).
- No built-in way to:
  - get length
  - iterate over keys

👉 You must track keys manually

---

## 9. Events

Two ways to observe contract state:

1. View functions (read state)
2. Event logs (listen to activity)

### Event Example (Domain Name Registration)

```solidity
event Registered(address owner, string domain);

function register(string memory domain) public {
    emit Registered(msg.sender, domain);
}
```

Key idea:

> Events are used for off-chain applications (frontend, indexing, etc.)

---

## 10. Key Takeaways

- Solidity is compiled → EVM bytecode
- It is statically typed
- Functions have visibility and state mutability specifiers
- State variables have visibility and may be declared `constant` or `immutable`
- Constructor runs only once
- Mapping is NOT iterable
- Events are critical for off-chain interaction
