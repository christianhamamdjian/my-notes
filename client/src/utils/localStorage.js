export const addUserToLocalStorage = (user, token, location) => {
  localStorage.setItem('user', JSON.stringify(user))
  localStorage.setItem('token', JSON.stringify(token))
  localStorage.setItem('location', JSON.stringify(location))
}

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('location')
}

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem('user');
  const user = result ? JSON.parse(result) : null;
  return user;
};

export const getTokenFromLocalStorage = () => {
  const result = localStorage.getItem('token');
  const token = result ? JSON.parse(result) : null;
  return token;
};

export const getUserLocationFromLocalStorage = () => {
  const result = localStorage.getItem('location');
  const location = result ? JSON.parse(result) : null;
  return location;
};

