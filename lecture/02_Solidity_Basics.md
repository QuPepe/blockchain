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

→ **Ethereum Virtual Machine (EVM) bytecode**

Flow:

Solidity code → Compiler → EVM bytecode → Execution on blockchain

Key idea:

> Smart contracts are programs executed by the EVM.

---

## 3. Data Types

Solidity is:

- **Statically typed**
- Similar to **Java / C / Rust**
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
- **State mutability specifier:** `pure`, `view`, `payable`, or none
- **Inheritance specifiers (optional):** `virtual`, `override`
- **Function modifiers (optional):** e.g., `onlyOwner`
- **Return types (optional)**
- **Function body**

**Syntax:**

```solidity
function FunctionName([parameters])
    [visibility]
    [state mutability]
    [virtual] [override]
    [modifiers]
    [returns (return types)]
{
    // Function body
}
```

**Example:**

```solidity
function double(uint x) public pure returns (uint) {
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

- `public` → anyone can call
- `internal` → only inside contract

### For Variables

- `public` → auto-generated getter
- `private` → no getter

⚠️ Important:

> "private" does NOT mean secret
> Data is still visible on-chain

---

## 7. Mutability Specifiers

Define whether a function can read or modify contract state.

> **State = contract storage (state variables)**
> It does **not** include execution context (e.g., `msg`, `block`).

### `public`
- Can read and modify state

### `view`
- Cannot modify state
- Can read state

### `pure`
- Cannot read or modify state
- Cannot access execution context (`msg`, `block`)
- Pure computation only

### Example

```solidity
function f1() public { ... } // read & write state
function f2() public view { ... } // read state only
function f3() public pure { ... } // no state or context access
```

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
- Functions have visibility & mutability
- Constructor runs only once
- Mapping is NOT iterable
- Events are critical for off-chain interaction
