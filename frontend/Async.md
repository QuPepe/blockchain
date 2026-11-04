# Asynchronous Operations in JavaScript

## What Are Asynchronous Operations?

An asynchronous operation can start now and finish later without blocking other JavaScript tasks while it is waiting.

- **Synchronous:** finish the current operation before continuing.
- **Asynchronous:** start an operation, continue with other work, and handle its result later.

For example, a Web3 frontend may wait for an RPC response without freezing the user interface.

---

## What Is a Promise in JavaScript?

A **Promise** is an object representing the eventual completion or failure of an operation and its resulting value (or rejection reason).

A Promise can be returned immediately even when its result is not available yet.

## States of a Promise

A Promise has one of three states:

- **Pending:** not yet fulfilled or rejected.
- **Fulfilled:** completed successfully, with a fulfillment value.
- **Rejected:** failed, with a rejection reason.

A Promise is **settled** when it is fulfilled or rejected. Once settled, its state cannot change.

---

## Creating a Promise

```javascript
// Create a Promise object
const myPromise = new Promise((resolve, reject) => {
    // Simulate an asynchronous operation
    setTimeout(() => {
        const success = true; // Change to false to test failure

        if (success) {
            resolve("Operation succeeded!");
        } else {
            reject(new Error("Operation failed!"));
        }
    }, 3000);
});
```

- `resolve(value)` fulfills this Promise with `value` (if `value` is another Promise or thenable, its eventual outcome is adopted).
- `reject(reason)` rejects this Promise with `reason`. Using an `Error` object is recommended.
- **Unlike `return`, calling `resolve()` or `reject()` does not immediately stop the current function.**

The Promise constructor returns the Promise object immediately; the `setTimeout` callback runs later.

## Consuming a Promise

```javascript
myPromise
    .then(result => {
        // Runs when the Promise is fulfilled
        console.log(result);
    })
    .catch(error => {
        // Runs if the Promise chain is rejected
        console.error("Error:", error.message);
    });
```

- `.then()` handles fulfillment and returns a **new Promise**.
- `.catch()` handles rejection and also returns a **new Promise**.

---

## Promise Chaining

```javascript
const shouldSucceed = true;

// Function that returns a Promise
function fetchData() {
    return new Promise((resolve, reject) => {
        // Simulate an asynchronous operation
        setTimeout(() => {
            if (shouldSucceed) {
                resolve("Fetched data");
            } else {
                reject(new Error("Failed to fetch data"));
            }
        }, 3000);
    });
}

// Normal (synchronous) function
function processFetchedData(data) {
    return `${data} - Processed`;
}

// Chain multiple processing steps
fetchData()
    .then(fetchedData => {
        // Step 1: Handle fetched data
        console.log(fetchedData);

        // Pass the returned value to the next .then()
        return processFetchedData(fetchedData);
    })
    .then(processedData => {
        // Step 2: Receive processed data
        console.log(processedData);
    })
    .catch(error => {
        // Handle rejection or errors thrown in previous steps
        console.error("Error:", error.message);
    });
```

**Key points:**

1. `fetchData()` immediately returns a Promise.
2. `resolve("Fetched data")` fulfills that Promise after approximately three seconds.
3. The first `.then()` receives `"Fetched data"`.
4. `processFetchedData()` returns a regular string, which becomes the fulfillment value of the Promise returned by that `.then()`.
5. The next `.then()` receives the processed string.
6. A rejection or thrown error in an earlier step is passed to the final `.catch()`, unless an earlier handler has already handled it.

**Important:** Promise chaining does not mean that every callback must return a Promise. A `.then()` callback can return a regular value or a Promise, but `.then()` itself always returns a new Promise.

---

## Why Async/Await?

Long `.then()` chains can become harder to read. `async/await` provides a more sequential-looking way to work with Promises.

It does **not** make an asynchronous operation synchronous or block the entire JavaScript thread while waiting.

## Key Rules for Async/Await

1. **An `async` function always returns a Promise**, even if it returns a regular value or does not use `await`.
2. **`await` is normally used inside an `async` function.** Top-level `await` is also allowed in JavaScript ES modules.
3. **An `async` function does not have to contain `await`.**
4. **`await` pauses the execution of the surrounding async function**, not the entire JavaScript thread.
5. When the awaited Promise fulfills, `await` evaluates to its fulfillment value. When it rejects, `await` throws the rejection reason.
6. `await` can also accept a non-Promise value; JavaScript treats it as an already fulfilled value, but the async function still resumes asynchronously.

### Example: An Async Function Always Returns a Promise

```javascript
async function getData() {
    return "Hello";
}

const result = getData();
console.log(result); // A Promise, not the string "Hello"

result.then(data => {
    console.log(data); // Hello
});
```

Conceptually, this behaves like:

```javascript
function getData() {
    return Promise.resolve("Hello");
}
```

Even without a `return` statement, an async function returns a Promise fulfilled with `undefined` (unless it throws an error).

### Example: Await Requires an Async Function

```javascript
// Correct
async function showData() {
    const data = await getData();
    console.log(data);
}

showData();
```

This is **not** valid inside an ordinary function:

```javascript
// Incorrect: SyntaxError
function showData() {
    const data = await getData();
    console.log(data);
}
```

**Exception:** Top-level `await` is valid in an ES module:

```javascript
// In an ES module (e.g., a .mjs file)
const data = await getData();
console.log(data);
```

---

## Async/Await

The following example performs the same work as the **Promise Chaining** example above.

```javascript
const shouldSucceed = true;

// Same Promise-based function
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldSucceed) {
                resolve("Fetched data");
            } else {
                reject(new Error("Failed to fetch data"));
            }
        }, 3000);
    });
}

// Synchronous processing function
function processFetchedData(data) {
    return `${data} - Processed`;
}

// An async function always returns a Promise
async function fetchDataAndProcess() {
    try {
        // Pause this async function until the Promise settles
        const fetchedData = await fetchData();
        console.log(fetchedData);

        // Continue processing after await
        const processedData = processFetchedData(fetchedData);
        console.log(processedData);

        return processedData;
    } catch (error) {
        // Handle a rejected Promise or a thrown error
        console.error("Error:", error.message);
        throw error; // Propagate the failure to the caller
    }
}

// Run the async function and handle its returned Promise
fetchDataAndProcess().catch(error => {
    console.error("Operation failed:", error.message);
});
```

With `shouldSucceed = true`, the console shows (after approximately three seconds):

```text
Fetched data
Fetched data - Processed
```

With `shouldSucceed = false`, the Promise rejects and control jumps to `catch`. In this example, the error is rethrown so the caller's `.catch()` can also handle it. **If a `catch` block handles an error without rethrowing it, the async function normally returns a fulfilled Promise instead.**

### Does `await` Block JavaScript?

No. Code before the first `await` begins executing synchronously when the async function is called. While the async function is suspended at `await`, other JavaScript tasks can continue.

```javascript
async function example() {
    console.log("A");
    await Promise.resolve();
    console.log("C");
}

example();
console.log("B");

// Output:
// A
// B
// C
```

---

## Summary

| Concept | Meaning |
| --- | --- |
| `Promise` | Object representing an eventual result |
| `pending` | Promise has not settled |
| `fulfilled` | Promise completed successfully |
| `rejected` | Promise failed |
| `resolve(value)` | Resolve a Promise with a value or adopt another Promise's outcome |
| `reject(reason)` | Reject a Promise |
| `.then()` | Handle fulfillment and return a new Promise |
| `.catch()` | Handle rejection and return a new Promise |
| `async` | Declare an async function that always returns a Promise |
| `await` | Suspend the surrounding async function until a value/Promise is resolved |
| `try/catch` | Handle errors with familiar control-flow syntax |

**Remember:** `async/await` is syntax for working with Promises, not a separate asynchronous mechanism.

---

## References

- [JavaScript.info: Promise](https://javascript.info/promise-basics)
- [JavaScript.info: Async/await](https://javascript.info/async-await)
- [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
