# Data Types

## 1. Value Types

Value types store data directly and are always copied.

| Type         | Description                                 | Example                            |
|--------------|---------------------------------------------|------------------------------------|
| `uint`       | Unsigned integer, from 8 bits to 256 bits, in steps of 8 (default: uint256)         | `uint x = 42;`                     |
| `int`        | Signed integer, from 8 bits to 256 bits, in steps of 8 (default: int256)            | `int y = -42;`                     |
| `bool`       | Boolean value (`true` or `false`)           | `bool isActive = true;`           |
| `address`    | Ethereum address                            | `address owner = msg.sender;`     |
| `bytes1`–`bytes32` | Fixed-size byte arrays               | `bytes32 hash = keccak256(...);`  |
| `enum`       | User-defined enumeration                    | `enum State { Active, Inactive }` |
| `byte`       | Deprecated alias for `bytes1` (removed in newer Solidity versions) |                                    |

👉 Behavior:
- Always copied
- No shared underlying data

---

## 2. Reference Types

Reference types store data indirectly and refer to a data location (`storage`, `memory`, or `calldata`).

| Type         | Description                                 | Example                            |
|--------------|---------------------------------------------|------------------------------------|
| `string`     | Dynamic UTF-8 encoded text                  | `string name = "Alice";`          |
| `bytes`      | Dynamic byte array                          | `bytes data = hex"1234";`         |
| `array`      | Fixed-size or dynamic list of elements      | `uint[] numbers;`                 |
| `mapping`    | Key-value store                             | `mapping(address => uint) balances;` |
| `struct`     | Group of related variables                  | `struct Person { string name; uint age; }` |

> Behavior depends on data location and context.

---

## 3. Data Locations (Not Types)

| Location  | Applies To                          | Description                                     |
|-----------|--------------------------------------|-------------------------------------------------|
| `storage` | State variables, local references    | Persistent, written to blockchain               |
| `memory`  | Function parameters & local variables| Temporary, exists during function execution     |
| `calldata`| External function inputs             | Read-only, non-modifiable input data            |

> Location = where data lives

> Data location applies only to reference types

---

## 4. Reference Types: Memory → Memory (Shallow Copy: Reference is Copied)

When a memory reference type is passed to another function, the reference is copied.
This means the caller and callee may initially point to the same underlying memory data.

### Modify element → affects caller

```solidity
function foo(uint[] memory arr) internal {
    arr[0] = 999;
}

function test1() public pure returns (uint) {
    uint[] memory a = new uint[](1);
    a[0] = 1;

    foo(a);

    return a[0]; // 999
}
```

👉 `arr[0] = 999` modifies the shared underlying memory data.

### Reassign → does NOT affect caller

```solidity
function foo2(uint[] memory arr) internal {
    arr = new uint[](10);
}

function test2() public pure returns (uint) {
    uint[] memory a = new uint[](1);
    a[0] = 1;

    foo2(a);

    return a[0]; // still 1
}
```

👉 `arr = new uint[](10)` only changes where `arr` points.
👉 The caller’s variable `a` still points to the original memory data.

> Memory → Memory: the reference is copied.

> Modifying shared data may affect the caller, but reassigning the reference does not.

---

## 5. Reference Types: Storage → Memory (Deep Copy: Independent Data)

```solidity
uint[] public nums;

function foo(uint[] memory arr) internal {
    arr[0] = 999;
}

function bar() public {
    nums.push(1);
    foo(nums); // nums[0] is still 1
}
```

👉 nums will NOT change

---

## Summary

> Value types are always copied.

> Reference types may share or copy data depending on location.
