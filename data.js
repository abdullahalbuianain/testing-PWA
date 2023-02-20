

var webstore = new Vue({
    el: '#app',
    data: {
        sitename: 'Lesson Booking',
        lessons: lesson,
        cart: [],
        order: {
            firstName: '',
            number: '',
        },
        showlessons: true,
    },

    created: function() {

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("service-workerData.js");
        }

    /*     fetch("http://localhost:2500/collections/lessons").then(
            function(response) {
                response.json().then(
                    function(json) {
                        webstore.lessons = json;
                    }
                )
            }
        ) */
    },




    computed: {

        canAddToCart: function() {
            return function(lesson) {
            return lesson.spaces > 0;
        }
  }



},

        
methods: {



        addToCart: function(lesson) {
            if(lesson.spaces > 0) {
                lesson.spaces--;
                this.cart.push(lesson);
            }
        },

        removeFromCart: function(lesson) {
            var index = this.cart.indexOf(lesson);
            this.cart.splice(index, 1);
            
        },

        showCheckout: function() {
            this.showlessons = !this.showlessons;
        },

         submitForm: function() {
            let data = {
              name: this.order.firstName,
              phone: this.order.number,
              lessons: this.cart.map(item => ({
                id: item.id,
                spaces: item.spaces
              }))
            };
          
            fetch("http://localhost:2500/collections/orders", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
            .then(res => {
              if (!res.ok) {
                throw new Error('Failed to create order');
              }
              return res.json();
            })
            .then(() => {
              alert("Thank you " + this.order.firstName + " for your order of " + this.cart.length + " lessons!");
              this.order.firstName = '';
              this.order.number = '';
              this.cart = [];
              this.showlessons = true;
            })
            .catch(err => {
              console.error(err);
              alert('Failed to create order. Please try again later.');
            });
          },
          
          updateLesson(data) {
            fetch(`http://localhost:2500/collections/lessons`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(responseData => {
                console.log(responseData);
            })
            .catch(error => {
                console.log(error);
            });
        },
        
          
          

    sortLessons: function(location) {
        this.lessons.sort(function(a, b) {
            let propA, propB;
            if (location === 'price') {
                propA = parseFloat(a[location].slice(1));
                propB = parseFloat(b[location].slice(1));
            } else {
                propA = a[location].toLowerCase();
                propB = b[location].toLowerCase();
            }
            if (propA < propB) {
                return -1;
            } else if (propA > propB) {
                return 1;
            } else {
                return 0;
            }
        });
    },

    sortLessons: function(subject) {
        this.lessons.sort(function(a, b) {
            let propA, propB;
            if (subject === 'price') {
                propA = parseFloat(a[subject].slice(1));
                propB = parseFloat(b[subject].slice(1));
            } else {
                propA = a[subject].toLowerCase();
                propB = b[subject].toLowerCase();
            }
            if (propA < propB) {
                return -1;
            } else if (propA > propB) {
                return 1;
            } else {
                return 0;
            }
        });
    },

    sortLessons: function(price) {
    if (price === 'price') {
        this.lessons.sort(function(a, b) {
            let propA = parseFloat(a[price].slice(1));
            let propB = parseFloat(b[price].slice(1));
            return propA - propB;
        });
    } else {
        this.lessons.sort(function(a, b) {
            let propA = a[price].toLowerCase();
            let propB = b[price].toLowerCase();
            if (propA < propB) {
                return -1;
            } else if (propA > propB) {
                return 1;
            } else {
                return 0;
            }
        });
    }
},

},


})