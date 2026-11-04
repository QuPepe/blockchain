# Data Types

## 1. Value Types

Value types hold values directly. Assigning a value-type variable to another variable, or passing it to a function, copies its value; the variables do not share mutable underlying data.

| Type | Description | Example |
|---|---|---|
| `uint8`–`uint256` | Unsigned integers in increments of 8 bits; `uint` is an alias for `uint256`. | `uint x = 42;` |
| `int8`–`int256` | Signed integers in increments of 8 bits; `int` is an alias for `int256`. | `int y = -42;` |
| `bool` | Boolean (`true` or `false`). | `bool isActive = true;` |
| `address` | 20-byte Ethereum address. | `address owner = msg.sender;` |
| `bytes1`–`bytes32` | Fixed-size byte sequences. | `bytes32 hash = keccak256(abi.encode("hello"));` |
| `enum` | User-defined enumeration. | `enum State { Active, Inactive }` |

> **Behavior:** Assignments copy values. Changing one variable does not change another.

---

## 2. Reference Types

Reference types include arrays, structs, mappings, `string`, and dynamically sized `bytes`. Their assignment and parameter-passing behavior depends on the data location and operation.

| Type | Description | Example |
|---|---|---|
| `string` | Dynamically sized UTF-8 text. | `string memory name = "Alice";` (inside a function) |
| `bytes` | Dynamically sized byte sequence. | `bytes memory data = hex"1234";` (inside a function) |
| `array` | Fixed-size or dynamic sequence of elements. | `uint[] numbers;` (state variable) |
| `mapping` | Key-value association; only available in `storage`. | `mapping(address => uint) balances;` (state variable) |
| `struct` | User-defined grouping of fields. | `struct Person { string name; uint age; }` |

> **Note:** Mappings cannot be allocated in `memory` or `calldata`. They can be state variables, storage references, or members of storage-resident structures.

---

## 3. Data Locations (Not Types)

| Location | Typical uses | Description |
|---|---|---|
| `storage` | State variables and local storage references | Persistent contract state, retained across successful transactions. |
| `memory` | Temporary arrays, structs, strings, and bytes | Temporary data during execution. |
| `calldata` | Function inputs, especially external parameters | Read-only input data; cannot be modified in place. |

- Reference-type function parameters and local variables generally require an explicit data location (`storage`, `memory`, or `calldata`), subject to Solidity's restrictions.
- State variables reside in `storage` by default; you do not annotate them with `storage`.
- Value-type variables are copied by value and generally do not have an explicit data-location annotation. Value-type parameters can still be encoded in calldata when supplied to an external function.
- A local `storage` reference must refer to existing storage data; it cannot create independent persistent storage.

> **Key idea:** Data location helps determine whether an operation shares existing data or creates a copy.

---

## 4. Calldata (Read-Only Function Inputs)

`calldata` is a read-only data location commonly used for reference-type function parameters. It is especially useful for external functions because input arrays and strings can be read without first copying them into `memory`.

```solidity
function sum(uint[] calldata numbers)
    external
    pure
    returns (uint)
{
    uint total = 0;

    for (uint i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }

    return total;
}
```

- `numbers` is read-only: `numbers[0] = 999;` would not compile.
- `calldata` is not limited to `external` functions; it can also be used for suitable reference-type parameters in `public` and `internal` functions.
- Copying `calldata` into `memory` or `storage` creates independent data.

> **Calldata:** Read-only input data. Detailed copying rules and gas considerations can be covered in the Functions chapter.

---

## 5. Memory → Memory (Shared References)

When a memory array is assigned to another memory variable, or passed to an internal function expecting a memory array, both references can refer to the same underlying array. This is **not** an independent deep copy.

### Modify an element → affects the caller

```solidity
function foo(uint[] memory arr) internal pure {
    arr[0] = 999;
}

function test1() public pure returns (uint) {
    uint[] memory a = new uint[](1);
    a[0] = 1;

    foo(a);

    return a[0]; // 999
}
```

`foo` modifies the array that `a` also refers to.

### Reassign the parameter → does not reassign the caller's variable

```solidity
function foo2(uint[] memory arr) internal pure {
    arr = new uint[](10);
    arr[0] = 999;
}

function test2() public pure returns (uint) {
    uint[] memory a = new uint[](1);
    a[0] = 1;

    foo2(a);

    return a[0]; // 1
}
```

`foo2` changes only its local parameter `arr` to point to a new array. The caller's `a` still refers to the original array.

> **Memory → Memory:** Existing memory arrays can be shared; modifying an element is different from reassigning a local reference.

---

## 6. Storage → Memory (Independent Copy)

Assigning a storage array to a memory variable creates an independent copy. Changes to the memory copy do not change the original storage array.

```solidity
uint[] public nums;

function setNumber() public {
    nums.push(1);
}

function foo(uint[] memory arr) internal pure {
    arr[0] = 999;
}

function bar() public view returns (uint) {
    require(nums.length > 0, "Call setNumber first");

    uint[] memory copy = nums; // Storage → Memory: copy
    foo(copy);

    return nums[0]; // Still 1 if setNumber was called once
}
```

Call `setNumber()` once, then call `bar()`. The original `nums[0]` stays `1` because `foo` modifies only the memory copy.

> **Storage → Memory:** Independent copy; modifying the memory data does not modify storage.

---

## 7. Storage → Storage (Shared References)

Assigning a storage array to a local storage reference does **not** copy the array. Both names refer to the same persistent data.

```solidity
uint[] public nums;

function setNumber() public {
    nums.push(1);
}

function foo(uint[] storage arr) internal {
    arr[0] = 999;
}

function bar() public {
    require(nums.length > 0, "Call setNumber first");

    uint[] storage ref = nums; // Storage → Storage: reference
    foo(ref);

    // nums[0] is now 999
}
```

Call `setNumber()` once, then `bar()`. Reading `nums(0)` returns `999`.

> **Storage → Storage (local reference):** Shared data; modifications affect the original state variable.

**Important distinction:** Assigning one **state variable** array to another state variable array (e.g., `otherNums = nums;`) copies the array's contents rather than making the two state variables aliases. The shared-reference behavior above concerns **local storage references**.

---

## 8. Memory → Storage (Independent Copy)

Assigning a memory array to a storage state variable copies its contents into persistent storage. Subsequent changes to the memory array do not affect storage.

```solidity
uint[] public nums;

function save() public returns (uint) {
    uint[] memory a = new uint[](1);
    a[0] = 1;

    nums = a; // Memory → Storage: copy

    a[0] = 999;

    return nums[0]; // 1
}
```

The assignment `nums = a` writes the array contents to storage. Changing `a[0]` afterward does not change `nums[0]`.

> **Memory → Storage:** Independent copy into persistent contract state.

---

## 9. Summary

| Operation | Behavior | Does modifying the destination affect the source? |
|---|---|---|
| Value type → Value type | Value copied | No |
| Memory → Memory (assignment / internal parameter) | Shared underlying data | Yes, for mutations to shared data |
| Storage → Memory | Independent copy | No |
| Storage → Storage (local reference) | Shared underlying data | Yes |
| Memory → Storage | Independent copy | No |
| Storage state variable → Storage state variable | Contents copied | No |
| Calldata → Memory / Storage | Independent copy | No |

**Remember:**

- **Value types** are copied by value.
- **Reference types** may share underlying data or be copied, depending on the data locations and assignment context.
- **Mutating data** through a shared reference differs from **reassigning the reference** itself.
- **`calldata`** is read-only and is commonly used for external function parameters; copying calldata data into memory or storage creates independent data.
