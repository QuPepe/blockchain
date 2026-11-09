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
| `string` | Dynamically sized UTF-8 text. | `string memory name = "Alice";` |
| `bytes` | Dynamically sized byte sequence. | `bytes memory data = hex"1234";` |
| `array` | Fixed-size or dynamic sequence of elements. | `uint[] numbers;` |
| `mapping` | Key-value association; only available in `storage`. | `mapping(address => uint) balances;` |
| `struct` | User-defined grouping of fields. | `struct Person { string name; uint age; }` |

> **Note:** Mappings cannot be allocated in `memory` or `calldata`. They can be state variables, storage references, or members of storage-resident structures.

---

## 3. Data Locations (Not Types)

| Location | Typical uses | Description |
|---|---|---|
| `storage` | State variables and local storage references | Persistent contract state, retained across successful transactions. |
| `memory` | Temporary arrays, structs, strings, and bytes | Temporary data during execution. |
| `calldata` | Function inputs, especially external parameters | Read-only input data; cannot be modified in place. |

- Function parameters and local variables **of reference types** generally require an explicit data location (`storage`, `memory`, or `calldata`), subject to Solidity's restrictions. **Value types do not use explicit data-location specifiers.**
- State variables reside in `storage` by default; you do not annotate them with `storage`.
- In external function calls, both value-type and reference-type arguments are passed through EVM calldata. However, only reference types can use the explicit `calldata` keyword in Solidity.
- A local `storage` reference must refer to existing storage data; it cannot create independent persistent storage.

> **Key idea:** Data location helps determine whether an operation shares existing data or creates a copy.

---

## 4. Memory → Memory (Shared References)

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

## 5. Storage → Memory (Independent Copy)

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

## 6. Storage → Storage (Shared References)

Assigning a storage array to a local storage reference does **not** copy the array. Both names refer to the same persistent data.

```solidity
uint[] public nums;

function setNumber() public {
    nums.push(1);
}

function foo(uint[] storage arr) internal {
    arr[0] = 999;
}

function bar() public returns (uint) {
    require(nums.length > 0, "Call setNumber first");

    uint[] storage ref = nums; // Storage → Storage: reference
    foo(ref);

    return nums[0]; // Returns 999
}
```

Call `setNumber()` once, then `bar()`. Reading `nums(0)` returns `999`.

> **Storage → Storage (local reference):** Shared data; modifications affect the original state variable.

**Important:** Assigning one state variable array to another (e.g., `otherNums = nums;`) creates an independent copy. However, assigning a state variable array to a local storage reference (e.g., `uint[] storage ref = nums;`) does not copy the array. Both names refer to the same data in storage.

---

## 7. Memory → Storage (Independent Copy)

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

## 8. Calldata (Read-Only Function Inputs)

`calldata` is a read-only EVM data area containing the encoded arguments of an external call. Both **value types** (such as `uint`, `bool`, and `address`) and **reference types** (such as arrays and strings) can be passed through calldata. However, Solidity allows an explicit `calldata` data-location specifier only for reference-type variables.

For reference-type parameters, `calldata` is especially useful because input arrays and strings can be read without first copying them into `memory`.

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

- `numbers` is a reference type, so `calldata` can be explicitly specified. It is read-only: `numbers[0] = 999;` would not compile.
- `calldata` is not limited to `external` functions; it can also be used for suitable reference-type parameters in `public` and `internal` functions.
- Copying `calldata` into `memory` or `storage` creates independent data.

### Calldata → Calldata (Shared Read-Only Data)

Passing a `calldata` array to an internal function that also accepts `calldata` does not create an independent memory copy. Both parameters access the same read-only input data.

```solidity
function first(uint[] calldata arr) internal pure returns (uint) {
    return arr[0];
}

function readFirst(uint[] calldata numbers) external pure returns (uint) {
    require(numbers.length > 0, "Empty array");
    return first(numbers); // No memory copy is needed
}
```

Neither function can modify the elements of its `calldata` array.

### Value-type arguments also arrive through calldata

```solidity
function increment(uint256 x) external pure returns (uint256) {
    x = x + 1;
    return x;
}
```

- `uint256` is a value type. In an external call, its argument is encoded in EVM calldata.
- Do **not** write `uint256 calldata x`: explicit data-location annotations are not allowed for value types.
- Reassigning `x` inside the function is allowed because `x` is a local value-type parameter; this does **not** modify the original calldata.

> **Distinction:** **EVM calldata** is the read-only input data area used by external calls and can contain both value-type and reference-type arguments. The Solidity **`calldata` keyword** is a data-location specifier for reference-type variables only.

> **Calldata:** Read-only input data. Detailed copying rules and gas considerations can be covered in the Functions chapter.

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
| Calldata → Calldata (internal parameter) | Shared read-only input data | Mutation not allowed |
| Calldata → Memory | Independent copy | No |
| Calldata → Storage | Independent copy | No |

**Remember:**

- **Value types** are copied by value.
- **Reference types** may share underlying data or be copied, depending on the data locations and assignment context.
- **Mutating data** through a shared reference differs from **reassigning the reference** itself.
- **EVM calldata** can contain both value-type and reference-type arguments, but the explicit **`calldata` keyword** applies only to reference types.
- **`calldata` references** are read-only. Passing them to another `calldata` parameter can share input data; copying them into `memory` or `storage` creates independent data.
