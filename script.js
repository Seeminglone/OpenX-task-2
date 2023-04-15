let btn = document.querySelector('button');
btn.addEventListener("click", () => {
   fetch('https://fakestoreapi.com/users')
  .then(response => response.json())
  .then(users => {
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then(products => {
        fetch('https://fakestoreapi.com/carts/?startdate=2000-01-01&enddate=2023-04-07')
          .then(response => response.json())
          .then(carts => {
            const usersWithCarts = users.map(user => ({
              ...user,
              cart: carts.find(cart => cart.userId === user.id)
            }));

            // 1. Create data structure with total value of each category
            const categories = {};
            products.forEach(product => {
              if (!categories[product.category]) {
                categories[product.category] = 0;
              }
              categories[product.category] += product.price;
            });
            console.log(categories);

            // 2. Find cart with highest value and owner's full name
            let highestValue = 0;
            let highestCart = null;
            let ownerFullName = '';
            usersWithCarts.forEach(user => {
              const cart = user.cart;
              if (cart) {
                const cartValue = cart.products.reduce((total, product) => total + product.quantity, 0);
                if (cartValue > highestValue) {
                  highestValue = cartValue;
                  highestCart = cart;
                  ownerFullName = user.name.firstname + ' ' + user.name.lastname;
                }
              }
            });
            console.log('Highest value cart:', highestCart, 'Owner full name:', ownerFullName);

            // 3. Find the two users living furthest away from each other
            let furthestDistance = 0;
            let furthestUsers = null;
            usersWithCarts.forEach(user1 => {
              usersWithCarts.forEach(user2 => {
                if (user1.address && user2.address) {
                  const distance = getDistance(user1.address.geolocation.lat, user1.address.geolocation.long, user2.address.geolocation.lat, user2.address.geolocation.long);
                  if (distance > furthestDistance) {
                    furthestDistance = distance;
                    furthestUsers = [user1, user2];
                  }
                }
              });
            });
            console.log('Furthest users:', furthestUsers);
          });
      });
  });

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
})

