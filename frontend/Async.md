# Asynchronous JavaScript: Promises and Async/Await

## Synchronous vs. Asynchronous

- **Synchronous:** JavaScript runs code step by step.
- **Asynchronous:** Some operations take time. JavaScript can do other work while waiting.

For example, a Web3 frontend may need to wait for data from a blockchain network.

## What Is a Promise?

A **Promise** represents a result that may become available later.

A Promise has three possible states:

- **Pending:** Still waiting.
- **Fulfilled:** Completed successfully.
- **Rejected:** Failed.

## Creating a Promise

```javascript
const shouldSucceed = true;

// Function that returns a Promise
function fetchData() {
    return new Promise((resolve, reject) => {

        // Simulate an asynchronous operation
        setTimeout(() => {

            if (shouldSucceed) {
                // Success: provide the result
                resolve("Fetched data");
            } else {
                // Failure: provide the error
                reject("Failed to fetch data");
            }

        }, 3000);
    });
}
```

- `resolve(value)`: The operation succeeded. The Promise becomes fulfilled with the given value.
- `reject(error)`: The operation failed. The Promise becomes rejected.
- `return new Promise(...)`: The function returns a Promise object.

**Note:** `resolve()` is not the same as `return`. Calling `resolve()` does not immediately stop the function.

## Using .then() and .catch()

```javascript
fetchData()
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
```

- `.then()` handles a successful result.
- `.catch()` handles an error.

## Promise Chaining

```javascript
const shouldSucceed = true;

// Function that returns a Promise
function fetchData() {
    return new Promise((resolve, reject) => {

        // Simulate async operation
        setTimeout(() => {

            if (shouldSucceed) {
                resolve("Fetched data");
            } else {
                reject("Failed to fetch data");
            }

        }, 3000);
    });
}

// Normal (synchronous) function
function processFetchedData(data) {
    return `${data} - Processed`;
}

// Chain multiple steps
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
        // Handle errors from previous steps
        console.error("Error:", error);
    });
```

When `shouldSucceed = true`, the output after about 3 seconds is:

```text
Fetched data
Fetched data - Processed
```

Each `.then()` can pass a result to the next `.then()`.

## Async/Await

`async/await` is another way to work with Promises. It often makes code easier to read.

**Two important rules:**

1. An `async` function **always returns a Promise**, even if it returns a normal value.
2. If you use `await` inside a function, that function must be declared `async`.

For example:

```javascript
async function getData() {
    return "Hello";
}

getData().then(data => {
    console.log(data); // Hello
});
```

Although `getData()` returns `"Hello"` inside the function, calling `getData()` gives you a Promise.

`await` waits for a Promise's result **inside the async function**, without blocking the entire JavaScript program.

## Example Using Async/Await

This example does the same work as the Promise chaining example.

```javascript
const shouldSucceed = true;

// Same Promise-based function
function fetchData() {
    return new Promise((resolve, reject) => {

        setTimeout(() => {

            if (shouldSucceed) {
                resolve("Fetched data");
            } else {
                reject("Failed to fetch data");
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
        // Wait for the Promise to resolve
        const fetchedData = await fetchData();
        console.log(fetchedData);

        // Continue processing
        const processedData = processFetchedData(fetchedData);
        console.log(processedData);

    } catch (error) {
        // Handle errors (similar to .catch())
        console.error("Error:", error);
    }
}

// Run the async function
fetchDataAndProcess();
```

If `shouldSucceed = false`, `await fetchData()` encounters a rejected Promise and execution moves to `catch`.

## Summary

| Syntax | Meaning |
| --- | --- |
| `Promise` | A result that may arrive later |
| `resolve(value)` | Indicate success and provide a result |
| `reject(error)` | Indicate failure |
| `.then()` | Handle a successful result |
| `.catch()` | Handle an error |
| `async` | Declare a function that returns a Promise |
| `await` | Wait for a result inside an async function |
| `try/catch` | Handle errors in async/await code |

**Note:** JavaScript also allows top-level `await` in ES modules, but this is not needed for the examples above.

## References

- [JavaScript.info: Promise](https://javascript.info/promise-basics)
- [JavaScript.info: Async/await](https://javascript.info/async-await)
