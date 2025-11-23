function fetchUserData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) reject('Failed to fetch');
      else resolve({ id, name: 'User ' + id });
    }, 300);
  });
}

async function fetchUsersWithRetry(ids) {
  const fetchWithRetry = async (id) => {
    try {
      return await fetchUserData(id); 
    } catch (err) {
      console.log(`Retrying for user ${id}...`);
      try {
        return await fetchUserData(id);
      } catch (err2) {
        console.log(`User ${id} failed after retry`);
        return null; 
      }
    }
  };

  const results = await Promise.all(ids.map(id => fetchWithRetry(id)));

  return results.filter(user => user !== null);
}

fetchUsersWithRetry([1, 2, 3, 4, 5]).then(console.log);
