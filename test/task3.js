function fetchUserData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) reject("Failed to fetch");
      else resolve({ id, name: "User " + id });
    }, 300);
  });
}


async function fetchUsersWithRetry(ids) {
  const promises = ids.map(async (id) => {
    try {
      return await fetchUserData(id);
    } catch (err) {
      console.log(`Retrying user ${id}...`);

      try {
        return await fetchUserData(id);
      } catch (err2) {
        console.log(`User ${id} failed after retry.`);
        return null; 
      }
    }
  });

  const results = await Promise.all(promises);

  return results.filter((res) => res !== null);
}

const userIDs = [1, 2, 3, 4, 5];
(async () => {
  const result = await fetchUsersWithRetry(userIDs);
  console.log("Final Results:", result);
})();
