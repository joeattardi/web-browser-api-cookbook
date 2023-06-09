/**
 * Queries the database and gets a list of contacts whose name or email
 * matches a search query.
 * @param db the IndexedDB database
 * @param query the search query string
 * @returns a Promise that resolves to the matching contacts
 */
function searchContacts(db, query) {
  return new Promise((resolve, reject) => {
    // An array to hold all contacts with a name containing the query text.
    const results = [];

    // Only querying, so use a readonly transaction.
    const transaction = db.transaction(['contacts'], 'readonly');
    const store = transaction.objectStore('contacts');

    // Cursors are created by the object store
    const request = store.openCursor();

    // The cursor request will emit a `success` event for each object it finds
    request.addEventListener('success', event => {
      const cursor = event.target.result;
      if (cursor) {
        // Add the contact to the result array if the name or email
        // contains the query string.
        if (cursor.value.name.toLowerCase().includes(query.toLowerCase()) || 
            cursor.value.email.toLowerCase().includes(query.toLowerCase())) {
          results.push(cursor.value);
        }

        // Continue to the next record if you want to keep searching.
        // If you want to stop searching before all records are processed,
        // just omit the call to +continue+.
        cursor.continue();
      } else {
        // When you reach here, all records have been processed, so the search
        // is complete. Resolve the promise with the results array.
        resolve(results);
      }
    });
  });
}
