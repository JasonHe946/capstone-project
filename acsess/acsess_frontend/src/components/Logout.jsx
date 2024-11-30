function Logout () {
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // Remove specific cookies
  deleteCookie('token');
  deleteCookie('user_id');
  deleteCookie('role');
}
  
export default Logout;
